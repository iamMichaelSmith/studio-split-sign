const fs = require("fs");
const path = require("path");
const { nanoid } = require("nanoid");

function parseJson(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function rowToSubmission(row) {
  if (!row) return null;
  return {
    id: row.id,
    type: row.type,
    status: row.status,
    ownerUserId: row.owner_user_id || null,
    ownerEmail: row.owner_email || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ip: row.ip || "",
    userAgent: row.user_agent || "",
    lastReminderRun: parseJson(row.last_reminder_run_json, null),
    payload: parseJson(row.payload_json, {})
  };
}

function submissionToRow(submission) {
  return {
    id: submission.id,
    type: submission.type,
    status: submission.status,
    ownerUserId: submission.ownerUserId || null,
    ownerEmail: submission.ownerEmail || null,
    createdAt: submission.createdAt,
    updatedAt: submission.updatedAt,
    ip: submission.ip || "",
    userAgent: submission.userAgent || "",
    lastReminderRunJson: submission.lastReminderRun ? JSON.stringify(submission.lastReminderRun) : null,
    payloadJson: JSON.stringify(submission.payload || {})
  };
}

function createSqliteAdapter(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      owner_user_id TEXT,
      owner_email TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      ip TEXT,
      user_agent TEXT,
      last_reminder_run_json TEXT,
      payload_json TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_submissions_type ON submissions(type);
    CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
    CREATE INDEX IF NOT EXISTS idx_submissions_owner_user_id ON submissions(owner_user_id);
    CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);
    CREATE INDEX IF NOT EXISTS idx_submissions_updated_at ON submissions(updated_at);
  `);

  const getByIdStmt = db.prepare(`SELECT * FROM submissions WHERE id = ?`);
  const deleteByIdStmt = db.prepare(`DELETE FROM submissions WHERE id = ?`);
  const upsertStmt = db.prepare(`
    INSERT INTO submissions (
      id, type, status, owner_user_id, owner_email,
      created_at, updated_at, ip, user_agent, last_reminder_run_json, payload_json
    )
    VALUES (
      @id, @type, @status, @ownerUserId, @ownerEmail,
      @createdAt, @updatedAt, @ip, @userAgent, @lastReminderRunJson, @payloadJson
    )
    ON CONFLICT(id) DO UPDATE SET
      type = excluded.type,
      status = excluded.status,
      owner_user_id = excluded.owner_user_id,
      owner_email = excluded.owner_email,
      created_at = excluded.created_at,
      updated_at = excluded.updated_at,
      ip = excluded.ip,
      user_agent = excluded.user_agent,
      last_reminder_run_json = excluded.last_reminder_run_json,
      payload_json = excluded.payload_json
  `);
  const importStmt = db.prepare(`
    INSERT OR IGNORE INTO submissions (
      id, type, status, owner_user_id, owner_email,
      created_at, updated_at, ip, user_agent, last_reminder_run_json, payload_json
    )
    VALUES (
      @id, @type, @status, @ownerUserId, @ownerEmail,
      @createdAt, @updatedAt, @ip, @userAgent, @lastReminderRunJson, @payloadJson
    )
  `);
  const listAllStmt = db.prepare(`SELECT * FROM submissions ORDER BY created_at DESC`);
  const listByOwnerStmt = db.prepare(`
    SELECT * FROM submissions
    WHERE owner_user_id = @ownerUserId
      OR (owner_user_id IS NULL AND lower(owner_email) = lower(@ownerEmail))
    ORDER BY updated_at DESC, created_at DESC
  `);
  const listAllByTypeStmt = db.prepare(`
    SELECT * FROM submissions
    WHERE type = ?
    ORDER BY updated_at DESC, created_at DESC
  `);

  return {
    async importSubmission(submission) {
      importStmt.run(submissionToRow(submission));
    },
    async createSubmission(submission) {
      upsertStmt.run(submissionToRow(submission));
      return rowToSubmission(getByIdStmt.get(submission.id));
    },
    async saveSubmission(submission) {
      upsertStmt.run(submissionToRow(submission));
      return rowToSubmission(getByIdStmt.get(submission.id));
    },
    async getSubmission(id) {
      return rowToSubmission(getByIdStmt.get(id));
    },
    async deleteSubmission(id) {
      return deleteByIdStmt.run(id).changes > 0;
    },
    async listSubmissions({ ownerUserId = null, ownerEmail = null, type = null } = {}) {
      const rows = ownerUserId || ownerEmail
        ? listByOwnerStmt.all({ ownerUserId: ownerUserId || "", ownerEmail: ownerEmail || "" })
        : (type ? listAllByTypeStmt.all(type) : listAllStmt.all());
      const submissions = rows.map(rowToSubmission);
      if (!type) return submissions;
      return submissions.filter((submission) => submission.type === type);
    }
  };
}

function createPostgresAdapter(pool) {
  const ready = (async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        owner_user_id TEXT,
        owner_email TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        ip TEXT,
        user_agent TEXT,
        last_reminder_run_json TEXT,
        payload_json TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_submissions_type ON submissions(type);
      CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
      CREATE INDEX IF NOT EXISTS idx_submissions_owner_user_id ON submissions(owner_user_id);
      CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);
      CREATE INDEX IF NOT EXISTS idx_submissions_updated_at ON submissions(updated_at);
    `);
  })();

  return {
    async importSubmission(submission) {
      await ready;
      const row = submissionToRow(submission);
      await pool.query(`
        INSERT INTO submissions (
          id, type, status, owner_user_id, owner_email,
          created_at, updated_at, ip, user_agent, last_reminder_run_json, payload_json
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        ON CONFLICT(id) DO NOTHING
      `, [
        row.id, row.type, row.status, row.ownerUserId, row.ownerEmail,
        row.createdAt, row.updatedAt, row.ip, row.userAgent,
        row.lastReminderRunJson, row.payloadJson
      ]);
    },
    async createSubmission(submission) {
      await ready;
      const row = submissionToRow(submission);
      const result = await pool.query(`
        INSERT INTO submissions (
          id, type, status, owner_user_id, owner_email,
          created_at, updated_at, ip, user_agent, last_reminder_run_json, payload_json
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        ON CONFLICT(id) DO UPDATE SET
          type = excluded.type,
          status = excluded.status,
          owner_user_id = excluded.owner_user_id,
          owner_email = excluded.owner_email,
          created_at = excluded.created_at,
          updated_at = excluded.updated_at,
          ip = excluded.ip,
          user_agent = excluded.user_agent,
          last_reminder_run_json = excluded.last_reminder_run_json,
          payload_json = excluded.payload_json
        RETURNING *
      `, [
        row.id, row.type, row.status, row.ownerUserId, row.ownerEmail,
        row.createdAt, row.updatedAt, row.ip, row.userAgent,
        row.lastReminderRunJson, row.payloadJson
      ]);
      return rowToSubmission(result.rows[0]);
    },
    async saveSubmission(submission) {
      return this.createSubmission(submission);
    },
    async getSubmission(id) {
      await ready;
      const result = await pool.query(`SELECT * FROM submissions WHERE id = $1`, [id]);
      return rowToSubmission(result.rows[0]);
    },
    async deleteSubmission(id) {
      await ready;
      const result = await pool.query(`DELETE FROM submissions WHERE id = $1`, [id]);
      return result.rowCount > 0;
    },
    async listSubmissions({ ownerUserId = null, ownerEmail = null, type = null } = {}) {
      await ready;
      let result;
      if (ownerUserId || ownerEmail) {
        result = await pool.query(`
          SELECT * FROM submissions
          WHERE owner_user_id = $1
             OR (owner_user_id IS NULL AND lower(owner_email) = lower($2))
          ORDER BY updated_at DESC, created_at DESC
        `, [ownerUserId || "", ownerEmail || ""]);
      } else if (type) {
        result = await pool.query(`
          SELECT * FROM submissions
          WHERE type = $1
          ORDER BY updated_at DESC, created_at DESC
        `, [type]);
      } else {
        result = await pool.query(`SELECT * FROM submissions ORDER BY created_at DESC`);
      }
      const submissions = result.rows.map(rowToSubmission);
      if (!type) return submissions;
      return submissions.filter((submission) => submission.type === type);
    }
  };
}

