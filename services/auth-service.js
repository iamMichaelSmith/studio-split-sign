const crypto = require("crypto");
const { nanoid } = require("nanoid");

class ApiAuthError extends Error {
  constructor(message, statusCode = 401) {
    super(message);
    this.name = "ApiAuthError";
    this.statusCode = statusCode;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function hashToken(secret, token) {
  return crypto.createHash("sha256").update(`${secret}:${token}`).digest("hex");
}

function randomToken(size = 32) {
  return crypto.randomBytes(size).toString("hex");
}

function hashPassword(password) {
  const normalized = String(password || "");
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(normalized, salt, 64).toString("hex");
  return `scrypt:${salt}:${derivedKey}`;
}

function verifyPassword(password, storedHash) {
  const normalized = String(password || "");
  const parts = String(storedHash || "").split(":");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, expected] = parts;
  const actual = crypto.scryptSync(normalized, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expected, "hex"));
}

const attributionColumnNames = [
  "signup_provider",
  "first_source",
  "first_medium",
  "first_campaign",
  "first_content",
  "first_term",
  "first_landing_path",
  "first_referrer",
  "first_captured_at",
  "last_source",
  "last_medium",
  "last_campaign",
  "last_content",
  "last_term",
  "last_landing_path",
  "last_referrer",
  "last_captured_at"
];

function cleanText(value, maxLength = 240) {
  const normalized = String(value || "").trim();
  return normalized ? normalized.slice(0, maxLength) : null;
}

function normalizeAttribution(attribution = {}) {
  return {
    signupProvider: cleanText(attribution.signupProvider, 40),
    firstSource: cleanText(attribution.firstSource, 80),
    firstMedium: cleanText(attribution.firstMedium, 80),
    firstCampaign: cleanText(attribution.firstCampaign, 140),
    firstContent: cleanText(attribution.firstContent, 140),
    firstTerm: cleanText(attribution.firstTerm, 140),
    firstLandingPath: cleanText(attribution.firstLandingPath, 240),
    firstReferrer: cleanText(attribution.firstReferrer, 240),
    firstCapturedAt: cleanText(attribution.firstCapturedAt, 40),
    lastSource: cleanText(attribution.lastSource, 80),
    lastMedium: cleanText(attribution.lastMedium, 80),
    lastCampaign: cleanText(attribution.lastCampaign, 140),
    lastContent: cleanText(attribution.lastContent, 140),
    lastTerm: cleanText(attribution.lastTerm, 140),
    lastLandingPath: cleanText(attribution.lastLandingPath, 240),
    lastReferrer: cleanText(attribution.lastReferrer, 240),
    lastCapturedAt: cleanText(attribution.lastCapturedAt, 40)
  };
}

