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

function mapUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
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

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_auth_sessions_refresh_expires ON auth_sessions(refresh_token_expires_at);
  `);

  const insertUserStmt = db.prepare(`
    INSERT INTO users (id, email, password_hash, display_name, status, created_at, updated_at)
    VALUES (@id, @email, @passwordHash, @displayName, 'active', @createdAt, @updatedAt)
  `);
  const userByEmailStmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
  const userByIdStmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
  const userCountStmt = db.prepare(`SELECT COUNT(*) AS count FROM users`);
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
    SELECT s.*, u.email, u.display_name, u.status, u.created_at AS user_created_at, u.updated_at AS user_updated_at
    FROM auth_sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.access_token_hash = ?
  `);
  const sessionByRefreshHashStmt = db.prepare(`
    SELECT s.*, u.email, u.display_name, u.status, u.created_at AS user_created_at, u.updated_at AS user_updated_at
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
  const deleteExpiredSessionsStmt = db.prepare(`DELETE FROM auth_sessions WHERE refresh_token_expires_at <= ?`);

  return {
    async cleanupExpiredSessions() {
      deleteExpiredSessionsStmt.run(nowIso());
    },
    async userByEmail(email) {
      return userByEmailStmt.get(email) || null;
    },
    async userById(id) {
      return userByIdStmt.get(id) || null;
    },
    async userCount() {
      return Number(userCountStmt.get().count || 0);
    },
    async insertUser(row) {
      insertUserStmt.run(row);
      return userByIdStmt.get(row.id);
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

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_auth_sessions_refresh_expires ON auth_sessions(refresh_token_expires_at);
    `);
  })();

  return {
    async cleanupExpiredSessions() {
      await ready;
      await pool.query(`DELETE FROM auth_sessions WHERE refresh_token_expires_at <= $1`, [nowIso()]);
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
    async userCount() {
      await ready;
      const result = await pool.query(`SELECT COUNT(*)::int AS count FROM users`);
      return Number(result.rows[0]?.count || 0);
    },
    async insertUser(row) {
      await ready;
      const result = await pool.query(`
        INSERT INTO users (id, email, password_hash, display_name, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, 'active', $5, $6)
        RETURNING *
      `, [row.id, row.email, row.passwordHash, row.displayName, row.createdAt, row.updatedAt]);
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
        SELECT s.*, u.email, u.display_name, u.status, u.created_at AS user_created_at, u.updated_at AS user_updated_at
        FROM auth_sessions s
        JOIN users u ON u.id = s.user_id
        WHERE s.access_token_hash = $1
      `, [hash]);
      return result.rows[0] || null;
    },
    async sessionByRefreshHash(hash) {
      await ready;
      const result = await pool.query(`
        SELECT s.*, u.email, u.display_name, u.status, u.created_at AS user_created_at, u.updated_at AS user_updated_at
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
    }
  };
}

function createAuthService({
  db,
  tokenSecret,
  accessTokenTtlMinutes = 15,
  refreshTokenTtlDays = 30,
  bootstrapOwner,
  provider = "sqlite"
}) {
  if (!db) throw new Error("db is required");
  if (!tokenSecret) throw new Error("tokenSecret is required");

  const adapter = provider === "postgres" ? createPostgresAdapter(db) : createSqliteAdapter(db);

  async function createUserInternal({ email, password, displayName }) {
    const normalizedEmail = normalizeEmail(email);
    const normalizedDisplayName = String(displayName || "").trim();
    const normalizedPassword = String(password || "");

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
    const row = {
      id: nanoid(16),
      email: normalizedEmail,
      passwordHash: hashPassword(normalizedPassword),
      displayName: normalizedDisplayName,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    const inserted = await adapter.insertUser(row);
    return mapUser(inserted);
  }

  const bootstrapReady = (async () => {
    const email = normalizeEmail(bootstrapOwner?.email);
    const password = String(bootstrapOwner?.password || "");
    const displayName = String(bootstrapOwner?.displayName || "").trim() || "Owner";

    if (!email || !password) return;
    if ((await adapter.userCount()) > 0) return;
    await createUserInternal({ email, password, displayName });
  })();

  async function issueTokensForUser({ userId, ip, userAgent }) {
    await bootstrapReady;
    await adapter.cleanupExpiredSessions();
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

  async function registerUser({ email, password, displayName, ip, userAgent }) {
    await bootstrapReady;
    const user = await createUserInternal({ email, password, displayName });
    return {
      user,
      ...(await issueTokensForUser({ userId: user.id, ip, userAgent }))
    };
  }

  async function authenticateUser({ email, password }) {
    await bootstrapReady;
    const normalizedEmail = normalizeEmail(email);
    const normalizedPassword = String(password || "");

    if (!normalizedEmail || !normalizedPassword) {
      throw new ApiAuthError("Email and password are required.", 400);
    }

    const row = await adapter.userByEmail(normalizedEmail);
    if (!row || row.status !== "active" || !verifyPassword(normalizedPassword, row.password_hash)) {
      throw new ApiAuthError("Invalid credentials.", 401);
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
    registerUser,
    async createSession({ email, password, ip, userAgent }) {
      const user = await authenticateUser({ email, password });
      return {
        user,
        ...(await issueTokensForUser({ userId: user.id, ip, userAgent }))
      };
    },
    async getSessionByAccessToken(accessToken) {
      await bootstrapReady;
      await adapter.cleanupExpiredSessions();
      const token = String(accessToken || "").trim();
      if (!token) throw new ApiAuthError("Authentication required.", 401);

      const row = await adapter.sessionByAccessHash(hashToken(tokenSecret, token));
      if (!row) throw new ApiAuthError("Invalid or expired access token.", 401);

      const accessExpiresAt = Date.parse(row.access_token_expires_at || "");
      if (!Number.isFinite(accessExpiresAt) || accessExpiresAt <= Date.now()) {
        throw new ApiAuthError("Invalid or expired access token.", 401);
      }

      return {
        id: row.id,
        userId: row.user_id,
        user: {
          id: row.user_id,
          email: row.email,
          displayName: row.display_name,
          status: row.status,
          createdAt: row.user_created_at,
          updatedAt: row.user_updated_at
        }
      };
    },
    async refreshSession({ refreshToken, ip, userAgent }) {
      await bootstrapReady;
      await adapter.cleanupExpiredSessions();
      const token = String(refreshToken || "").trim();
      if (!token) throw new ApiAuthError("Refresh token is required.", 400);

      const tokenHash = hashToken(tokenSecret, token);
      const row = await adapter.sessionByRefreshHash(tokenHash);
      if (!row) throw new ApiAuthError("Invalid or expired refresh token.", 401);

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
        user: {
          id: row.user_id,
          email: row.email,
          displayName: row.display_name,
          status: row.status,
          createdAt: row.user_created_at,
          updatedAt: row.user_updated_at
        },
        tokenType: "Bearer",
        accessToken: nextAccessToken,
        refreshToken: nextRefreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt
      };
    },
    async revokeSessionByRefreshToken(refreshToken) {
      await bootstrapReady;
      await adapter.cleanupExpiredSessions();
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
