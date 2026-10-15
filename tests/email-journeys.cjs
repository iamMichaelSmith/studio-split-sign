const assert = require('node:assert/strict');
const test = require('node:test');
const Database = require('better-sqlite3');
const { createEmailJourneyService, journeyEmail } = require('../services/email-journey-service');
const { startApp } = require('./helpers/isolated-app.cjs');
const { startSmtpSink, emailToken } = require('./helpers/smtp-sink.cjs');
const { startTemporaryPostgres } = require('./helpers/temporary-postgres.cjs');

function fixture(t, overrides = {}) {
  const db = new Database(':memory:');
  t.after(() => db.close());
  let date = new Date('2026-10-14T12:00:00Z');
  const users = new Map();
  const contacts = new Map();
  const sent = [];
  const context = {
    db, enabled: true, baseUrl: 'https://app.example.test', now: () => date,
    auth: { getUserById: async id => users.get(id) },
    contacts: { getByEmail: async email => contacts.get(email) },
    submissions: { listSubmissions: async () => [], getSubmission: async () => null },
    sendEmail: async message => { sent.push(message); return { ok: true, messageId: 'test-message' }; }, ...overrides
  };
  context.contacts.recordContact = async ({ email }) => {
    contacts.set(email, { marketingStatus: 'subscribed', unsubscribeToken: 'beta-unsubscribe' });
    return contacts.get(email);
  };
  return { db, users, contacts, sent, service: createEmailJourneyService(context), context,
    advance: days => { date = new Date(date.getTime() + days * 86400000); },
    add(id, verified = true, subscribed = true) {
      const email = `${id}@example.test`;
      users.set(id, { id, email, displayName: '<Avery>', status: 'active', planKey: 'free', emailVerifiedAt: verified ? date.toISOString() : null });
      contacts.set(email, { marketingStatus: subscribed ? 'subscribed' : 'transactional_only', unsubscribeToken: 'test-unsubscribe' });
    }
  };
}

test('journeys gate verified consent, survive restart, deduplicate enrollment and schedule all six steps', async t => {
  const f = fixture(t);
  f.add('direct'); f.add('invited'); f.add('unverified', false); f.add('no-consent', true, false);
  for (const id of f.users.keys()) await f.service.enroll({ userId: id, journey: id === 'invited' ? 'invited' : 'direct' });
  await f.service.enroll({ userId: 'invited', journey: 'direct' });
  assert.equal(f.db.prepare('SELECT journey FROM email_journey_enrollments WHERE user_id = ?').get('invited').journey, 'invited');
  assert.equal((await f.service.run('direct')).eligible, 1);
  assert.equal(f.sent.length, 0, 'Dry run must never deliver or advance');
  const restarted = createEmailJourneyService(f.context);
  await Promise.all([restarted.run('direct', { dryRun: false }), f.service.run('direct', { dryRun: false })]);
  assert.equal(f.sent.length, 1, 'Concurrent runs must only send one welcome');
  assert.match(f.sent[0].html, /&lt;Avery&gt;/);
  assert.match(f.sent[0].headers['List-Unsubscribe'], /email-preferences/);
  for (const days of [2, 2, 3, 3, 4]) {
    f.advance(days);
    await f.service.run('direct', { dryRun: false });
    await f.service.run('direct', { dryRun: false });
  }
  assert.equal(f.sent.length, 6);
  assert.equal(f.db.prepare('SELECT status FROM email_journey_enrollments WHERE user_id = ?').get('direct').status, 'completed');
  assert.ok(f.sent.every(m => m.to[0] === 'direct@example.test'));
});