function mapUser(row) {
  if (!row) return null;
  const complimentaryPlanKey = row.complimentary_plan_key || null;
  const complimentaryExpiresAt = row.complimentary_expires_at || null;
  const complimentaryActive = Boolean(complimentaryPlanKey && (!complimentaryExpiresAt || Date.parse(complimentaryExpiresAt) > Date.now()));
  const attribution = {
    signupProvider: row.signup_provider || "",
    firstSource: row.first_source || "",
    firstMedium: row.first_medium || "",
    firstCampaign: row.first_campaign || "",
    firstContent: row.first_content || "",
    firstTerm: row.first_term || "",
    firstLandingPath: row.first_landing_path || "",
    firstReferrer: row.first_referrer || "",
    firstCapturedAt: row.first_captured_at || "",
    lastSource: row.last_source || "",
    lastMedium: row.last_medium || "",
    lastCampaign: row.last_campaign || "",
    lastContent: row.last_content || "",
    lastTerm: row.last_term || "",
    lastLandingPath: row.last_landing_path || "",
    lastReferrer: row.last_referrer || "",
    lastCapturedAt: row.last_captured_at || ""
  };
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    status: row.status,
    planKey: row.plan_key || "free",
    planUpdatedAt: row.plan_updated_at || null,
    complimentaryPlanKey,
    complimentaryReason: row.complimentary_reason || "",
    complimentaryNote: row.complimentary_note || "",
    complimentaryGrantedAt: row.complimentary_granted_at || null,
    complimentaryGrantedBy: row.complimentary_granted_by || "",
    complimentaryExpiresAt,
    complimentaryActive,
    stripeCustomerId: row.stripe_customer_id || null,
    stripeSubscriptionId: row.stripe_subscription_id || null,
    emailVerifiedAt: row.email_verified_at || null,
    passwordChangedAt: row.password_changed_at || null,
    attribution,
    signupProvider: attribution.signupProvider,
    firstSource: attribution.firstSource,
    lastSource: attribution.lastSource,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function sessionUserFromRow(row) {
  return mapUser({
    id: row.user_id,
    email: row.email,
    display_name: row.display_name,
    status: row.status,
    plan_key: row.plan_key,
    plan_updated_at: row.plan_updated_at,
    complimentary_plan_key: row.complimentary_plan_key,
    complimentary_reason: row.complimentary_reason,
    complimentary_note: row.complimentary_note,
    complimentary_granted_at: row.complimentary_granted_at,
    complimentary_granted_by: row.complimentary_granted_by,
    complimentary_expires_at: row.complimentary_expires_at,
    stripe_customer_id: row.stripe_customer_id,
    stripe_subscription_id: row.stripe_subscription_id,
    email_verified_at: row.email_verified_at,
    password_changed_at: row.password_changed_at,
    signup_provider: row.signup_provider,
    first_source: row.first_source,
    first_medium: row.first_medium,
    first_campaign: row.first_campaign,
    first_content: row.first_content,
    first_term: row.first_term,
    first_landing_path: row.first_landing_path,
    first_referrer: row.first_referrer,
    first_captured_at: row.first_captured_at,
    last_source: row.last_source,
    last_medium: row.last_medium,
    last_campaign: row.last_campaign,
    last_content: row.last_content,
    last_term: row.last_term,
    last_landing_path: row.last_landing_path,
    last_referrer: row.last_referrer,
    last_captured_at: row.last_captured_at,
    created_at: row.user_created_at,
    updated_at: row.user_updated_at
  });
}

function createSqliteAdapter(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS auth_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      access_token_hash TEXT NOT NULL UNIQUE,
      refresh_token_hash TEXT NOT NULL UNIQUE,
      access_token_expires_at TEXT NOT NULL,
      refresh_token_expires_at TEXT NOT NULL,
      ip TEXT,
      user_agent TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      last_used_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS email_verification_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_auth_sessions_refresh_expires ON auth_sessions(refresh_token_expires_at);
    CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);
    CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_expires ON email_verification_tokens(expires_at);
    CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
    CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires ON password_reset_tokens(expires_at);
  `);

  const userColumns = new Set((db.prepare(`PRAGMA table_info(users)`).all() || []).map((row) => row.name));
  if (!userColumns.has("email_verified_at")) {
    db.exec(`ALTER TABLE users ADD COLUMN email_verified_at TEXT`);
  }
  if (!userColumns.has("password_changed_at")) {
    db.exec(`ALTER TABLE users ADD COLUMN password_changed_at TEXT`);
  }
  if (!userColumns.has("plan_key")) {
    db.exec(`ALTER TABLE users ADD COLUMN plan_key TEXT`);
  }
  if (!userColumns.has("plan_updated_at")) {
    db.exec(`ALTER TABLE users ADD COLUMN plan_updated_at TEXT`);
  }
  if (!userColumns.has("stripe_customer_id")) {
    db.exec(`ALTER TABLE users ADD COLUMN stripe_customer_id TEXT`);
  }
  if (!userColumns.has("stripe_subscription_id")) {
    db.exec(`ALTER TABLE users ADD COLUMN stripe_subscription_id TEXT`);
  }
  if (!userColumns.has("complimentary_plan_key")) {
    db.exec(`ALTER TABLE users ADD COLUMN complimentary_plan_key TEXT`);
  }
  if (!userColumns.has("complimentary_reason")) {
    db.exec(`ALTER TABLE users ADD COLUMN complimentary_reason TEXT`);
  }
  if (!userColumns.has("complimentary_note")) {
    db.exec(`ALTER TABLE users ADD COLUMN complimentary_note TEXT`);
  }
  if (!userColumns.has("complimentary_granted_at")) {
    db.exec(`ALTER TABLE users ADD COLUMN complimentary_granted_at TEXT`);
  }
  if (!userColumns.has("complimentary_granted_by")) {
    db.exec(`ALTER TABLE users ADD COLUMN complimentary_granted_by TEXT`);
  }
  if (!userColumns.has("complimentary_expires_at")) {
    db.exec(`ALTER TABLE users ADD COLUMN complimentary_expires_at TEXT`);
  }
  attributionColumnNames.forEach((columnName) => {
    if (!userColumns.has(columnName)) {
      db.exec(`ALTER TABLE users ADD COLUMN ${columnName} TEXT`);
    }
  });
  db.exec(`CREATE INDEX IF NOT EXISTS idx_users_first_source ON users(first_source)`);

  db.exec(`
    CREATE TABLE IF NOT EXISTS complimentary_access_grants (
      email TEXT PRIMARY KEY,
      plan_key TEXT NOT NULL,
      reason TEXT NOT NULL,
      note TEXT,
      granted_at TEXT NOT NULL,
      granted_by TEXT,
      expires_at TEXT,
      status TEXT NOT NULL DEFAULT 'active'
    );

    CREATE INDEX IF NOT EXISTS idx_complimentary_access_status ON complimentary_access_grants(status, expires_at);
  `);

  db.exec(`
    UPDATE users
    SET plan_key = COALESCE(plan_key, 'free'),
        plan_updated_at = COALESCE(plan_updated_at, updated_at, created_at)
    WHERE plan_key IS NULL
  `);

  const insertUserStmt = db.prepare(`
    INSERT INTO users (
      id, email, password_hash, display_name, status, plan_key, plan_updated_at,
      email_verified_at,
      complimentary_plan_key, complimentary_reason, complimentary_note, complimentary_granted_at,
      complimentary_granted_by, complimentary_expires_at,
      signup_provider,
      first_source, first_medium, first_campaign, first_content, first_term, first_landing_path, first_referrer, first_captured_at,
      last_source, last_medium, last_campaign, last_content, last_term, last_landing_path, last_referrer, last_captured_at,
      created_at, updated_at
    )
    VALUES (
      @id, @email, @passwordHash, @displayName, 'active', @planKey, @planUpdatedAt,
      @emailVerifiedAt,
      @complimentaryPlanKey, @complimentaryReason, @complimentaryNote, @complimentaryGrantedAt,
      @complimentaryGrantedBy, @complimentaryExpiresAt,
      @signupProvider,
      @firstSource, @firstMedium, @firstCampaign, @firstContent, @firstTerm, @firstLandingPath, @firstReferrer, @firstCapturedAt,
      @lastSource, @lastMedium, @lastCampaign, @lastContent, @lastTerm, @lastLandingPath, @lastReferrer, @lastCapturedAt,
      @createdAt, @updatedAt
    )
  `);
  const userByEmailStmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
  const userByIdStmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
  const listUsersStmt = db.prepare(`SELECT * FROM users ORDER BY created_at DESC`);
  const userCountStmt = db.prepare(`SELECT COUNT(*) AS count FROM users`);
  const updateUserPlanStmt = db.prepare(`
    UPDATE users
    SET plan_key = @planKey,
        plan_updated_at = @planUpdatedAt,
        updated_at = @updatedAt
    WHERE id = @id
  `);
  const updateUserBillingStmt = db.prepare(`
    UPDATE users
    SET plan_key = @planKey,
        plan_updated_at = @planUpdatedAt,
        stripe_customer_id = @stripeCustomerId,
        stripe_subscription_id = @stripeSubscriptionId,
        updated_at = @updatedAt
    WHERE id = @id
  `);
  const applyComplimentaryGrantStmt = db.prepare(`
    UPDATE users
    SET complimentary_plan_key = @planKey,
        complimentary_reason = @reason,
        complimentary_note = @note,
        complimentary_granted_at = @grantedAt,
        complimentary_granted_by = @grantedBy,
        complimentary_expires_at = @expiresAt,
        updated_at = @updatedAt
    WHERE email = @email
  `);
  const clearComplimentaryGrantStmt = db.prepare(`
    UPDATE users
    SET complimentary_plan_key = NULL,
        complimentary_reason = NULL,
        complimentary_note = NULL,
        complimentary_granted_at = NULL,
        complimentary_granted_by = NULL,
        complimentary_expires_at = NULL,
        updated_at = @updatedAt
    WHERE email = @email
  `);
  const upsertComplimentaryGrantStmt = db.prepare(`
    INSERT INTO complimentary_access_grants (
      email, plan_key, reason, note, granted_at, granted_by, expires_at, status
    )
    VALUES (
      @email, @planKey, @reason, @note, @grantedAt, @grantedBy, @expiresAt, 'active'
    )
    ON CONFLICT(email) DO UPDATE SET
      plan_key = excluded.plan_key,
      reason = excluded.reason,
      note = excluded.note,
      granted_at = excluded.granted_at,
      granted_by = excluded.granted_by,
      expires_at = excluded.expires_at,
      status = 'active'
  `);
  const revokeComplimentaryGrantStmt = db.prepare(`
    UPDATE complimentary_access_grants
    SET status = 'revoked'
    WHERE email = ?
  `);
  const complimentaryGrantByEmailStmt = db.prepare(`
    SELECT *
    FROM complimentary_access_grants
    WHERE email = ?
      AND status = 'active'
      AND (expires_at IS NULL OR expires_at > ?)
  `);
  const listComplimentaryGrantsStmt = db.prepare(`
    SELECT g.*, u.id AS user_id, u.display_name
    FROM complimentary_access_grants g
    LEFT JOIN users u ON u.email = g.email
    ORDER BY g.granted_at DESC
  `);
  const updateUserPasswordStmt = db.prepare(`
    UPDATE users
    SET password_hash = @passwordHash,
        password_changed_at = @updatedAt,
        updated_at = @updatedAt
    WHERE id = @id
  `);
  const markUserVerifiedStmt = db.prepare(`
    UPDATE users
    SET email_verified_at = @emailVerifiedAt,
        updated_at = @updatedAt
    WHERE id = @id
  `);
  const insertSessionStmt = db.prepare(`
    INSERT INTO auth_sessions (
      id, user_id, access_token_hash, refresh_token_hash,
      access_token_expires_at, refresh_token_expires_at,
      ip, user_agent, created_at, updated_at, last_used_at
    )
    VALUES (
      @id, @userId, @accessTokenHash, @refreshTokenHash,
      @accessTokenExpiresAt, @refreshTokenExpiresAt,
      @ip, @userAgent, @createdAt, @updatedAt, @lastUsedAt
    )
  `);
  const sessionByAccessHashStmt = db.prepare(`
    SELECT s.*, u.email, u.display_name, u.status, u.plan_key, u.plan_updated_at, u.stripe_customer_id, u.stripe_subscription_id, u.complimentary_plan_key, u.complimentary_reason, u.complimentary_note, u.complimentary_granted_at, u.complimentary_granted_by, u.complimentary_expires_at, u.email_verified_at, u.created_at AS user_created_at, u.updated_at AS user_updated_at
    FROM auth_sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.access_token_hash = ?
  `);
  const sessionByRefreshHashStmt = db.prepare(`
    SELECT s.*, u.email, u.display_name, u.status, u.plan_key, u.plan_updated_at, u.stripe_customer_id, u.stripe_subscription_id, u.complimentary_plan_key, u.complimentary_reason, u.complimentary_note, u.complimentary_granted_at, u.complimentary_granted_by, u.complimentary_expires_at, u.email_verified_at, u.created_at AS user_created_at, u.updated_at AS user_updated_at
    FROM auth_sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.refresh_token_hash = ?
  `);
  const updateSessionStmt = db.prepare(`
    UPDATE auth_sessions
    SET access_token_hash = @accessTokenHash,
        refresh_token_hash = @refreshTokenHash,
        access_token_expires_at = @accessTokenExpiresAt,
        refresh_token_expires_at = @refreshTokenExpiresAt,
        ip = @ip,
        user_agent = @userAgent,
        updated_at = @updatedAt,
        last_used_at = @lastUsedAt
    WHERE id = @id
  `);
  const deleteSessionByRefreshHashStmt = db.prepare(`DELETE FROM auth_sessions WHERE refresh_token_hash = ?`);
  const deleteSessionsByUserIdStmt = db.prepare(`DELETE FROM auth_sessions WHERE user_id = ?`);
  const deleteExpiredSessionsStmt = db.prepare(`DELETE FROM auth_sessions WHERE refresh_token_expires_at <= ?`);

  const insertEmailVerificationStmt = db.prepare(`
    INSERT INTO email_verification_tokens (id, user_id, token_hash, expires_at, created_at)
    VALUES (@id, @userId, @tokenHash, @expiresAt, @createdAt)
  `);
  const verificationByTokenHashStmt = db.prepare(`
    SELECT t.*, u.email, u.display_name, u.status, u.plan_key, u.plan_updated_at, u.stripe_customer_id, u.stripe_subscription_id, u.complimentary_plan_key, u.complimentary_reason, u.complimentary_note, u.complimentary_granted_at, u.complimentary_granted_by, u.complimentary_expires_at, u.email_verified_at, u.created_at AS user_created_at, u.updated_at AS user_updated_at
    FROM email_verification_tokens t
    JOIN users u ON u.id = t.user_id
    WHERE t.token_hash = ?
  `);
  const deleteVerificationByTokenHashStmt = db.prepare(`DELETE FROM email_verification_tokens WHERE token_hash = ?`);
  const deleteVerificationByUserIdStmt = db.prepare(`DELETE FROM email_verification_tokens WHERE user_id = ?`);
  const deleteExpiredVerificationStmt = db.prepare(`DELETE FROM email_verification_tokens WHERE expires_at <= ?`);

  const insertPasswordResetStmt = db.prepare(`
    INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at, created_at)
    VALUES (@id, @userId, @tokenHash, @expiresAt, @createdAt)
  `);
  const passwordResetByTokenHashStmt = db.prepare(`
    SELECT t.*, u.email, u.display_name, u.status, u.plan_key, u.plan_updated_at, u.stripe_customer_id, u.stripe_subscription_id, u.complimentary_plan_key, u.complimentary_reason, u.complimentary_note, u.complimentary_granted_at, u.complimentary_granted_by, u.complimentary_expires_at, u.email_verified_at, u.created_at AS user_created_at, u.updated_at AS user_updated_at
    FROM password_reset_tokens t
    JOIN users u ON u.id = t.user_id
    WHERE t.token_hash = ?
  `);
  const deletePasswordResetByTokenHashStmt = db.prepare(`DELETE FROM password_reset_tokens WHERE token_hash = ?`);
  const deletePasswordResetByUserIdStmt = db.prepare(`DELETE FROM password_reset_tokens WHERE user_id = ?`);
  const deleteExpiredPasswordResetStmt = db.prepare(`DELETE FROM password_reset_tokens WHERE expires_at <= ?`);

  return {
    async cleanupExpiredSessions() {
      deleteExpiredSessionsStmt.run(nowIso());
    },
    async cleanupExpiredTokens() {
      const timestamp = nowIso();
      deleteExpiredVerificationStmt.run(timestamp);
      deleteExpiredPasswordResetStmt.run(timestamp);
    },
    async userByEmail(email) {
      return userByEmailStmt.get(email) || null;
    },
    async userById(id) {
      return userByIdStmt.get(id) || null;
    },
    async listUsers() {
      return listUsersStmt.all();
    },
    async userCount() {
      return Number(userCountStmt.get().count || 0);
    },
    async insertUser(row) {
      insertUserStmt.run(row);
      return userByIdStmt.get(row.id);
    },
    async updateUserPlan({ id, planKey, planUpdatedAt, updatedAt }) {
      updateUserPlanStmt.run({ id, planKey, planUpdatedAt, updatedAt });
      return userByIdStmt.get(id) || null;
    },
    async updateUserBilling({ id, planKey, planUpdatedAt, stripeCustomerId, stripeSubscriptionId, updatedAt }) {
      updateUserBillingStmt.run({
        id,
        planKey,
        planUpdatedAt,
        stripeCustomerId,
        stripeSubscriptionId,
        updatedAt
      });
      return userByIdStmt.get(id) || null;
    },
    async grantComplimentaryAccess(row) {
      upsertComplimentaryGrantStmt.run(row);
      applyComplimentaryGrantStmt.run({ ...row, updatedAt: row.grantedAt });
      return {
        grant: complimentaryGrantByEmailStmt.get(row.email, nowIso()) || null,
        user: userByEmailStmt.get(row.email) || null
      };
    },
    async revokeComplimentaryAccess({ email, updatedAt }) {
      revokeComplimentaryGrantStmt.run(email);
      clearComplimentaryGrantStmt.run({ email, updatedAt });
      return userByEmailStmt.get(email) || null;
    },
    async complimentaryGrantByEmail(email) {
      return complimentaryGrantByEmailStmt.get(email, nowIso()) || null;
    },
    async listComplimentaryGrants() {
      return listComplimentaryGrantsStmt.all();
    },
    async updateUserPassword({ id, passwordHash, updatedAt }) {
      updateUserPasswordStmt.run({ id, passwordHash, updatedAt });
      return userByIdStmt.get(id) || null;
    },
    async markUserVerified({ id, emailVerifiedAt, updatedAt }) {
      markUserVerifiedStmt.run({ id, emailVerifiedAt, updatedAt });
      return userByIdStmt.get(id) || null;
    },
    async insertSession(row) {
      insertSessionStmt.run(row);
    },
    async sessionByAccessHash(hash) {
      return sessionByAccessHashStmt.get(hash) || null;
    },
    async sessionByRefreshHash(hash) {
      return sessionByRefreshHashStmt.get(hash) || null;
    },
    async updateSession(row) {
      updateSessionStmt.run(row);
    },
    async deleteSessionByRefreshHash(hash) {
      return deleteSessionByRefreshHashStmt.run(hash).changes > 0;
    },
    async deleteSessionsByUserId(userId) {
      deleteSessionsByUserIdStmt.run(userId);
    },
    async insertVerificationToken(row) {
      insertEmailVerificationStmt.run(row);
    },
    async verificationByTokenHash(hash) {
      return verificationByTokenHashStmt.get(hash) || null;
    },
    async deleteVerificationByTokenHash(hash) {
      return deleteVerificationByTokenHashStmt.run(hash).changes > 0;
    },
    async deleteVerificationByUserId(userId) {
      deleteVerificationByUserIdStmt.run(userId);
    },
    async insertPasswordResetToken(row) {
      insertPasswordResetStmt.run(row);
    },
    async passwordResetByTokenHash(hash) {
      return passwordResetByTokenHashStmt.get(hash) || null;
    },
    async deletePasswordResetByTokenHash(hash) {
      return deletePasswordResetByTokenHashStmt.run(hash).changes > 0;
    },
    async deletePasswordResetByUserId(userId) {
      deletePasswordResetByUserIdStmt.run(userId);
    }
  };
}

function createPostgresAdapter(pool) {
  const ready = (async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        display_name TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified_at TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password_changed_at TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_key TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_updated_at TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS complimentary_plan_key TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS complimentary_reason TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS complimentary_note TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS complimentary_granted_at TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS complimentary_granted_by TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS complimentary_expires_at TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS signup_provider TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS first_source TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS first_medium TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS first_campaign TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS first_content TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS first_term TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS first_landing_path TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS first_referrer TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS first_captured_at TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_source TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_medium TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_campaign TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_content TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_term TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_landing_path TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_referrer TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_captured_at TEXT;

      CREATE TABLE IF NOT EXISTS complimentary_access_grants (
        email TEXT PRIMARY KEY,
        plan_key TEXT NOT NULL,
        reason TEXT NOT NULL,
        note TEXT,
        granted_at TEXT NOT NULL,
        granted_by TEXT,
        expires_at TEXT,
        status TEXT NOT NULL DEFAULT 'active'
      );

      CREATE TABLE IF NOT EXISTS auth_sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        access_token_hash TEXT NOT NULL UNIQUE,
        refresh_token_hash TEXT NOT NULL UNIQUE,
        access_token_expires_at TEXT NOT NULL,
        refresh_token_expires_at TEXT NOT NULL,
        ip TEXT,
        user_agent TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        last_used_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS email_verification_tokens (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL UNIQUE,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL UNIQUE,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_first_source ON users(first_source);
      CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_auth_sessions_refresh_expires ON auth_sessions(refresh_token_expires_at);
      CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);
      CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_expires ON email_verification_tokens(expires_at);
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires ON password_reset_tokens(expires_at);
      CREATE INDEX IF NOT EXISTS idx_complimentary_access_status ON complimentary_access_grants(status, expires_at);

      UPDATE users
      SET plan_key = COALESCE(plan_key, 'free'),
          plan_updated_at = COALESCE(plan_updated_at, updated_at, created_at)
      WHERE plan_key IS NULL;
    `);
  })();

  return {
    async cleanupExpiredSessions() {
      await ready;
      await pool.query(`DELETE FROM auth_sessions WHERE refresh_token_expires_at <= $1`, [nowIso()]);
    },
    async cleanupExpiredTokens() {
      await ready;
      const timestamp = nowIso();
      await pool.query(`DELETE FROM email_verification_tokens WHERE expires_at <= $1`, [timestamp]);
      await pool.query(`DELETE FROM password_reset_tokens WHERE expires_at <= $1`, [timestamp]);
    },
    async userByEmail(email) {
      await ready;
      const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
      return result.rows[0] || null;
    },
    async userById(id) {
      await ready;
      const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
      return result.rows[0] || null;
    },
    async listUsers() {
      await ready;
      const result = await pool.query(`SELECT * FROM users ORDER BY created_at DESC`);
      return result.rows;
    },
    async userCount() {
      await ready;
      const result = await pool.query(`SELECT COUNT(*)::int AS count FROM users`);
      return Number(result.rows[0]?.count || 0);
    },
    async insertUser(row) {
      await ready;
      const result = await pool.query(`
        INSERT INTO users (
          id, email, password_hash, display_name, status, plan_key, plan_updated_at,
          email_verified_at,
          complimentary_plan_key, complimentary_reason, complimentary_note, complimentary_granted_at,
          complimentary_granted_by, complimentary_expires_at,
          signup_provider,
          first_source, first_medium, first_campaign, first_content, first_term, first_landing_path, first_referrer, first_captured_at,
          last_source, last_medium, last_campaign, last_content, last_term, last_landing_path, last_referrer, last_captured_at,
          created_at, updated_at
        )
        VALUES (
          $1, $2, $3, $4, 'active', $5, $6, $7, $8, $9, $10, $11, $12, $13,
          $14, $15, $16, $17, $18, $19, $20, $21, $22,
          $23, $24, $25, $26, $27, $28, $29, $30,
          $31, $32
        )
        RETURNING *
      `, [
        row.id, row.email, row.passwordHash, row.displayName, row.planKey, row.planUpdatedAt,
        row.emailVerifiedAt,
        row.complimentaryPlanKey, row.complimentaryReason, row.complimentaryNote, row.complimentaryGrantedAt,
        row.complimentaryGrantedBy, row.complimentaryExpiresAt,
        row.signupProvider,
        row.firstSource, row.firstMedium, row.firstCampaign, row.firstContent, row.firstTerm, row.firstLandingPath, row.firstReferrer, row.firstCapturedAt,
        row.lastSource, row.lastMedium, row.lastCampaign, row.lastContent, row.lastTerm, row.lastLandingPath, row.lastReferrer, row.lastCapturedAt,
        row.createdAt, row.updatedAt
      ]);
      return result.rows[0] || null;
    },
    async updateUserPlan({ id, planKey, planUpdatedAt, updatedAt }) {
      await ready;
      const result = await pool.query(`
        UPDATE users
        SET plan_key = $1,
            plan_updated_at = $2,
            updated_at = $3
        WHERE id = $4
        RETURNING *
      `, [planKey, planUpdatedAt, updatedAt, id]);
      return result.rows[0] || null;
    },
    async updateUserBilling({ id, planKey, planUpdatedAt, stripeCustomerId, stripeSubscriptionId, updatedAt }) {
      await ready;
      const result = await pool.query(`
        UPDATE users
        SET plan_key = $1,
            plan_updated_at = $2,
            stripe_customer_id = $3,
            stripe_subscription_id = $4,
            updated_at = $5
        WHERE id = $6
        RETURNING *
      `, [planKey, planUpdatedAt, stripeCustomerId, stripeSubscriptionId, updatedAt, id]);
      return result.rows[0] || null;
    },
    async grantComplimentaryAccess(row) {
      await ready;
      await pool.query(`
        INSERT INTO complimentary_access_grants (
          email, plan_key, reason, note, granted_at, granted_by, expires_at, status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
        ON CONFLICT(email) DO UPDATE SET
          plan_key = excluded.plan_key,
          reason = excluded.reason,
          note = excluded.note,
          granted_at = excluded.granted_at,
          granted_by = excluded.granted_by,
          expires_at = excluded.expires_at,
          status = 'active'
      `, [row.email, row.planKey, row.reason, row.note, row.grantedAt, row.grantedBy, row.expiresAt]);
      await pool.query(`
        UPDATE users
        SET complimentary_plan_key = $1,
            complimentary_reason = $2,
            complimentary_note = $3,
            complimentary_granted_at = $4,
            complimentary_granted_by = $5,
            complimentary_expires_at = $6,
            updated_at = $7
        WHERE email = $8
      `, [row.planKey, row.reason, row.note, row.grantedAt, row.grantedBy, row.expiresAt, row.grantedAt, row.email]);
      const grant = await pool.query(`
        SELECT *
        FROM complimentary_access_grants
        WHERE email = $1
          AND status = 'active'
          AND (expires_at IS NULL OR expires_at > $2)
      `, [row.email, nowIso()]);
      const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [row.email]);
      return { grant: grant.rows[0] || null, user: user.rows[0] || null };
    },
    async revokeComplimentaryAccess({ email, updatedAt }) {
      await ready;
      await pool.query(`UPDATE complimentary_access_grants SET status = 'revoked' WHERE email = $1`, [email]);
      const result = await pool.query(`
        UPDATE users
        SET complimentary_plan_key = NULL,
            complimentary_reason = NULL,
            complimentary_note = NULL,
            complimentary_granted_at = NULL,
            complimentary_granted_by = NULL,
            complimentary_expires_at = NULL,
            updated_at = $1
        WHERE email = $2
        RETURNING *
      `, [updatedAt, email]);
      return result.rows[0] || null;
    },
    async complimentaryGrantByEmail(email) {
      await ready;
      const result = await pool.query(`
        SELECT *
        FROM complimentary_access_grants
        WHERE email = $1
          AND status = 'active'
          AND (expires_at IS NULL OR expires_at > $2)
      `, [email, nowIso()]);
      return result.rows[0] || null;
    },
    async listComplimentaryGrants() {
      await ready;
      const result = await pool.query(`
        SELECT g.*, u.id AS user_id, u.display_name
        FROM complimentary_access_grants g
        LEFT JOIN users u ON u.email = g.email
        ORDER BY g.granted_at DESC
      `);
      return result.rows;
    },
    async updateUserPassword({ id, passwordHash, updatedAt }) {
      await ready;
      const result = await pool.query(`
        UPDATE users
        SET password_hash = $1,
            password_changed_at = $2,
            updated_at = $2
        WHERE id = $3
        RETURNING *
      `, [passwordHash, updatedAt, id]);
      return result.rows[0] || null;
    },
    async markUserVerified({ id, emailVerifiedAt, updatedAt }) {
      await ready;
      const result = await pool.query(`
        UPDATE users
        SET email_verified_at = $1,
            updated_at = $2
        WHERE id = $3
        RETURNING *
      `, [emailVerifiedAt, updatedAt, id]);
      return result.rows[0] || null;
    },
    async insertSession(row) {
      await ready;
      await pool.query(`
        INSERT INTO auth_sessions (
          id, user_id, access_token_hash, refresh_token_hash,
          access_token_expires_at, refresh_token_expires_at,
          ip, user_agent, created_at, updated_at, last_used_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      `, [
        row.id, row.userId, row.accessTokenHash, row.refreshTokenHash,
        row.accessTokenExpiresAt, row.refreshTokenExpiresAt,
        row.ip, row.userAgent, row.createdAt, row.updatedAt, row.lastUsedAt
      ]);
    },
    async sessionByAccessHash(hash) {
      await ready;
      const result = await pool.query(`
        SELECT s.*, u.email, u.display_name, u.status, u.plan_key, u.plan_updated_at, u.stripe_customer_id, u.stripe_subscription_id, u.complimentary_plan_key, u.complimentary_reason, u.complimentary_note, u.complimentary_granted_at, u.complimentary_granted_by, u.complimentary_expires_at, u.email_verified_at, u.created_at AS user_created_at, u.updated_at AS user_updated_at
        FROM auth_sessions s
        JOIN users u ON u.id = s.user_id
        WHERE s.access_token_hash = $1
      `, [hash]);
      return result.rows[0] || null;
    },
    async sessionByRefreshHash(hash) {
      await ready;
      const result = await pool.query(`
        SELECT s.*, u.email, u.display_name, u.status, u.plan_key, u.plan_updated_at, u.stripe_customer_id, u.stripe_subscription_id, u.complimentary_plan_key, u.complimentary_reason, u.complimentary_note, u.complimentary_granted_at, u.complimentary_granted_by, u.complimentary_expires_at, u.email_verified_at, u.created_at AS user_created_at, u.updated_at AS user_updated_at
        FROM auth_sessions s
        JOIN users u ON u.id = s.user_id
        WHERE s.refresh_token_hash = $1
      `, [hash]);
      return result.rows[0] || null;
    },
    async updateSession(row) {
      await ready;
      await pool.query(`
        UPDATE auth_sessions
        SET access_token_hash = $1,
            refresh_token_hash = $2,
            access_token_expires_at = $3,
            refresh_token_expires_at = $4,
            ip = $5,
            user_agent = $6,
            updated_at = $7,
            last_used_at = $8
        WHERE id = $9
      `, [
        row.accessTokenHash, row.refreshTokenHash, row.accessTokenExpiresAt,
        row.refreshTokenExpiresAt, row.ip, row.userAgent,
        row.updatedAt, row.lastUsedAt, row.id
      ]);
    },
    async deleteSessionByRefreshHash(hash) {
      await ready;
      const result = await pool.query(`DELETE FROM auth_sessions WHERE refresh_token_hash = $1`, [hash]);
      return result.rowCount > 0;
    },
    async deleteSessionsByUserId(userId) {
      await ready;
      await pool.query(`DELETE FROM auth_sessions WHERE user_id = $1`, [userId]);
    },
    async insertVerificationToken(row) {
      await ready;
      await pool.query(`
        INSERT INTO email_verification_tokens (id, user_id, token_hash, expires_at, created_at)
        VALUES ($1, $2, $3, $4, $5)
      `, [row.id, row.userId, row.tokenHash, row.expiresAt, row.createdAt]);
    },
    async verificationByTokenHash(hash) {
      await ready;
      const result = await pool.query(`
        SELECT t.*, u.email, u.display_name, u.status, u.plan_key, u.plan_updated_at, u.stripe_customer_id, u.stripe_subscription_id, u.complimentary_plan_key, u.complimentary_reason, u.complimentary_note, u.complimentary_granted_at, u.complimentary_granted_by, u.complimentary_expires_at, u.email_verified_at, u.created_at AS user_created_at, u.updated_at AS user_updated_at
        FROM email_verification_tokens t
        JOIN users u ON u.id = t.user_id
        WHERE t.token_hash = $1
      `, [hash]);
      return result.rows[0] || null;
    },
    async deleteVerificationByTokenHash(hash) {
      await ready;
      await pool.query(`DELETE FROM email_verification_tokens WHERE token_hash = $1`, [hash]);
      return true;
    },
    async deleteVerificationByUserId(userId) {
      await ready;
      await pool.query(`DELETE FROM email_verification_tokens WHERE user_id = $1`, [userId]);
    },
    async insertPasswordResetToken(row) {
      await ready;
      await pool.query(`
        INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at, created_at)
        VALUES ($1, $2, $3, $4, $5)
      `, [row.id, row.userId, row.tokenHash, row.expiresAt, row.createdAt]);
    },
    async passwordResetByTokenHash(hash) {
      await ready;
      const result = await pool.query(`
        SELECT t.*, u.email, u.display_name, u.status, u.plan_key, u.plan_updated_at, u.stripe_customer_id, u.stripe_subscription_id, u.complimentary_plan_key, u.complimentary_reason, u.complimentary_note, u.complimentary_granted_at, u.complimentary_granted_by, u.complimentary_expires_at, u.email_verified_at, u.created_at AS user_created_at, u.updated_at AS user_updated_at
        FROM password_reset_tokens t
        JOIN users u ON u.id = t.user_id
        WHERE t.token_hash = $1
      `, [hash]);
      return result.rows[0] || null;
    },
    async deletePasswordResetByTokenHash(hash) {
      await ready;
      await pool.query(`DELETE FROM password_reset_tokens WHERE token_hash = $1`, [hash]);
      return true;
    },
    async deletePasswordResetByUserId(userId) {
      await ready;
      await pool.query(`DELETE FROM password_reset_tokens WHERE user_id = $1`, [userId]);
    }
  };
}

