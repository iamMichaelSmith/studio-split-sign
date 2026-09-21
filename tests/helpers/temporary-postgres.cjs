const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { randomBytes } = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { Client } = require('pg');
const { availablePort, testEnvironment } = require('./isolated-app.cjs');

async function startTemporaryPostgres() {
  const binDirectory = process.env.RELEASE_TEST_PG_BIN || (process.platform === 'win32' ? 'C:\\Program Files\\PostgreSQL\\16\\bin' : '/usr/lib/postgresql/16/bin');
  const executable = (name) => path.join(binDirectory, name + (process.platform === 'win32' ? '.exe' : ''));
  if (!fs.existsSync(executable('initdb'))) throw new Error('Set RELEASE_TEST_PG_BIN to the PostgreSQL tools directory. No existing database will be used.');
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'sss-postgres-test-'));
  const dataDirectory = path.join(directory, 'cluster');
  const passwordPath = path.join(directory, 'password.txt');
  const password = randomBytes(24).toString('hex');
  fs.writeFileSync(passwordPath, password, { mode: 0o600 });
  const port = await availablePort();
  const environment = testEnvironment({
    PGHOST: '127.0.0.1', PGPORT: String(port), PGUSER: 'release_test', PGPASSWORD: password, PGSSLMODE: 'disable'
  });
  function run(name, args) {
    const logPath = path.join(directory, `${name}.log`);
    const log = fs.openSync(logPath, 'a');
    let result;
    try {
      result = spawnSync(executable(name), args, { env: environment, cwd: directory, windowsHide: true, stdio: ['ignore', log, log], timeout: 60000 });
    } finally {
      fs.closeSync(log);
    }
    if (result.error || result.status !== 0) throw new Error(`${name} failed: ${result.error?.message || fs.readFileSync(logPath, 'utf8')}`);
  }
  run('initdb', ['-D', dataDirectory, '-U', 'release_test', '--pwfile', passwordPath, '-A', 'scram-sha-256', '--encoding=UTF8', '--locale=C']);
  fs.unlinkSync(passwordPath);
  const serverOptions = `-h 127.0.0.1 -p ${port} -c max_connections=20${process.platform === 'win32' ? '' : " -c unix_socket_directories=''"}`;
  run('pg_ctl', ['-D', dataDirectory, '-l', path.join(directory, 'postgres.log'), '-o', serverOptions, '-w', 'start']);
  const connectionString = `postgres://release_test:${password}@127.0.0.1:${port}/postgres?sslmode=disable`;
  async function snapshot(database) {
    const client = new Client({ host: '127.0.0.1', port, user: 'release_test', password, database, ssl: false });
    await client.connect();
    try {
      const records = {};
      for (const table of ['users', 'submissions', 'auth_sessions', 'email_verification_tokens', 'password_reset_tokens']) {
        records[table] = (await client.query(`SELECT * FROM ${table} ORDER BY id`)).rows;
      }
      return records;
    } finally {
      await client.end();
    }
  }
  return {
    environment: { DB_PROVIDER: 'postgres', DATABASE_URL: connectionString, PGSSLMODE: 'disable' },
    async verifyRestore() {
      const before = await snapshot('postgres');
      const backupPath = path.join(directory, 'restore-test.dump');
      run('pg_dump', ['-Fc', '-f', backupPath, 'postgres']);
      run('createdb', ['restore_test']);
      run('pg_restore', ['--exit-on-error', '--dbname=restore_test', backupPath]);
      assert.deepEqual(await snapshot('restore_test'), before);
    },
    async stop() {
      run('pg_ctl', ['-D', dataDirectory, '-m', 'fast', '-w', 'stop']);
    }
  };
}

module.exports = { startTemporaryPostgres };