test('unsubscribe suppresses later messages and uncertain delivery requires review', async t => {
  const f = fixture(t);
  f.add('artist');
  await f.service.enroll({ userId: 'artist' });
  await f.service.run('direct', { dryRun: false });
  f.contacts.get('artist@example.test').marketingStatus = 'unsubscribed';
  f.advance(3);
  assert.equal((await f.service.run('direct', { dryRun: false })).suppressed, 1);
  assert.equal(f.sent.length, 1);
  f.contacts.get('artist@example.test').marketingStatus = 'subscribed';
  f.advance(2);
  const failing = createEmailJourneyService({ ...f.context, sendEmail: async () => { throw new Error('provider timeout'); } });
  assert.equal((await failing.run('direct', { dryRun: false })).needsReview, 1);
  await f.service.run('direct', { dryRun: false });
  assert.equal(f.sent.length, 1, 'Uncertain delivery must never be blindly retried');
});

test('invited path follows current invitation and plan; direct path recognizes completed first action', async t => {
  const f = fixture(t, { submissions: { listSubmissions: async () => [{ status: 'completed' }], getSubmission: async () => null } });
  f.add('artist');
  await f.service.enroll({ userId: 'artist' });
  await f.service.run('direct', { dryRun: false });
  f.advance(2);
  assert.equal((await f.service.run('direct', { dryRun: false })).sent, 1);
  assert.match(f.sent.at(-1).subject, /first split is in motion/);
  const input = { journey: 'invited', step: 0, user: f.users.get('artist'), contact: f.contacts.get('artist@example.test'),
    invitation: { id: 'song', status: 'pending-signatures', payload: { contributors: [{ email: 'artist@example.test', signerToken: 'secret', signerTokenExpiresAt: '2099-01-01T00:00:00Z' }] } },
    activity: { createdCount: 0 }, baseUrl: f.context.baseUrl };
  assert.match(journeyEmail(input).html, /\/split-sheet\/sign\/song\/secret/);
  input.invitation.payload.contributors[0].signedAt = new Date().toISOString();
  assert.doesNotMatch(journeyEmail(input).html, /\/secret/);
  assert.match(journeyEmail({ ...input, step: 3 }).html, /Plugin access is included with Creator and Studio/);
});

