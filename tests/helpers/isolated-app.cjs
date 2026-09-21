const { spawn } = require('node:child_process');
const { once } = require('node:events');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');

const serverPath = path.resolve(__dirname, '../../server.js');

function testEnvironment(overrides = {}) {
  const allowed = new Set(['path', 'systemroot', 'windir', 'comspec', 'temp', 'tmp', 'home', 'userprofile', 'appdata', 'localappdata']);
  const system = Object.fromEntries(Object.entries(process.env).filter(([name]) => allowed.has(name.toLowerCase())));
  return {
    ...system,
    NODE_ENV: 'test',
    HOST: '127.0.0.1',
    ROOT_DOMAIN: 'splitsheetstudio.test',
    DB_PROVIDER: 'sqlite',
    SESSION_STORE: 'memory',
    PDF_STORAGE: 'local',
    COOKIE_SECURE: 'false',
    TRUST_PROXY: 'false',
    CSRF_PROTECTION_ENABLED: 'true',
    REQUIRE_EMAIL_VERIFICATION: 'true',
    ALLOW_PUBLIC_REGISTRATION: 'true',
    AUTH_DEBUG_TOKENS: 'false',
    AUTO_SIGNER_REMINDERS: 'false',
    AWS_EC2_METADATA_DISABLED: 'true',
    STRIPE_SECRET_KEY: 'disabled',
    STRIPE_WEBHOOK_SECRET: 'disabled',
    NOTIFY_EMAIL: 'operator@example.test',
    ADMIN_USER: 'release-admin',
    ADMIN_PASS: 'Release-test-admin-only-123',
    SESSION_SECRET: 'release-test-session-secret-never-production',
    API_TOKEN_SECRET: 'release-test-api-secret-never-production',
    PDF_LINK_SECRET: 'release-test-pdf-link-secret-never-production',
    CONTACT_EXPORT_TOKEN: 'release-test-contact-export-token-never-production',
    ...overrides
  };
}

async function availablePort() {
  const server = net.createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  return port;
}

async function startApp(overrides = {}) {
  const port = await availablePort();
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'sss-release-test-'));
  const baseUrl = `http://127.0.0.1:${port}`;
  const environment = testEnvironment({
    PORT: String(port),
    PUBLIC_BASE_URL: baseUrl,
    DATA_DIR: directory,
    DB_PATH: path.join(directory, 'app.db'),
    ...overrides
  });
  let child;
  let output = '';
  async function start() {
    child = spawn(process.execPath, [serverPath], { cwd: directory, env: environment, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    child.stdout.on('data', (chunk) => { output += chunk; });
    child.stderr.on('data', (chunk) => { output += chunk; });
    for (let attempt = 0; attempt < 80; attempt += 1) {
      if (child.exitCode !== null) throw new Error(`Isolated app exited: ${output}`);
      try {
        const response = await fetch(`${baseUrl}/health`, { signal: AbortSignal.timeout(1000) });
        if (response.ok) return;
      } catch {}
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    await stop();
    throw new Error(`Isolated app did not start: ${output}`);
  }
  async function stop() {
    if (child && child.exitCode === null && child.signalCode === null) {
      const ended = once(child, 'exit');
      child.kill();
      await ended;
    }
    child = undefined;
  }
  await start();
  return { baseUrl, directory, environment, start, stop, getOutput: () => output };
}

module.exports = { availablePort, startApp, testEnvironment };
