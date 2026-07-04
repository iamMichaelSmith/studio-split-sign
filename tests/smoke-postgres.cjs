const { spawn } = require('node:child_process');
const path = require('node:path');

async function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function waitForHttp(url, attempts = 30, delayMs = 500) {
  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await wait(delayMs);
  }
  throw new Error(`http not ready: ${url}`);
}

async function waitForPostgres(url, attempts = 40) {
  const { Client } = await import('pg');
  for (let index = 0; index < attempts; index += 1) {
    const client = new Client({ connectionString: url, ssl: false });
    try {
      await client.connect();
      await client.query('select 1');
      await client.end();
      return;
    } catch {
      try { await client.end(); } catch {}
      await wait(1500);
    }
  }
  throw new Error('postgres not ready');
}

async function main() {
  const port = 5156;
  const databaseUrl = 'postgres://splitsheet:splitsheet@127.0.0.1:54329/splitsheet_dev?sslmode=disable';
  await waitForPostgres(databaseUrl);

  const accountEmail = 'pg-smoke@example.com';
  const accountPass = 'pg-smoke-pass-123';
  const child = spawn(process.execPath, ['server.js'], {
    env: {
      ...process.env,
      PORT: String(port),
      HOST: '127.0.0.1',
      PUBLIC_BASE_URL: `http://127.0.0.1:${port}`,
      DB_PROVIDER: 'postgres',
      DATABASE_URL: databaseUrl,
      ALLOW_PUBLIC_REGISTRATION: 'true',
      ADMIN_USER: 'admin-user',
      ADMIN_PASS: 'admin-pass-123',
      SESSION_SECRET: 'pg-smoke-session-secret',
      API_TOKEN_SECRET: 'pg-smoke-api-token-secret'
    },
    stdio: 'ignore'
  });

  try {
    await waitForHttp(`http://127.0.0.1:${port}/health`);

    const health = await fetch(`http://127.0.0.1:${port}/health`);
    if (!health.ok) throw new Error('health failed');

    const ready = await fetch(`http://127.0.0.1:${port}/api/ready`);
    if (!ready.ok) throw new Error('api ready failed');
    const readyJson = await ready.json();
    if (readyJson.dbProvider !== 'postgres') throw new Error('postgres provider not active');

    const register = await fetch(`http://127.0.0.1:${port}/api/auth/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: accountEmail,
        password: accountPass,
        displayName: 'PG Smoke User'
      })
    });
    if (!register.ok) throw new Error('register failed');
    const auth = await register.json();

    const draftCreate = await fetch(`http://127.0.0.1:${port}/api/split-sheets/drafts`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${auth.accessToken}`
      },
      body: JSON.stringify({
        songTitle: 'Postgres Draft Song',
        date: '2026-07-01',
        contributors: [
          { legalName: 'Writer One', role: 'Writer', email: 'writer1@example.com', writerShare: 50, publisherShare: 50 },
          { legalName: 'Writer Two', role: 'Producer', email: 'writer2@example.com', writerShare: 50, publisherShare: 50 }
        ]
      })
    });
    if (!draftCreate.ok) throw new Error('draft create failed');
    const createdDraft = await draftCreate.json();

    const finalize = await fetch(`http://127.0.0.1:${port}/api/split-sheets`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${auth.accessToken}`
      },
      body: JSON.stringify({
        draftId: createdDraft.splitSheet.id,
        songTitle: 'Postgres Final Song',
        date: '2026-07-01',
        allPartiesAgree: true,
        collectSignaturesByInvite: true,
        contributors: [
          { legalName: 'Writer One', role: 'Writer', email: 'writer1@example.com', writerShare: 50, publisherShare: 50 },
          { legalName: 'Writer Two', role: 'Producer', email: 'writer2@example.com', writerShare: 50, publisherShare: 50 }
        ]
      })
    });
    if (!finalize.ok) throw new Error('finalize failed');
    const finalJson = await finalize.json();

    const status = await fetch(`http://127.0.0.1:${port}/api/split-sheets/${finalJson.splitSheet.id}/status`, {
      headers: { authorization: `Bearer ${auth.accessToken}` }
    });
    if (!status.ok) throw new Error('status failed');

    console.log('postgres smoke test passed');
  } finally {
    child.kill('SIGTERM');
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