test('HTTP signup enrolls direct and invited accounts; n8n token gates delivery through local mail sink', async t => {
  const mail = await startSmtpSink();
  t.after(() => mail.stop());
  const token = 'isolated-onboarding-automation-token-123456789';
  const database = process.env.RELEASE_TEST_POSTGRES === '1' ? await startTemporaryPostgres() : null;
  if (database) t.after(() => database.stop());
  const app = await startApp({ ...mail.environment, ...database?.environment, EMAIL_JOURNEYS_ENABLED: 'true', EMAIL_JOURNEYS_MODE: 'production', ONBOARDING_AUTOMATION_TOKEN: token });
  t.after(() => app.stop());
  const password = 'Onboarding-test-password-123';
  async function post(route, body, headers = {}) {
    return fetch(app.baseUrl + route, { method: 'POST', redirect: 'manual', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });
  }
  const run = (journey, dryRun = false) => post(`/api/automations/onboarding/${journey}/run`, { dryRun }, { authorization: `Bearer ${token}` });
  assert.equal((await post('/api/automations/onboarding/direct/run', {})).status, 401);
  const email = 'creator@example.test';
  assert.equal((await post('/api/auth/register', { email, password, displayName: 'Creator', marketingOptIn: true })).status, 201);
  assert.equal((await (await run('direct')).json()).sent, 0);
  const verificationToken = emailToken(mail.messages.at(-1), 'verify-email');
  assert.equal((await post('/api/auth/verify-email', { token: verificationToken })).status, 200);
  const count = mail.messages.length;
  assert.equal((await (await run('direct', true)).json()).eligible, 1);
  assert.equal(mail.messages.length, count);
  assert.equal((await (await run('direct')).json()).sent, 1);
  assert.equal((await (await run('direct')).json()).sent, 0);
  assert.equal(mail.messages.length, count + 1);
  assert.match(mail.messages.at(-1).raw, /Content-ID: <splitsheet-studio-header>/);
  assert.match(mail.messages.at(-1).raw, /Content-ID: <splitsheet-studio-logo>/);
  assert.match(mail.messages.at(-1).raw, /From: Split Sheet Studio <sender@example.test>/);

  const signedIn = await fetch(app.baseUrl + '/login', { method: 'POST', redirect: 'manual', headers: { 'content-type': 'application/x-www-form-urlencoded', origin: app.baseUrl }, body: new URLSearchParams({ email, password }) });
  const cookie = signedIn.headers.get('set-cookie').split(';')[0];
  const created = await post('/api/split-sheets', { songTitle: 'Journey Test', date: '2026-10-14', allPartiesAgree: true, collectSignaturesByInvite: true,
    contributors: [{ email: 'invitee@example.test', writerShare: 50, publisherShare: 50 }, { email: 'other@example.test', writerShare: 50, publisherShare: 50 }] }, { cookie, origin: app.baseUrl });
  assert.equal(created.status, 201);
  const id = (await created.json()).splitSheet.id;
  const detail = await fetch(app.baseUrl + `/api/split-sheets/${id}`, { headers: { cookie, origin: app.baseUrl } });
  const signer = (await detail.json()).splitSheet.payload.contributors[0];
  const next = `/split-sheet/sign/${id}/${signer.signerToken}`;
  const signup = await fetch(app.baseUrl + '/signup', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', origin: app.baseUrl }, body: new URLSearchParams({ email: signer.email, password, displayName: 'Invitee', marketingOptIn: 'yes', next }) });
  assert.equal(signup.status, 200);
  assert.equal((await (await run('invited')).json()).sent, 0);
  const inviteVerification = emailToken(mail.messages.at(-1), 'verify-email');
  await post('/api/auth/verify-email', { token: inviteVerification });
  assert.equal((await (await run('invited')).json()).sent, 1);
  assert.deepEqual(mail.messages.at(-1).recipients, [signer.email]);
  const response = await (await run('invited')).json();
  assert.equal(response.sent, 0);
  assert.ok(!JSON.stringify(response).includes(signer.email), 'n8n receives counts, not contact data');
});

test('beta only delivers to the allowlist, supports both paths at one mailbox and advances on demand', async t => {
  const f = fixture(t, { mode: 'beta', allowedRecipients: ['owner@example.test'], dayMinutes: 1 });
  await assert.rejects(f.service.startBeta({ email: 'customer@example.test', journey: 'direct' }));
  await f.service.startBeta({ email: 'owner@example.test', journey: 'direct' });
  await f.service.startBeta({ email: 'owner@example.test', journey: 'invited' });
  assert.equal((await f.service.run('direct', { dryRun: false })).sent, 1);
  assert.equal((await f.service.run('invited', { dryRun: false })).sent, 1);
  assert.match(f.sent[0].subject, /BETA direct 1\/6/);
  const states = await f.service.betaStatus();
  assert.equal(states.length, 2);
  assert.equal(Date.parse(states[0].next_due_at) - Date.parse(states[1].next_due_at), 0);
  assert.equal((await f.service.run('direct', { dryRun: false })).sent, 0);
  await f.service.advanceBeta('direct');
  assert.equal((await f.service.run('direct', { dryRun: false })).sent, 1);
  f.add('customer');
  await f.service.enroll({ userId: 'customer' });
  assert.equal((await f.service.run('direct', { dryRun: false })).suppressed, 1);
  assert.ok(f.sent.every(message => message.to[0] === 'owner@example.test'));
});

test('beta HTTP blocks out-of-list transactional mail and provides protected preview and send controls', async t => {
  const mail = await startSmtpSink();
  t.after(() => mail.stop());
  const app = await startApp({ ...mail.environment, EMAIL_JOURNEYS_ENABLED: 'true', EMAIL_JOURNEYS_MODE: 'beta',
    EMAIL_JOURNEY_BETA_RECIPIENTS: 'owner@example.test', ONBOARDING_AUTOMATION_TOKEN: 'isolated-beta-onboarding-token-123456789' });
  t.after(() => app.stop());
  const anonymous = await fetch(app.baseUrl + '/admin/email-journeys', { redirect: 'manual' });
  assert.equal(anonymous.status, 302);
  const foreign = await fetch(app.baseUrl + '/api/auth/register', { method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'customer@example.test', password: 'Beta-test-password-123', displayName: 'Customer' }) });
  assert.equal(foreign.status, 201);
  assert.equal(mail.messages.length, 0, 'Beta must block even verification mail to other recipients');
  async function form(route, body, cookie) {
    return fetch(app.baseUrl + route, { method: 'POST', redirect: 'manual', headers: { origin: app.baseUrl,
      'content-type': 'application/x-www-form-urlencoded', ...(cookie ? { cookie } : {}) }, body: new URLSearchParams(body) });
  }
  const login = await form('/admin/login', { username: 'release-admin', password: 'Release-test-admin-only-123' });
  const cookie = login.headers.get('set-cookie').split(';')[0];
  const denied = await form('/admin/email-journeys/beta/start', { journey: 'direct', email: 'customer@example.test' }, cookie);
  assert.equal(denied.status, 400);
  assert.equal(mail.messages.length, 0);
  const started = await form('/admin/email-journeys/beta/start', { journey: 'direct', email: 'owner@example.test' }, cookie);
  assert.equal(started.status, 302);
  assert.equal(mail.messages.length, 1);
  assert.deepEqual(mail.messages[0].recipients, ['owner@example.test']);
  const preview = await fetch(app.baseUrl + '/admin/email-journeys/preview/direct/0', { headers: { cookie } });
  assert.match(await preview.text(), /email-hero-session\.png/);
});