function createAuthService({
  db,
  tokenSecret,
  accessTokenTtlMinutes = 15,
  refreshTokenTtlDays = 30,
  verificationTokenTtlHours = 48,
  passwordResetTokenTtlHours = 2,
  bootstrapOwner,
  provider = "sqlite",
  requireEmailVerification = false
}) {
  if (!db) throw new Error("db is required");
  if (!tokenSecret) throw new Error("tokenSecret is required");

  const adapter = provider === "postgres" ? createPostgresAdapter(db) : createSqliteAdapter(db);

  async function cleanupState() {
    await adapter.cleanupExpiredSessions();
    await adapter.cleanupExpiredTokens();
  }

  async function createUserInternal({ email, password, displayName, emailVerifiedAt = null, planKey = "free", attribution = {} }) {
    const normalizedEmail = normalizeEmail(email);
    const normalizedDisplayName = String(displayName || "").trim();
    const normalizedPassword = String(password || "");
    const normalizedAttribution = normalizeAttribution(attribution);

    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      throw new ApiAuthError("A valid email is required.", 400);
    }
    if (normalizedPassword.length < 8) {
      throw new ApiAuthError("Password must be at least 8 characters.", 400);
    }
    if (!normalizedDisplayName) {
      throw new ApiAuthError("Display name is required.", 400);
    }
    if (await adapter.userByEmail(normalizedEmail)) {
      throw new ApiAuthError("An account with that email already exists.", 409);
    }

    const timestamp = nowIso();
    const grant = await adapter.complimentaryGrantByEmail(normalizedEmail);
    const row = {
      id: nanoid(16),
      email: normalizedEmail,
      passwordHash: hashPassword(normalizedPassword),
      displayName: normalizedDisplayName,
      planKey,
      planUpdatedAt: timestamp,
      emailVerifiedAt,
      complimentaryPlanKey: grant?.plan_key || null,
      complimentaryReason: grant?.reason || "",
      complimentaryNote: grant?.note || "",
      complimentaryGrantedAt: grant?.granted_at || null,
      complimentaryGrantedBy: grant?.granted_by || "",
      complimentaryExpiresAt: grant?.expires_at || null,
      ...normalizedAttribution,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    const inserted = await adapter.insertUser(row);
    return mapUser(inserted);
  }

  async function findOrCreateProviderUser({ email, displayName, emailVerifiedAt = nowIso(), signupProvider = "oauth", attribution = {} }) {
    await bootstrapReady;
    const normalizedEmail = normalizeEmail(email);
    const normalizedDisplayName = String(displayName || "").trim() || normalizedEmail.split("@")[0] || "Split Sheet Studio User";

    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      throw new ApiAuthError("The sign-in provider did not return a valid email address.", 400);
    }

    const existing = await adapter.userByEmail(normalizedEmail);
    if (existing) {
      if (existing.status !== "active") {
        throw new ApiAuthError("Invalid credentials.", 401);
      }
      if (!existing.email_verified_at && emailVerifiedAt) {
        return mapUser(await adapter.markUserVerified({
          id: existing.id,
          emailVerifiedAt,
          updatedAt: nowIso()
        }));
      }
      return mapUser(existing);
    }

    return createUserInternal({
      email: normalizedEmail,
      password: randomToken(32),
      displayName: normalizedDisplayName,
      emailVerifiedAt,
      planKey: "free",
      attribution: {
        ...attribution,
        signupProvider: attribution.signupProvider || signupProvider
      }
    });
  }

  async function issueTokensForUser({ userId, ip, userAgent }) {
    await bootstrapReady;
    await cleanupState();
    const now = Date.now();
    const accessToken = randomToken(24);
    const refreshToken = randomToken(32);
    const timestamp = nowIso();
    const session = {
      id: nanoid(18),
      userId,
      accessTokenHash: hashToken(tokenSecret, accessToken),
      refreshTokenHash: hashToken(tokenSecret, refreshToken),
      accessTokenExpiresAt: new Date(now + (accessTokenTtlMinutes * 60 * 1000)).toISOString(),
      refreshTokenExpiresAt: new Date(now + (refreshTokenTtlDays * 24 * 60 * 60 * 1000)).toISOString(),
      ip: ip || "",
      userAgent: userAgent || "",
      createdAt: timestamp,
      updatedAt: timestamp,
      lastUsedAt: timestamp
    };
    await adapter.insertSession(session);
    return {
      accessToken,
      refreshToken,
      accessTokenExpiresAt: session.accessTokenExpiresAt,
      refreshTokenExpiresAt: session.refreshTokenExpiresAt,
      tokenType: "Bearer"
    };
  }

  async function createVerificationTokenForUser(userId) {
    await bootstrapReady;
    await cleanupState();
    const user = await adapter.userById(userId);
    if (!user || user.status !== "active") {
      return { created: false, user: null, token: null, expiresAt: null };
    }
    if (user.email_verified_at) {
      return { created: false, user: mapUser(user), token: null, expiresAt: null };
    }

    await adapter.deleteVerificationByUserId(userId);
    const token = randomToken(24);
    const createdAt = nowIso();
    const expiresAt = new Date(Date.now() + (verificationTokenTtlHours * 60 * 60 * 1000)).toISOString();

    await adapter.insertVerificationToken({
      id: nanoid(18),
      userId,
      tokenHash: hashToken(`${tokenSecret}:verify`, token),
      expiresAt,
      createdAt
    });

    return {
      created: true,
      user: mapUser(user),
      token,
      expiresAt
    };
  }

  const bootstrapReady = (async () => {
    const email = normalizeEmail(bootstrapOwner?.email);
    const password = String(bootstrapOwner?.password || "");
    const displayName = String(bootstrapOwner?.displayName || "").trim() || "Owner";
    const planKey = String(bootstrapOwner?.planKey || "studio_pro").trim() || "studio_pro";

    if (!email || !password) return;
    if ((await adapter.userCount()) > 0) return;
    await createUserInternal({ email, password, displayName, emailVerifiedAt: nowIso(), planKey });
  })();

  async function registerUser({ email, password, displayName, ip, userAgent, attribution = {} }) {
    await bootstrapReady;
    const user = await createUserInternal({
      email,
      password,
      displayName,
      emailVerifiedAt: null,
      attribution: {
        ...attribution,
        signupProvider: attribution.signupProvider || "email"
      }
    });
    const verification = await createVerificationTokenForUser(user.id);
    return {
      user,
      verificationRequired: true,
      verificationExpiresAt: verification.expiresAt,
      verificationToken: verification.token,
      ...(!requireEmailVerification ? await issueTokensForUser({ userId: user.id, ip, userAgent }) : {})
    };
  }

  async function authenticateUser({ email, password }) {
    await bootstrapReady;
    await cleanupState();
    const normalizedEmail = normalizeEmail(email);
    const normalizedPassword = String(password || "");

    if (!normalizedEmail || !normalizedPassword) {
      throw new ApiAuthError("Email and password are required.", 400);
    }

    const row = await adapter.userByEmail(normalizedEmail);
    if (!row || row.status !== "active" || !verifyPassword(normalizedPassword, row.password_hash)) {
      throw new ApiAuthError("Invalid credentials.", 401);
    }
    if (requireEmailVerification && !row.email_verified_at) {
      throw new ApiAuthError("Please verify your email before signing in.", 403);
    }

    return mapUser(row);
  }

  return {
    ApiAuthError,
    async userCount() {
      await bootstrapReady;
      return adapter.userCount();
    },
    async getUserById(userId) {
      await bootstrapReady;
      return mapUser(await adapter.userById(userId));
    },
    async getUserByEmail(email) {
      await bootstrapReady;
      return mapUser(await adapter.userByEmail(normalizeEmail(email)));
    },
    async findOrCreateProviderUser({ email, displayName, emailVerifiedAt, signupProvider, attribution }) {
      return findOrCreateProviderUser({ email, displayName, emailVerifiedAt, signupProvider, attribution });
    },
    async listUsers() {
      await bootstrapReady;
      const rows = await adapter.listUsers();
      return rows.map(mapUser);
    },
    async updateUserPlan({ userId, planKey }) {
      await bootstrapReady;
      const timestamp = nowIso();
      return mapUser(await adapter.updateUserPlan({
        id: userId,
        planKey,
        planUpdatedAt: timestamp,
        updatedAt: timestamp
      }));
    },
    async updateUserBilling({ userId, planKey, stripeCustomerId = null, stripeSubscriptionId = null }) {
      await bootstrapReady;
      const timestamp = nowIso();
      return mapUser(await adapter.updateUserBilling({
        id: userId,
        planKey,
        planUpdatedAt: timestamp,
        stripeCustomerId,
        stripeSubscriptionId,
        updatedAt: timestamp
      }));
    },
    async grantComplimentaryAccess({ email, planKey, reason = "sponsor", note = "", grantedBy = "admin", expiresAt = null }) {
      await bootstrapReady;
      const normalizedEmail = normalizeEmail(email);
      if (!normalizedEmail || !normalizedEmail.includes("@")) {
        throw new ApiAuthError("A valid email is required.", 400);
      }
      const timestamp = nowIso();
      const result = await adapter.grantComplimentaryAccess({
        email: normalizedEmail,
        planKey,
        reason: String(reason || "sponsor").trim() || "sponsor",
        note: String(note || "").trim(),
        grantedAt: timestamp,
        grantedBy: String(grantedBy || "admin").trim() || "admin",
        expiresAt: expiresAt || null
      });
      return {
        grant: result.grant,
        user: mapUser(result.user)
      };
    },
    async revokeComplimentaryAccess({ email }) {
      await bootstrapReady;
      const normalizedEmail = normalizeEmail(email);
      if (!normalizedEmail || !normalizedEmail.includes("@")) {
        throw new ApiAuthError("A valid email is required.", 400);
      }
      return mapUser(await adapter.revokeComplimentaryAccess({
        email: normalizedEmail,
        updatedAt: nowIso()
      }));
    },
    async listComplimentaryGrants() {
      await bootstrapReady;
      return adapter.listComplimentaryGrants();
    },
    registerUser,
    async createSession({ email, password, ip, userAgent }) {
      const user = await authenticateUser({ email, password });
      return {
        user,
        ...(await issueTokensForUser({ userId: user.id, ip, userAgent }))
      };
    },
    async createVerificationRequest({ email, userId }) {
      await bootstrapReady;
      if (userId) {
        return createVerificationTokenForUser(userId);
      }
      const user = await adapter.userByEmail(normalizeEmail(email));
      if (!user || user.status !== "active") {
        return { created: false, user: null, token: null, expiresAt: null };
      }
      return createVerificationTokenForUser(user.id);
    },
    async verifyEmailToken(token) {
      await bootstrapReady;
      await cleanupState();
      const normalizedToken = String(token || "").trim();
      if (!normalizedToken) {
        throw new ApiAuthError("Verification token is required.", 400);
      }
      const tokenHash = hashToken(`${tokenSecret}:verify`, normalizedToken);
      const row = await adapter.verificationByTokenHash(tokenHash);
      if (!row) {
        throw new ApiAuthError("Verification link is invalid or expired.", 400);
      }
      if (Date.parse(row.expires_at || "") <= Date.now()) {
        await adapter.deleteVerificationByTokenHash(tokenHash);
        throw new ApiAuthError("Verification link is invalid or expired.", 400);
      }

      const updatedAt = nowIso();
      const verifiedUser = await adapter.markUserVerified({
        id: row.user_id,
        emailVerifiedAt: updatedAt,
        updatedAt
      });
      await adapter.deleteVerificationByUserId(row.user_id);
      return {
        user: mapUser(verifiedUser)
      };
    },
    async createPasswordResetRequest({ email }) {
      await bootstrapReady;
      await cleanupState();
      const user = await adapter.userByEmail(normalizeEmail(email));
      if (!user || user.status !== "active") {
        return { created: false, user: null, token: null, expiresAt: null };
      }

      await adapter.deletePasswordResetByUserId(user.id);
      const token = randomToken(24);
      const createdAt = nowIso();
      const expiresAt = new Date(Date.now() + (passwordResetTokenTtlHours * 60 * 60 * 1000)).toISOString();

      await adapter.insertPasswordResetToken({
        id: nanoid(18),
        userId: user.id,
        tokenHash: hashToken(`${tokenSecret}:reset`, token),
        expiresAt,
        createdAt
      });

      return {
        created: true,
        user: mapUser(user),
        token,
        expiresAt
      };
    },
    async resetPasswordWithToken({ token, password }) {
      await bootstrapReady;
      await cleanupState();
      const normalizedToken = String(token || "").trim();
      const normalizedPassword = String(password || "");
      if (!normalizedToken) {
        throw new ApiAuthError("Reset token is required.", 400);
      }
      if (normalizedPassword.length < 8) {
        throw new ApiAuthError("Password must be at least 8 characters.", 400);
      }

      const tokenHash = hashToken(`${tokenSecret}:reset`, normalizedToken);
      const row = await adapter.passwordResetByTokenHash(tokenHash);
      if (!row) {
        throw new ApiAuthError("Reset link is invalid or expired.", 400);
      }
      if (Date.parse(row.expires_at || "") <= Date.now()) {
        await adapter.deletePasswordResetByTokenHash(tokenHash);
        throw new ApiAuthError("Reset link is invalid or expired.", 400);
      }

      const updatedAt = nowIso();
      const updatedUser = await adapter.updateUserPassword({
        id: row.user_id,
        passwordHash: hashPassword(normalizedPassword),
        updatedAt
      });
      await adapter.deletePasswordResetByUserId(row.user_id);
      await adapter.deleteSessionsByUserId(row.user_id);

      return {
        user: mapUser(updatedUser)
      };
    },
    async getSessionByAccessToken(accessToken) {
      await bootstrapReady;
      await cleanupState();
      const token = String(accessToken || "").trim();
      if (!token) throw new ApiAuthError("Authentication required.", 401);

      const row = await adapter.sessionByAccessHash(hashToken(tokenSecret, token));
      if (!row) throw new ApiAuthError("Invalid or expired access token.", 401);
      if (row.status !== "active") throw new ApiAuthError("Invalid or expired access token.", 401);
      if (requireEmailVerification && !row.email_verified_at) {
        throw new ApiAuthError("Please verify your email before signing in.", 403);
      }

      const accessExpiresAt = Date.parse(row.access_token_expires_at || "");
      if (!Number.isFinite(accessExpiresAt) || accessExpiresAt <= Date.now()) {
        throw new ApiAuthError("Invalid or expired access token.", 401);
      }

      return {
        id: row.id,
        userId: row.user_id,
        user: sessionUserFromRow(row)
      };
    },
    async refreshSession({ refreshToken, ip, userAgent }) {
      await bootstrapReady;
      await cleanupState();
      const token = String(refreshToken || "").trim();
      if (!token) throw new ApiAuthError("Refresh token is required.", 400);

      const tokenHash = hashToken(tokenSecret, token);
      const row = await adapter.sessionByRefreshHash(tokenHash);
      if (!row) throw new ApiAuthError("Invalid or expired refresh token.", 401);
      if (row.status !== "active") throw new ApiAuthError("Invalid or expired refresh token.", 401);
      if (requireEmailVerification && !row.email_verified_at) {
        throw new ApiAuthError("Please verify your email before signing in.", 403);
      }

      const refreshExpiresAt = Date.parse(row.refresh_token_expires_at || "");
      if (!Number.isFinite(refreshExpiresAt) || refreshExpiresAt <= Date.now()) {
        await adapter.deleteSessionByRefreshHash(tokenHash);
        throw new ApiAuthError("Invalid or expired refresh token.", 401);
      }

      const nextAccessToken = randomToken(24);
      const nextRefreshToken = randomToken(32);
      const updatedAt = nowIso();
      const accessTokenExpiresAt = new Date(Date.now() + (accessTokenTtlMinutes * 60 * 1000)).toISOString();
      const refreshTokenExpiresAt = new Date(Date.now() + (refreshTokenTtlDays * 24 * 60 * 60 * 1000)).toISOString();

      await adapter.updateSession({
        id: row.id,
        accessTokenHash: hashToken(tokenSecret, nextAccessToken),
        refreshTokenHash: hashToken(tokenSecret, nextRefreshToken),
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
        ip: ip || row.ip || "",
        userAgent: userAgent || row.user_agent || "",
        updatedAt,
        lastUsedAt: updatedAt
      });

      return {
        user: sessionUserFromRow(row),
        tokenType: "Bearer",
        accessToken: nextAccessToken,
        refreshToken: nextRefreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt
      };
    },
    async revokeSessionByRefreshToken(refreshToken) {
      await bootstrapReady;
      await cleanupState();
      const token = String(refreshToken || "").trim();
      if (!token) return false;
      return adapter.deleteSessionByRefreshHash(hashToken(tokenSecret, token));
    }
  };
}

module.exports = {
  ApiAuthError,
  createAuthService
};
