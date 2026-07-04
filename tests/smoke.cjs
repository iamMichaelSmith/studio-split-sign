const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
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

async function main() {
  const port = 5155;
  const tempDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'split-sheet-open-sign-'));
  const accountEmail = 'smoke@example.com';
  const accountPass = 'smoke-pass-123';
  const child = spawn(process.execPath, ['server.js'], {
    env: {
      ...process.env,
      PORT: String(port),
      HOST: '127.0.0.1',
      PUBLIC_BASE_URL: `http://127.0.0.1:${port}`,
      DATA_DIR: tempDataDir,
      DB_PROVIDER: 'sqlite',
      DB_PATH: path.join(tempDataDir, 'app.db'),
      ADMIN_USER: 'admin-user',
      ADMIN_PASS: 'admin-pass-123',
      SESSION_SECRET: 'smoke-session-secret',
      API_TOKEN_SECRET: 'smoke-api-token-secret',
      ALLOW_PUBLIC_REGISTRATION: 'true'
    },
    stdio: 'ignore'
  });

  try {
    await waitForHttp(`http://127.0.0.1:${port}/health`);

    const health = await fetch(`http://127.0.0.1:${port}/health`);
    if (!health.ok) throw new Error('health failed');

    const ready = await fetch(`http://127.0.0.1:${port}/ready`);
    if (!ready.ok) throw new Error('ready failed');

    const apiHealth = await fetch(`http://127.0.0.1:${port}/api/health`);
    if (!apiHealth.ok) throw new Error('api health failed');

    const home = await fetch(`http://127.0.0.1:${port}/`);
    if (!home.ok) throw new Error('home failed');

    const split = await fetch(`http://127.0.0.1:${port}/split-sheet`);
    if (!split.ok) throw new Error('split form failed');

    const unauthorizedValidate = await fetch(`http://127.0.0.1:${port}/api/split-sheets/validate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({})
    });
    if (unauthorizedValidate.status !== 401) throw new Error('unauthorized validate check failed');

    const register = await fetch(`http://127.0.0.1:${port}/api/auth/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: accountEmail,
        password: accountPass,
        displayName: 'Smoke User'
      })
    });
    if (!register.ok) throw new Error('api register failed');
    const registered = await register.json();
    if (!registered.user?.id) throw new Error('registered user missing');

    const login = await fetch(`http://127.0.0.1:${port}/api/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: accountEmail,
        password: accountPass
      })
    });
    if (!login.ok) throw new Error('api login failed');
    const auth = await login.json();
    if (!auth.accessToken || !auth.refreshToken) throw new Error('auth tokens missing');

    const me = await fetch(`http://127.0.0.1:${port}/api/me`, {
      headers: { authorization: `Bearer ${auth.accessToken}` }
    });
    if (!me.ok) throw new Error('api me failed');

    const validate = await fetch(`http://127.0.0.1:${port}/api/split-sheets/validate`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${auth.accessToken}`
      },
      body: JSON.stringify({
        songTitle: 'Smoke Test Song',
        date: '2026-07-01',
        allPartiesAgree: true,
        collectSignaturesByInvite: true,
        contributors: [
          { legalName: 'Writer One', role: 'Writer', email: 'writer1@example.com', writerShare: 50, publisherShare: 50 },
          { legalName: 'Writer Two', role: 'Producer', email: 'writer2@example.com', writerShare: 50, publisherShare: 50 }
        ]
      })
    });
    if (!validate.ok) throw new Error('split validation failed');

    const draftCreate = await fetch(`http://127.0.0.1:${port}/api/split-sheets/drafts`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${auth.accessToken}`
      },
      body: JSON.stringify({
        songTitle: 'Draft Smoke Song',
        date: '2026-07-01',
        contributors: [
          { legalName: 'Draft Writer One', role: 'Writer', email: 'draft1@example.com', writerShare: 70, publisherShare: 70 }
        ]
      })
    });
    if (!draftCreate.ok) throw new Error('draft create failed');
    const createdDraft = await draftCreate.json();
    if (createdDraft.splitSheet?.status !== 'draft') throw new Error('draft status mismatch');

    const draftList = await fetch(`http://127.0.0.1:${port}/api/split-sheets`, {
      headers: { authorization: `Bearer ${auth.accessToken}` }
    });
    if (!draftList.ok) throw new Error('split list failed');
    const listed = await draftList.json();
    if (!Array.isArray(listed.splitSheets) || listed.splitSheets.length < 1) throw new Error('split list empty');

    const draftDetail = await fetch(`http://127.0.0.1:${port}/api/split-sheets/${createdDraft.splitSheet.id}`, {
      headers: { authorization: `Bearer ${auth.accessToken}` }
    });
    if (!draftDetail.ok) throw new Error('draft detail failed');

    const draftUpdate = await fetch(`http://127.0.0.1:${port}/api/split-sheets/${createdDraft.splitSheet.id}/draft`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${auth.accessToken}`
      },
      body: JSON.stringify({
        songTitle: 'Smoke Test Song',
        date: '2026-07-01',
        contributors: [
          { legalName: 'Writer One', role: 'Writer', email: 'writer1@example.com', writerShare: 50, publisherShare: 50 },
          { legalName: 'Writer Two', role: 'Producer', email: 'writer2@example.com', writerShare: 50, publisherShare: 50 }
        ]
      })
    });
    if (!draftUpdate.ok) throw new Error('draft update failed');

    const create = await fetch(`http://127.0.0.1:${port}/api/split-sheets`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${auth.accessToken}`
      },
      body: JSON.stringify({
        draftId: createdDraft.splitSheet.id,
        songTitle: 'Smoke Test Song',
        date: '2026-07-01',
        allPartiesAgree: true,
        collectSignaturesByInvite: true,
        contributors: [
          { legalName: 'Writer One', role: 'Writer', email: 'writer1@example.com', writerShare: 50, publisherShare: 50 },
          { legalName: 'Writer Two', role: 'Producer', email: 'writer2@example.com', writerShare: 50, publisherShare: 50 }
        ]
      })
    });
    if (!create.ok) throw new Error('split create failed');
    const created = await create.json();
    if (!created.splitSheet?.id) throw new Error('created split id missing');
    if (created.splitSheet.id !== createdDraft.splitSheet.id) throw new Error('draft submit should reuse id');
    if (created.splitSheet.status !== 'pending-signatures') throw new Error('submitted split status mismatch');

    const status = await fetch(`http://127.0.0.1:${port}/api/split-sheets/${created.splitSheet.id}/status`, {
      headers: { authorization: `Bearer ${auth.accessToken}` }
    });
    if (!status.ok) throw new Error('split status failed');

    const refresh = await fetch(`http://127.0.0.1:${port}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ refreshToken: auth.refreshToken })
    });
    if (!refresh.ok) throw new Error('api refresh failed');
    const refreshed = await refresh.json();
    if (!refreshed.accessToken || !refreshed.refreshToken) throw new Error('refreshed tokens missing');

    const logout = await fetch(`http://127.0.0.1:${port}/api/auth/logout`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ refreshToken: refreshed.refreshToken })
    });
    if (!logout.ok) throw new Error('api logout failed');

    console.log('smoke test passed');
  } finally {
    child.kill('SIGTERM');
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