function createSubmissionService({ db, legacySubmissionsDir, provider = "sqlite" }) {
  if (!db) throw new Error("db is required");
  const adapter = provider === "postgres" ? createPostgresAdapter(db) : createSqliteAdapter(db);

  const legacyImportReady = (async () => {
    if (!legacySubmissionsDir || !fs.existsSync(legacySubmissionsDir)) return 0;
    const files = fs.readdirSync(legacySubmissionsDir).filter((file) => file.endsWith(".json"));
    let imported = 0;

    for (const fileName of files) {
      try {
        const legacy = JSON.parse(fs.readFileSync(path.join(legacySubmissionsDir, fileName), "utf-8"));
        await adapter.importSubmission({
          id: legacy.id || path.basename(fileName, ".json"),
          type: legacy.type || "split-sheet",
          status: legacy.status || "completed",
          ownerUserId: legacy.ownerUserId || null,
          ownerEmail: legacy.ownerEmail || null,
          createdAt: legacy.createdAt,
          updatedAt: legacy.updatedAt || legacy.createdAt,
          ip: legacy.ip || "",
          userAgent: legacy.userAgent || "",
          lastReminderRun: legacy.lastReminderRun || null,
          payload: legacy.payload || {}
        });
        imported += 1;
      } catch {}
    }

    return imported;
  })();

  async function listSubmissions(options = {}) {
    await legacyImportReady;
    return adapter.listSubmissions(options);
  }

  return {
    async createSubmission({
      id = nanoid(10),
      type = "split-sheet",
      status,
      ownerUserId = null,
      ownerEmail = null,
      createdAt,
      updatedAt,
      ip = "",
      userAgent = "",
      payload = {},
      lastReminderRun = null
    }) {
      await legacyImportReady;
      return adapter.createSubmission({
        id,
        type,
        status,
        ownerUserId,
        ownerEmail,
        createdAt,
        updatedAt,
        ip,
        userAgent,
        lastReminderRun,
        payload
      });
    },
    async saveSubmission(submission) {
      await legacyImportReady;
      return adapter.saveSubmission(submission);
    },
    async getSubmission(id) {
      await legacyImportReady;
      return adapter.getSubmission(id);
    },
    async deleteSubmission(id) {
      await legacyImportReady;
      return adapter.deleteSubmission(id);
    },
    listSubmissions,
    async nextSplitVersion(songTitle) {
      const normalized = String(songTitle || "").trim().toLowerCase();
      if (!normalized) return 1;
      const all = await listSubmissions({ type: "split-sheet" });
      const matches = all.filter((submission) =>
        submission.status !== "draft" &&
        String(submission.payload?.songTitle || "").trim().toLowerCase() === normalized
      );
      const maxVersion = matches.reduce((max, submission) => Math.max(max, Number(submission.payload?.version || 1)), 0);
      return maxVersion + 1;
    },
    serializeSubmission(submission) {
      return JSON.stringify(submission, null, 2);
    }
  };
}

module.exports = {
  createSubmissionService
};