test('campaign copy has dash-free headlines, real skin artwork and plan-aware plugin actions', () => {
  const input = { user: { email: 'artist@example.test', displayName: 'Artist', planKey: 'free' }, contact: { unsubscribeToken: 'test' }, baseUrl: 'https://app.example.test' };
  for (const journey of ['direct', 'invited']) for (let step = 0; step < 6; step++) {
    const content = journeyEmail({ ...input, journey, step });
    assert.doesNotMatch(content.subject + content.headline, /[\u2013\u2014-]/);
    assert.ok(content.preheader && content.text);
    assert.match(content.html, /utm_campaign=studio_/);
  }
  const free = journeyEmail({ ...input, journey: 'direct', step: 3 });
  assert.match(free.html, /plugin-skins-collection\.png/);
  assert.match(free.text, /Midnight, Neon, Electric, Blueprint, Royal, or Walnut/);
  assert.match(free.text, /tab=plans/);
  const paid = { ...input, user: { ...input.user, planKey: 'creator' }, journey: 'direct', step: 3 };
  assert.match(journeyEmail(paid).text, /\/downloads\/plugin\/latest/);
  assert.match(journeyEmail({ ...paid, activity: { pluginDownloaded: true } }).text, /#plugin-skins/);
});

test('pending contributors defer sales and beta previews never advance a campaign', async t => {
  const f = fixture(t, { mode: 'beta', allowedRecipients: ['owner@example.test'] });
  const invitation = { status: 'pending-signatures', payload: { contributors: [{ email: 'owner@example.test' }] } };
  assert.deepEqual(journeyEmail({ journey: 'invited', step: 3, user: { email: 'owner@example.test' }, invitation }), { defer: true });
  await f.service.startBeta({ email: 'owner@example.test', journey: 'direct' });
  await assert.rejects(f.service.sendBetaPreview({ email: 'foreign@example.test', journey: 'direct', step: 3 }));
  const result = await f.service.sendBetaPreview({ email: 'owner@example.test', journey: 'direct', step: 3 });
  assert.equal(result.ok, true);
  assert.equal((await f.service.betaStatus())[0].next_step, 0);
  assert.match(f.sent[0].subject, /BETA PREVIEW/);
});
