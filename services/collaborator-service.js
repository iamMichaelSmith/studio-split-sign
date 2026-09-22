const { nanoid } = require("nanoid");

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeProfile(input = {}) {
  return {
    legalName: String(input.legalName || "").trim(),
    role: String(input.role || "").trim(),
    address: String(input.address || "").trim(),
    phone: String(input.phone || "").trim(),
    email: String(input.email || "").trim(),
    pro: String(input.pro || "").trim(),
    ipi: String(input.ipi || "").trim(),
    publisherName: String(input.publisherName || "").trim(),
    publisherIpi: String(input.publisherIpi || "").trim()
  };
}

function rowToProfile(row) {
  if (!row) return null;
  return {
    id: row.id,
    ownerUserId: row.owner_user_id,
    sourceSubmissionId: row.source_submission_id || null,
    legalName: row.legal_name || "",
    role: row.role || "",
    address: row.address || "",
    phone: row.phone || "",
    email: row.email || "",
    pro: row.pro || "",
    ipi: row.ipi || "",
    publisherName: row.publisher_name || "",
    publisherIpi: row.publisher_ipi || "",
    approvedAt: row.approved_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function profileParams({ id = nanoid(10), ownerUserId, sourceSubmissionId = null, contributor, approvedAt = nowIso() }) {
  const profile = normalizeProfile(contributor);
  const timestamp = nowIso();
  return {
    id,
    ownerUserId,
    normalizedEmail: normalizeEmail(profile.email),
    sourceSubmissionId,
    legalName: profile.legalName,
    role: profile.role,
    address: profile.address,
    phone: profile.phone,
    email: profile.email,
    pro: profile.pro,
    ipi: profile.ipi,
    publisherName: profile.publisherName,
    publisherIpi: profile.publisherIpi,
    approvedAt,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

function createSqliteAdapter(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS collaborator_profiles (
      id TEXT PRIMARY KEY,
      owner_user_id TEXT NOT NULL,
      normalized_email TEXT NOT NULL,
      source_submission_id TEXT,
      legal_name TEXT,
      role TEXT,
      address TEXT,
      phone TEXT,
      email TEXT,
      pro TEXT,
      ipi TEXT,
      publisher_name TEXT,
      publisher_ipi TEXT,
      approved_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(owner_user_id, normalized_email)
    );

    CREATE INDEX IF NOT EXISTS idx_collaborator_profiles_owner ON collaborator_profiles(owner_user_id);
    CREATE INDEX IF NOT EXISTS idx_collaborator_profiles_email ON collaborator_profiles(normalized_email);
  `);

  const listStmt = db.prepare(`
    SELECT * FROM collaborator_profiles
    WHERE owner_user_id = ?
    ORDER BY legal_name COLLATE NOCASE, email COLLATE NOCASE
  `);
  const getStmt = db.prepare(`SELECT * FROM collaborator_profiles WHERE id = ? AND owner_user_id = ?`);
  const deleteStmt = db.prepare(`DELETE FROM collaborator_profiles WHERE id = ? AND owner_user_id = ?`);
  const deleteExceptStmt = db.prepare(`DELETE FROM collaborator_profiles WHERE owner_user_id = ? AND id <> ?`);
  const upsertStmt = db.prepare(`
    INSERT INTO collaborator_profiles (
      id, owner_user_id, normalized_email, source_submission_id,
      legal_name, role, address, phone, email, pro, ipi, publisher_name, publisher_ipi,
      approved_at, created_at, updated_at
    )
    VALUES (
      @id, @ownerUserId, @normalizedEmail, @sourceSubmissionId,
      @legalName, @role, @address, @phone, @email, @pro, @ipi, @publisherName, @publisherIpi,
      @approvedAt, @createdAt, @updatedAt
    )
    ON CONFLICT(owner_user_id, normalized_email) DO UPDATE SET
      source_submission_id = excluded.source_submission_id,
      legal_name = excluded.legal_name,
      role = excluded.role,
      address = excluded.address,
      phone = excluded.phone,
      email = excluded.email,
      pro = excluded.pro,
      ipi = excluded.ipi,
      publisher_name = excluded.publisher_name,
      publisher_ipi = excluded.publisher_ipi,
      approved_at = excluded.approved_at,
      updated_at = excluded.updated_at
  `);

  return {
    async listProfiles(ownerUserId) {
      return listStmt.all(ownerUserId).map(rowToProfile);
    },
    async getProfile(ownerUserId, id) {
      return rowToProfile(getStmt.get(id, ownerUserId));
    },
    async upsertProfile(input) {
      const params = profileParams(input);
      if (!params.ownerUserId || !params.normalizedEmail) return null;
      upsertStmt.run(params);
      return rowToProfile(db.prepare(`
        SELECT * FROM collaborator_profiles
        WHERE owner_user_id = ? AND normalized_email = ?
      `).get(params.ownerUserId, params.normalizedEmail));
    },
    async deleteProfile(ownerUserId, id) {
      return deleteStmt.run(id, ownerUserId).changes > 0;
    },
    async deleteAllExcept(ownerUserId, id) {
      return deleteExceptStmt.run(ownerUserId, id).changes;
    }
  };
}

function createPostgresAdapter(pool) {
  const ready = (async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS collaborator_profiles (
        id TEXT PRIMARY KEY,
        owner_user_id TEXT NOT NULL,
        normalized_email TEXT NOT NULL,
        source_submission_id TEXT,
        legal_name TEXT,
        role TEXT,
        address TEXT,
        phone TEXT,
        email TEXT,
        pro TEXT,
        ipi TEXT,
        publisher_name TEXT,
        publisher_ipi TEXT,
        approved_at TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        UNIQUE(owner_user_id, normalized_email)
      );

      CREATE INDEX IF NOT EXISTS idx_collaborator_profiles_owner ON collaborator_profiles(owner_user_id);
      CREATE INDEX IF NOT EXISTS idx_collaborator_profiles_email ON collaborator_profiles(normalized_email);
    `);
  })();

  return {
    async listProfiles(ownerUserId) {
      await ready;
      const result = await pool.query(`
        SELECT * FROM collaborator_profiles
        WHERE owner_user_id = $1
        ORDER BY lower(legal_name), lower(email)
      `, [ownerUserId]);
      return result.rows.map(rowToProfile);
    },
    async getProfile(ownerUserId, id) {
      await ready;
      const result = await pool.query(`SELECT * FROM collaborator_profiles WHERE id = $1 AND owner_user_id = $2`, [id, ownerUserId]);
      return rowToProfile(result.rows[0]);
    },
    async upsertProfile(input) {
      await ready;
      const params = profileParams(input);
      if (!params.ownerUserId || !params.normalizedEmail) return null;
      const result = await pool.query(`
        INSERT INTO collaborator_profiles (
          id, owner_user_id, normalized_email, source_submission_id,
          legal_name, role, address, phone, email, pro, ipi, publisher_name, publisher_ipi,
          approved_at, created_at, updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
        ON CONFLICT(owner_user_id, normalized_email) DO UPDATE SET
          source_submission_id = excluded.source_submission_id,
          legal_name = excluded.legal_name,
          role = excluded.role,
          address = excluded.address,
          phone = excluded.phone,
          email = excluded.email,
          pro = excluded.pro,
          ipi = excluded.ipi,
          publisher_name = excluded.publisher_name,
          publisher_ipi = excluded.publisher_ipi,
          approved_at = excluded.approved_at,
          updated_at = excluded.updated_at
        RETURNING *
      `, [
        params.id, params.ownerUserId, params.normalizedEmail, params.sourceSubmissionId,
        params.legalName, params.role, params.address, params.phone, params.email,
        params.pro, params.ipi, params.publisherName, params.publisherIpi,
        params.approvedAt, params.createdAt, params.updatedAt
      ]);
      return rowToProfile(result.rows[0]);
    },
    async deleteProfile(ownerUserId, id) {
      await ready;
      const result = await pool.query(`DELETE FROM collaborator_profiles WHERE id = $1 AND owner_user_id = $2`, [id, ownerUserId]);
      return result.rowCount > 0;
    },
    async deleteAllExcept(ownerUserId, id) {
      await ready;
      const result = await pool.query(`DELETE FROM collaborator_profiles WHERE owner_user_id = $1 AND id <> $2`, [ownerUserId, id]);
      return result.rowCount;
    }
  };
}

function createCollaboratorService({ db, provider = "sqlite" }) {
  if (!db) throw new Error("db is required");
  const adapter = provider === "postgres" ? createPostgresAdapter(db) : createSqliteAdapter(db);

  return {
    listProfiles(ownerUserId) {
      if (!ownerUserId) return [];
      return adapter.listProfiles(ownerUserId);
    },
    getProfile(ownerUserId, id) {
      if (!ownerUserId || !id) return null;
      return adapter.getProfile(ownerUserId, id);
    },
    upsertApprovedProfile(input) {
      return adapter.upsertProfile(input);
    },
    deleteProfile(ownerUserId, id) {
      if (!ownerUserId || !id) return false;
      return adapter.deleteProfile(ownerUserId, id);
    },
    deleteAllExcept(ownerUserId, id) {
      if (!ownerUserId || !id) return 0;
      return adapter.deleteAllExcept(ownerUserId, id);
    }
  };
}

module.exports = {
  createCollaboratorService
};
