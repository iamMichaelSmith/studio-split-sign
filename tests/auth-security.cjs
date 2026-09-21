const assert = require('node:assert/strict');
const test = require('node:test');
const Database = require('better-sqlite3');
const { createAuthService } = require('../services/auth-service');
const { PLAN_DEFINITIONS } = require('../services/plan-service');
const { validateProductionRuntime } = require('../services/runtime-config');

function fixture(options = {}) {
  const db = new Database(':memory:');
  const config = { db, tokenSecret: 'isolated-auth-regression-secret', requireEmailVerification: true, ...options };
  const auth = createAuthService(config);
  return { db, config, auth };
}

const account = { email: 'avery@example.test', password: 'Isolated-test-password-123', displayName: 'Avery Stone' };

function productionEnvironment(overrides = {}) {
  return {
    NODE_ENV: 'production',
    SESSION_SECRET: 'production-session-secret-with-enough-length',
    API_TOKEN_SECRET: 'production-api-token-secret-with-enough-length',
    PDF_LINK_SECRET: 'production-pdf-link-secret-with-enough-length',
    ADMIN_USER: 'release-admin',
    ADMIN_PASS: 'Release-admin-password-123',
    REQUIRE_EMAIL_VERIFICATION: 'true',
    AUTH_DEBUG_TOKENS: 'false',
    FROM_EMAIL: 'no-reply@example.test',
    SUPPORT_EMAIL: 'support@example.test',
    REDIS_URL: 'redis://localhost:6379',
    S3_BUCKET: 'private-artifacts',
    PGSSLMODE: 'verify-full',
    PG_SSL_REJECT_UNAUTHORIZED: 'true',
    PG_SSL_CA_PATH: __filename,
    STRIPE_SECRET_KEY: 'disabled',
    STRIPE_WEBHOOK_SECRET: 'disabled',
    ...overrides
  };
}

async function verifiedSession(auth) {
  const registered = await auth.registerUser(account);
  await auth.verifyEmailToken(registered.verificationToken);
  return auth.createSession(account);
}

test('unverified signup does not issue API credentials', async () => {
  const { db, auth } = fixture();
  try {
    const result = await auth.registerUser(account);
    assert.ok(result.verificationToken);
    assert.equal(result.accessToken, undefined);
    assert.equal(result.refreshToken, undefined);
    await assert.rejects(auth.createSession(account), { statusCode: 403 });
  } finally { db.close(); }
});

test('server restart never verifies an unverified account', async () => {
  const { db, auth, config } = fixture();
  try {
    const result = await auth.registerUser(account);
    const restarted = createAuthService(config);
    assert.equal((await restarted.getUserById(result.user.id)).emailVerifiedAt, null);
    await assert.rejects(restarted.createSession(account), { statusCode: 403 });
    await restarted.verifyEmailToken(result.verificationToken);
    assert.ok((await restarted.createSession(account)).accessToken);
  } finally { db.close(); }
});

test('previously issued unverified tokens cannot bypass verification enforcement', async () => {
  const { db, auth, config } = fixture({ requireEmailVerification: false });
  try {
    const registered = await auth.registerUser(account);
    assert.ok(registered.accessToken);
    const enforced = createAuthService({ ...config, requireEmailVerification: true });
    await assert.rejects(enforced.getSessionByAccessToken(registered.accessToken), { statusCode: 403 });
    await assert.rejects(enforced.refreshSession({ refreshToken: registered.refreshToken }), { statusCode: 403 });
  } finally { db.close(); }
});

test('inactive accounts cannot use existing access or refresh tokens', async () => {
  const { db, auth } = fixture();
  try {
    const session = await verifiedSession(auth);
    db.prepare('UPDATE users SET status = ? WHERE id = ?').run('disabled', session.user.id);
    await assert.rejects(auth.getSessionByAccessToken(session.accessToken), { statusCode: 401 });
    await assert.rejects(auth.refreshSession({ refreshToken: session.refreshToken }), { statusCode: 401 });
  } finally { db.close(); }
});

test('password reset revokes API credentials and consumes its token', async () => {
  const { db, auth } = fixture();
  try {
    const session = await verifiedSession(auth);
    const reset = await auth.createPasswordResetRequest({ email: account.email });
    await auth.resetPasswordWithToken({ token: reset.token, password: 'Replacement-test-password-456' });
    await assert.rejects(auth.getSessionByAccessToken(session.accessToken), { statusCode: 401 });
    await assert.rejects(auth.refreshSession({ refreshToken: session.refreshToken }), { statusCode: 401 });
    await assert.rejects(auth.resetPasswordWithToken({ token: reset.token, password: account.password }), { statusCode: 400 });
    await assert.rejects(auth.createSession(account), { statusCode: 401 });
    assert.ok((await auth.createSession({ ...account, password: 'Replacement-test-password-456' })).accessToken);
  } finally { db.close(); }
});

