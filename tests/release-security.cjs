const assert = require('node:assert/strict');
const test = require('node:test');
const { startApp } = require('./helpers/isolated-app.cjs');
const { startSmtpSink, emailToken } = require('./helpers/smtp-sink.cjs');
const { startTemporaryPostgres } = require('./helpers/temporary-postgres.cjs');

const password = 'Isolated-release-password-123';
const signature = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

function splitPayload(songTitle) {
  return {
    songTitle, date: '2026-09-02', allPartiesAgree: true, collectSignaturesByInvite: true,
    contributors: [
      { legalName: 'Avery Stone', role: 'Writer', email: 'avery-contributor@example.test', writerShare: 50, publisherShare: 50 },
      { legalName: 'Jordan Reed', role: 'Producer', email: 'jordan-contributor@example.test', writerShare: 50, publisherShare: 50 }
    ]
  };
}

test(`isolated HTTP release security and remote signing (${process.env.RELEASE_TEST_POSTGRES === '1' ? 'PostgreSQL' : 'SQLite'})`, async (suite) => {
  const mail = await startSmtpSink();
  let database;
  let app;
  suite.after(async () => {
    try {
      if (app) await app.stop();
    } finally {
      try {
        if (database) await database.stop();
      } finally {
        await mail.stop();
      }
    }
  });
  if (process.env.RELEASE_TEST_POSTGRES === '1') database = await startTemporaryPostgres();
  app = await startApp({ ...mail.environment, ...database?.environment });
  async function json(route, { method = 'GET', body, token, status = 200 } = {}) {
    const response = await fetch(app.baseUrl + route, {
      method, redirect: 'manual',
      headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    const result = await response.json();
    assert.equal(response.status, status, `${method} ${route}: ${JSON.stringify(result)}`);
    return result;
  }
  async function form(route, body, cookie, origin = app.baseUrl) {
    return fetch(app.baseUrl + route, {
      method: 'POST', redirect: 'manual',
      headers: { 'content-type': 'application/x-www-form-urlencoded', origin, ...(cookie ? { cookie } : {}) },
      body: new URLSearchParams(body)
    });
  }
  async function register(email) {
    return json('/api/auth/register', { method: 'POST', status: 201, body: { email, password, displayName: 'Release Test User' } });
  }
  async function verifyLatest() {
    const token = emailToken(mail.messages.at(-1), 'verify-email');
    await json('/api/auth/verify-email', { method: 'POST', body: { token } });
    await json('/api/auth/verify-email', { method: 'POST', body: { token }, status: 400 });
  }
  async function login(email, loginPassword = password) {
    return json('/api/auth/login', { method: 'POST', body: { email, password: loginPassword } });
  }
  const ownerEmail = 'owner@example.test';
  let owner;
  let outsider;
  let browserCookie;
  let completed;
  let draftId;

  await suite.test('signup requires email verification, including after restart', async () => {
    const registration = await register(ownerEmail);
    assert.equal(registration.accessToken, undefined);
    assert.equal(registration.refreshToken, undefined);
    assert.equal(registration.verificationToken, undefined);
    assert.deepEqual(mail.messages.at(-1).recipients, [ownerEmail]);
    await json('/api/auth/login', { method: 'POST', body: { email: ownerEmail, password }, status: 403 });
    await app.stop();
    await app.start();
    await json('/api/auth/login', { method: 'POST', body: { email: ownerEmail, password }, status: 403 });
    await verifyLatest();
    owner = await login(ownerEmail);
    await register('outsider@example.test');
    await verifyLatest();
    outsider = await login('outsider@example.test');
  });

  await suite.test('web login blocks foreign origins and external redirects; user cannot access admin', async () => {
    const blocked = await form('/login', { email: ownerEmail, password }, undefined, 'https://attacker.example');
    assert.equal(blocked.status, 403);
    const response = await form('/login', { email: ownerEmail, password, next: 'https://attacker.example' });
    assert.equal(response.status, 302);
    assert.equal(response.headers.get('location'), '/account');
    browserCookie = response.headers.get('set-cookie').split(';')[0];
    assert.match(response.headers.get('set-cookie'), /HttpOnly/i);
    assert.match(response.headers.get('set-cookie'), /SameSite=Lax/i);
    const account = await fetch(app.baseUrl + '/account', { headers: { cookie: browserCookie }, redirect: 'manual' });
    assert.equal(account.status, 200);
    const admin = await fetch(app.baseUrl + '/admin', { headers: { cookie: browserCookie }, redirect: 'manual' });
    assert.equal(admin.status, 302);
    assert.equal(admin.headers.get('location'), '/admin/login');
  });

  await suite.test('writer totals are enforced and drafts are private', async () => {
    const payload = splitPayload('Midnight Signal');
    for (const writerShare of [49, 51]) {
      await json('/api/split-sheets/validate', {
        method: 'POST', token: owner.accessToken, status: 400,
        body: { ...payload, contributors: [{ ...payload.contributors[0], writerShare }, payload.contributors[1]] }
      });
    }
    await json('/api/split-sheets/validate', { method: 'POST', token: owner.accessToken, body: payload });
    const draft = await json('/api/split-sheets/drafts', { method: 'POST', token: owner.accessToken, status: 201, body: payload });
    draftId = draft.splitSheet.id;
    const route = `/api/split-sheets/${draft.splitSheet.id}`;
    await json(route, { status: 401 });
    await json(route, { token: outsider.accessToken, status: 403 });
    await json(route + '/status', { token: outsider.accessToken, status: 403 });
    await json(route + '/draft', { method: 'PUT', body: payload, token: outsider.accessToken, status: 403 });
    await json('/api/split-sheets', { method: 'POST', token: outsider.accessToken, status: 403, body: { ...payload, draftId: draft.splitSheet.id } });
    const list = await json('/api/split-sheets', { token: outsider.accessToken });
    assert.equal(list.splitSheets.length, 0);
  });

  await suite.test('all signers must agree before completion; final PDF is emailed locally to both', async () => {
    const created = await json('/api/split-sheets', {
      method: 'POST', token: owner.accessToken, status: 201, body: { ...splitPayload('Midnight Signal'), draftId }
    });
    assert.equal(created.splitSheet.id, draftId);
    const route = `/api/split-sheets/${created.splitSheet.id}`;
    let detail = (await json(route, { token: owner.accessToken })).splitSheet;
    assert.equal(detail.status, 'pending-signatures');
    const tokens = detail.payload.contributors.map((contributor) => contributor.signerToken);
    const signRoute = (token) => `/split-sheet/sign/${detail.id}/${token}`;
    const invalid = await form(signRoute('invalid'), { typedSignatureName: 'Avery Stone', signatureData: signature, agreeToSplits: 'yes' });
    assert.equal(invalid.status, 404);
    const missingAgreement = await form(signRoute(tokens[0]), { typedSignatureName: 'Avery Stone', signatureData: signature });
    assert.equal(missingAgreement.status, 400);
    const mailCount = mail.messages.length;
    const first = await form(signRoute(tokens[0]), { typedSignatureName: 'Avery Stone', signatureData: signature, agreeToSplits: 'yes' });
    assert.equal(first.status, 200);
    detail = (await json(route, { token: owner.accessToken })).splitSheet;
    assert.equal(detail.status, 'pending-signatures');
    assert.equal(detail.payload.contributors.filter((contributor) => contributor.signedAt).length, 1);
    assert.equal(mail.messages.length, mailCount, 'No completion email before the last signer');
    const last = await form(signRoute(tokens[1]), { typedSignatureName: 'Jordan Reed', signatureData: signature, agreeToSplits: 'yes' });
    assert.equal(last.status, 200);
    completed = (await json(route, { token: owner.accessToken })).splitSheet;
    assert.equal(completed.status, 'completed');
    assert.ok(completed.payload.auditChecksum);
    assert.match(completed.pdfUrl, /\/split-sheet\/pdf\/[^?]+\?token=/);
    const delivery = mail.messages.at(-1);
    assert.ok(delivery.recipients.includes('avery-contributor@example.test'));
    assert.ok(delivery.recipients.includes('jordan-contributor@example.test'));
    assert.match(delivery.raw, /Content-Type: application\/pdf/i);
    assert.match(delivery.raw, /JVBERi0/);
    const barePdf = await fetch(`${app.baseUrl}/split-sheet/pdf/${completed.id}`, { redirect: 'manual' });
    assert.equal(barePdf.status, 403);
    const tokenPdf = await fetch(completed.pdfUrl, { redirect: 'manual' });
    assert.equal(tokenPdf.status, 200);
    assert.match(Buffer.from(await tokenPdf.arrayBuffer()).toString('utf8', 0, 5), /^%PDF/);
    const finalMailCount = mail.messages.length;
    const replay = await form(signRoute(tokens[1]), { typedSignatureName: 'Changed Name', signatureData: signature, agreeToSplits: 'yes' });
    assert.equal(replay.status, 200);
    assert.equal(mail.messages.length, finalMailCount);
    const after = (await json(route, { token: owner.accessToken })).splitSheet;
    assert.deepEqual(after.payload, completed.payload);
  });

  await suite.test('submitted documents cannot be overwritten through draft finalization', async () => {
    assert.ok(completed);
    await json('/api/split-sheets', {
      method: 'POST', token: owner.accessToken, status: 409,
      body: { ...splitPayload('Overwrite Attempt'), draftId: completed.id }
    });
    const after = (await json(`/api/split-sheets/${completed.id}`, { token: owner.accessToken })).splitSheet;
    assert.deepEqual(after.payload, completed.payload);
  });

  await suite.test('revisions require ownership and preserve the signed original', async () => {
    assert.ok(completed);
    const revision = { ...splitPayload('Midnight Signal'), revisionOfId: completed.id, revisionOfVersion: 999 };
    await json('/api/split-sheets', { method: 'POST', token: outsider.accessToken, body: revision, status: 403 });
    const created = await json('/api/split-sheets', { method: 'POST', token: owner.accessToken, body: revision, status: 201 });
    const detail = (await json(`/api/split-sheets/${created.splitSheet.id}`, { token: owner.accessToken })).splitSheet;
    assert.notEqual(detail.id, completed.id);
    assert.equal(detail.status, 'pending-signatures');
    assert.equal(detail.payload.revisionOfVersion, completed.payload.version);
    assert.ok(detail.payload.contributors.every((contributor) => !contributor.signedAt));
    await json('/api/split-sheets', {
      method: 'POST', token: owner.accessToken, status: 409,
      body: { ...revision, revisionOfId: detail.id }
    });
    const original = (await json(`/api/split-sheets/${completed.id}`, { token: owner.accessToken })).splitSheet;
    assert.deepEqual(original.payload, completed.payload);
  });

  await suite.test('concurrent remote signatures do not overwrite or duplicate completion', async () => {
    const created = await json('/api/split-sheets', {
      method: 'POST', token: owner.accessToken, status: 201, body: splitPayload('Concurrent Handoff')
    });
    const route = `/api/split-sheets/${created.splitSheet.id}`;
    const detail = (await json(route, { token: owner.accessToken })).splitSheet;
    const tokens = detail.payload.contributors.map((contributor) => contributor.signerToken);
    const beforeSigningMailCount = mail.messages.length;
    const signRoute = (token) => `/split-sheet/sign/${detail.id}/${token}`;
    const [first, second] = await Promise.all([
      form(signRoute(tokens[0]), { typedSignatureName: 'Avery Stone', signatureData: signature, agreeToSplits: 'yes' }),
      form(signRoute(tokens[1]), { typedSignatureName: 'Jordan Reed', signatureData: signature, agreeToSplits: 'yes' })
    ]);
    assert.equal(first.status, 200);
    assert.equal(second.status, 200);
    const after = (await json(route, { token: owner.accessToken })).splitSheet;
    assert.equal(after.status, 'completed');
    assert.equal(after.payload.contributors.filter((contributor) => contributor.signedAt).length, 2);
    assert.ok(after.payload.auditTrail.filter((event) => event.type === 'split-sheet-finalized').length <= 1);
    assert.equal(mail.messages.length, beforeSigningMailCount + 1);
  });

  await suite.test('password reset revokes browser, access and refresh sessions', async () => {
    const response = await json('/api/auth/request-password-reset', { method: 'POST', body: { email: ownerEmail } });
    const unknown = await json('/api/auth/request-password-reset', { method: 'POST', body: { email: 'not-registered@example.test' } });
    assert.deepEqual(unknown, response, 'Public recovery response must not expose whether an account exists');
    assert.equal(response.resetToken, undefined);
    const token = emailToken(mail.messages.at(-1), 'reset-password');
    const newPassword = password + '-new';
    await json('/api/auth/reset-password', { method: 'POST', body: { token, password: newPassword } });
    await json('/api/auth/reset-password', { method: 'POST', body: { token, password }, status: 400 });
    await json('/api/me', { token: owner.accessToken, status: 401 });
    await json('/api/auth/refresh', { method: 'POST', body: { refreshToken: owner.refreshToken }, status: 401 });
    const account = await fetch(app.baseUrl + '/account', { headers: { cookie: browserCookie }, redirect: 'manual' });
    assert.equal(account.status, 302);
    assert.match(account.headers.get('location'), /^\/login/);
    await login(ownerEmail, newPassword);
  });

  await suite.test('verification recovery does not expose account existence or email HTML injection', async () => {
    const displayName = '<b>Release Test</b>';
    await json('/api/auth/register', {
      method: 'POST', status: 201, body: { email: 'pending@example.test', password, displayName }
    });
    const emailHtml = mail.messages.at(-1).raw.replace(/=\r\n/g, '');
    assert.ok(!emailHtml.includes(displayName));
    assert.match(emailHtml, /&lt;b&gt;Release Test&lt;\/b&gt;/);
    const existing = await json('/api/auth/resend-verification', { method: 'POST', body: { email: 'pending@example.test' } });
    const unknown = await json('/api/auth/resend-verification', { method: 'POST', body: { email: 'not-registered@example.test' } });
    assert.deepEqual(existing, unknown);
  });

  await suite.test('admin login rotates the session identifier', async () => {
    const user = await form('/login', { email: ownerEmail, password: password + '-new' });
    assert.equal(user.status, 302);
    const userCookie = user.headers.get('set-cookie').split(';')[0];
    const admin = await form('/admin/login', { username: 'release-admin', password: 'Release-test-admin-only-123' }, userCookie);
    assert.equal(admin.status, 302);
    const adminCookie = admin.headers.get('set-cookie').split(';')[0];
    assert.notEqual(adminCookie, userCookie);
    const oldSession = await fetch(app.baseUrl + '/account', { headers: { cookie: userCookie }, redirect: 'manual' });
    assert.equal(oldSession.status, 302);
    const newSession = await fetch(app.baseUrl + '/admin', { headers: { cookie: adminCookie }, redirect: 'manual' });
    assert.equal(newSession.status, 200);
  });

  await suite.test('login rate limiting returns 429 and Retry-After', async () => {
    let limited;
    for (let attempt = 0; attempt < 11; attempt += 1) {
      const response = await fetch(app.baseUrl + '/api/auth/login', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: 'not-registered@example.test', password })
      });
      if (response.status === 429) { limited = response; break; }
      assert.equal(response.status, 401);
    }
    assert.ok(limited);
    assert.ok(Number(limited.headers.get('retry-after')) > 0);
  });

  if (database) {
    await suite.test('PostgreSQL backup restores identical account and split records', async () => {
      await app.stop();
      await database.verifyRestore();
    });
  }
});
