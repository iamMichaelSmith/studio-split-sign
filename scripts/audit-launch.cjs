// Isolated audit reproduction. No production credentials, payments, or email delivery.
const fs = require('node:fs');
const path = require('node:path');
const Stripe = require('stripe');
const { startApp } = require('../tests/helpers/isolated-app.cjs');
const { startSmtpSink, emailToken } = require('../tests/helpers/smtp-sink.cjs');
const { startTemporaryPostgres } = require('../tests/helpers/temporary-postgres.cjs');

async function main() {
  const mail = await startSmtpSink();
  let app;
  let database;
  const observations = [];
  try {
    const webhookSecret = 'whsec_isolated_audit_not_production';
    if (process.env.RELEASE_TEST_POSTGRES === '1') database = await startTemporaryPostgres();
    app = await startApp({ ...mail.environment, ...database?.environment, STRIPE_SECRET_KEY: 'sk_test_isolated_audit_not_real', STRIPE_WEBHOOK_SECRET: webhookSecret });
    const password = 'Isolated-audit-password-123';
    async function json(route, method = 'GET', body, token) {
      const r = await fetch(app.baseUrl + route, { method, redirect: 'manual', headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
      return { status: r.status, body: await r.json() };
    }
    async function form(route, body, cookie) {
      return fetch(app.baseUrl + route, { method: 'POST', redirect: 'manual', headers: { origin: app.baseUrl, 'content-type': 'application/x-www-form-urlencoded', ...(cookie ? { cookie } : {}) }, body: new URLSearchParams(body) });
    }
    async function user(email) {
      const registration = await json('/api/auth/register', 'POST', { email, password, displayName: 'Audit fixture' });
      if (registration.status !== 201) throw new Error('Fixture registration failed');
      await json('/api/auth/verify-email', 'POST', { token: emailToken(mail.messages.at(-1), 'verify-email') });
      const login = await json('/api/auth/login', 'POST', { email, password });
      const browserLogin = await form('/login', { email, password });
      return { ...login.body, cookie: browserLogin.headers.get('set-cookie').split(';')[0] };
    }
    const owner = await user('audit-owner@example.test');
    const payload = (title) => ({ songTitle: title, date: '2026-10-02', allPartiesAgree: true, collectSignaturesByInvite: true, contributors: [{ legalName: 'Audit Writer', role: 'Writer', email: 'audit-writer@example.test', writerShare: 50, publisherShare: 50 }, { legalName: 'Audit Producer', role: 'Producer', email: 'audit-producer@example.test', writerShare: 50, publisherShare: 50 }] });
    const created = await json('/api/split-sheets', 'POST', payload('Audit API Free'), owner.accessToken);
    if (created.status !== 201) throw new Error(JSON.stringify(created));
    observations.push({ check: 'Free account can create via plugin API', status: created.status, plan: owner.user.planKey });
    const id = created.body.splitSheet.id;
    const detail = await json(`/api/split-sheets/${id}`, 'GET', undefined, owner.accessToken);
    const usageBefore = await json('/api/account/usage', 'GET', undefined, owner.accessToken);
    const archived = await form(`/account/split-sheets/${id}/archive`, {}, owner.cookie);
    const usageAfter = await json('/api/account/usage', 'GET', undefined, owner.accessToken);
    observations.push({ check: 'Archive restores monthly allowance', archiveStatus: archived.status, before: usageBefore.body.usage.used, after: usageAfter.body.usage.used });
    const signer = detail.body.splitSheet.payload.contributors[0];
    const signUrl = `${app.baseUrl}/split-sheet/sign/${id}/${signer.signerToken}`;
    if (signUrl) {
      const r = await fetch(signUrl);
      await r.text();
      observations.push({ check: 'Signing token appears in application access log', exposed: app.getOutput().includes(new URL(signUrl).pathname) });
    }
    const concurrent = await user('audit-concurrent@example.test');
    const submits = await Promise.all(Array.from({ length: 4 }, (_, i) => json('/api/split-sheets', 'POST', payload(`Audit concurrent ${i}`), concurrent.accessToken)));
    const concurrentUsage = await json('/api/account/usage', 'GET', undefined, concurrent.accessToken);
    observations.push({ check: 'Concurrent quota enforcement', statuses: submits.map(r => r.status), used: concurrentUsage.body.usage.used, limit: concurrentUsage.body.usage.limit });
    const stripe = new Stripe('sk_test_isolated_audit_not_real');
    async function webhook(type, object, eventId) {
      const raw = JSON.stringify({ id: eventId, object: 'event', type, created: Math.floor(Date.now() / 1000), data: { object } });
      const signature = stripe.webhooks.generateTestHeaderString({ payload: raw, secret: webhookSecret });
      const response = await fetch(app.baseUrl + '/api/stripe/webhook', { method: 'POST', headers: { 'content-type': 'application/json', 'stripe-signature': signature }, body: raw });
      await response.text();
      return response.status;
    }
    const unsignedPayment = await webhook('checkout.session.completed', { id: 'cs_audit_unpaid', mode: 'subscription', payment_status: 'unpaid', status: 'complete', client_reference_id: owner.user.id, customer: 'cus_audit', subscription: 'sub_audit_old', metadata: { checkoutType: 'subscription_plan', userId: owner.user.id, planKey: 'creator' } }, 'evt_audit_unpaid');
    const unpaidPlan = await json('/api/me', 'GET', undefined, owner.accessToken);
    observations.push({ check: 'Unpaid checkout event grants paid plan', status: unsignedPayment, plan: unpaidPlan.body.user.planKey });
    await webhook('customer.subscription.updated', { id: 'sub_audit_new', customer: 'cus_audit', status: 'active', metadata: { userId: owner.user.id, planKey: 'studio_pro' } }, 'evt_audit_new');
    await webhook('customer.subscription.deleted', { id: 'sub_audit_old', customer: 'cus_audit', status: 'canceled', metadata: { userId: owner.user.id, planKey: 'creator' } }, 'evt_audit_old_deleted');
    const stalePlan = await json('/api/me', 'GET', undefined, owner.accessToken);
    observations.push({ check: 'Old subscription cancellation overrides new active subscription', plan: stalePlan.body.user.planKey });
    observations.push({ check: 'Local-only email sink', messages: mail.messages.length });
  } finally {
    if (app) await app.stop();
    if (database) await database.stop();
    await mail.stop();
  }
  const directory = path.resolve(__dirname, '../docs/audits/2026-10-02');
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, `isolated-observations${database ? '-postgres' : ''}.json`), JSON.stringify(observations, null, 2));
  console.log(JSON.stringify(observations, null, 2));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