test('expired verification and reset tokens are rejected', async () => {
  const { db, auth } = fixture();
  try {
    const registered = await auth.registerUser(account);
    db.prepare('UPDATE email_verification_tokens SET expires_at = ?').run('2000-01-01T00:00:00.000Z');
    await assert.rejects(auth.verifyEmailToken(registered.verificationToken), { statusCode: 400 });
    const reset = await auth.createPasswordResetRequest({ email: account.email });
    db.prepare('UPDATE password_reset_tokens SET expires_at = ?').run('2000-01-01T00:00:00.000Z');
    await assert.rejects(auth.resetPasswordWithToken({ token: reset.token, password: account.password }), { statusCode: 400 });
  } finally { db.close(); }
});

test('refresh rotation and logout revoke superseded credentials', async () => {
  const { db, auth } = fixture();
  try {
    const session = await verifiedSession(auth);
    const next = await auth.refreshSession({ refreshToken: session.refreshToken });
    await assert.rejects(auth.getSessionByAccessToken(session.accessToken), { statusCode: 401 });
    await assert.rejects(auth.refreshSession({ refreshToken: session.refreshToken }), { statusCode: 401 });
    assert.equal(await auth.revokeSessionByRefreshToken(next.refreshToken), true);
    await assert.rejects(auth.getSessionByAccessToken(next.accessToken), { statusCode: 401 });
  } finally { db.close(); }
});

test('social sign-in creates verified accounts and keeps inactive users blocked', async () => {
  const { db, auth } = fixture();
  try {
    const user = await auth.findOrCreateProviderUser({
      email: 'social@example.test',
      displayName: 'Social User',
      emailVerifiedAt: '2026-09-13T00:00:00.000Z'
    });
    assert.equal(user.email, 'social@example.test');
    assert.equal(user.displayName, 'Social User');
    assert.equal(user.emailVerifiedAt, '2026-09-13T00:00:00.000Z');

    const same = await auth.findOrCreateProviderUser({
      email: 'SOCIAL@example.test',
      displayName: 'Ignored New Name',
      emailVerifiedAt: '2026-09-14T00:00:00.000Z'
    });
    assert.equal(same.id, user.id);
    assert.equal(same.displayName, 'Social User');

    db.prepare('UPDATE users SET status = ? WHERE id = ?').run('disabled', user.id);
    await assert.rejects(auth.findOrCreateProviderUser({
      email: 'social@example.test',
      displayName: 'Social User'
    }), { statusCode: 401 });
  } finally { db.close(); }
});

test('production Stripe configuration requires a webhook signing secret', () => {
  assert.doesNotThrow(() => validateProductionRuntime({
    environment: productionEnvironment(),
    baseUrl: 'https://app.example.test',
    dbProvider: 'postgres',
    sessionStoreMode: 'redis',
    cookieSecure: true,
    pdfStorageMode: 's3'
  }));

  assert.throws(() => validateProductionRuntime({
    environment: productionEnvironment({
      STRIPE_SECRET_KEY: 'sk_live_testvalue',
      STRIPE_WEBHOOK_SECRET: ''
    }),
    baseUrl: 'https://app.example.test',
    dbProvider: 'postgres',
    sessionStoreMode: 'redis',
    cookieSecure: true,
    pdfStorageMode: 's3'
  }), /STRIPE_WEBHOOK_SECRET is required/);
});

test('production contact export token must be strong when configured', () => {
  assert.throws(() => validateProductionRuntime({
    environment: productionEnvironment({
      CONTACT_EXPORT_TOKEN: 'short'
    }),
    baseUrl: 'https://app.example.test',
    dbProvider: 'postgres',
    sessionStoreMode: 'redis',
    cookieSecure: true,
    pdfStorageMode: 's3'
  }), /CONTACT_EXPORT_TOKEN must be at least 32 characters/);
});

test('launch pricing model is wired into plan definitions', () => {
  assert.equal(PLAN_DEFINITIONS.free.monthlySheetLimit, 3);
  assert.equal(PLAN_DEFINITIONS.creator.monthlyPriceUsdCents, 700);
  assert.equal(PLAN_DEFINITIONS.creator.annualPriceUsdCents, 7000);
  assert.equal(PLAN_DEFINITIONS.creator.monthlySheetLimit, 25);
  assert.equal(PLAN_DEFINITIONS.studio_pro.name, 'Studio');
  assert.equal(PLAN_DEFINITIONS.studio_pro.monthlyPriceUsdCents, 1900);
  assert.equal(PLAN_DEFINITIONS.studio_pro.annualPriceUsdCents, 19000);
  assert.equal(PLAN_DEFINITIONS.studio_pro.monthlySheetLimit, 150);
});
