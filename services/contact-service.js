const crypto = require("crypto");
const { nanoid } = require("nanoid");

const CONSENT_COPY_VERSION = "marketing-opt-in-v1";

function nowIso() {
  return new Date().toISOString();
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function mapContact(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name || "",
    marketingStatus: row.marketing_status,
    latestSource: row.latest_source,
    consentAt: row.consent_at || null,
    unsubscribedAt: row.unsubscribed_at || null,
    unsubscribeToken: row.unsubscribe_token,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function nextState(existing, marketingOptIn) {
  if (marketingOptIn) return "subscribed";
  return existing?.marketing_status || "transactional_only";
}

function createSqliteAdapter(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS marketing_contacts (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      display_name TEXT,
      marketing_status TEXT NOT NULL DEFAULT 'transactional_only',
      latest_source TEXT NOT NULL,
      consent_at TEXT,
      consent_ip TEXT,
      consent_user_agent TEXT,
      consent_copy_version TEXT,
      unsubscribed_at TEXT,
      unsubscribe_token TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS marketing_contact_events (
      id TEXT PRIMARY KEY,
      contact_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      source TEXT NOT NULL,
      ip TEXT,
      user_agent TEXT,
      consent_copy_version TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (contact_id) REFERENCES marketing_contacts(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_marketing_contacts_status ON marketing_contacts(marketing_status);
    CREATE INDEX IF NOT EXISTS idx_marketing_contact_events_contact ON marketing_contact_events(contact_id);
  `);

  const byEmail = db.prepare(`SELECT * FROM marketing_contacts WHERE email = ?`);
  const byToken = db.prepare(`SELECT * FROM marketing_contacts WHERE unsubscribe_token = ?`);
  const list = db.prepare(`SELECT * FROM marketing_contacts ORDER BY created_at DESC`);
  const insert = db.prepare(`
    INSERT INTO marketing_contacts (
      id, email, display_name, marketing_status, latest_source,
      consent_at, consent_ip, consent_user_agent, consent_copy_version,
      unsubscribed_at, unsubscribe_token, created_at, updated_at
    ) VALUES (
      @id, @email, @displayName, @marketingStatus, @latestSource,
      @consentAt, @consentIp, @consentUserAgent, @consentCopyVersion,
      @unsubscribedAt, @unsubscribeToken, @createdAt, @updatedAt
    )
  `);
  const update = db.prepare(`
    UPDATE marketing_contacts SET
      display_name = @displayName,
      marketing_status = @marketingStatus,
      latest_source = @latestSource,
      consent_at = @consentAt,
      consent_ip = @consentIp,
      consent_user_agent = @consentUserAgent,
      consent_copy_version = @consentCopyVersion,
      unsubscribed_at = @unsubscribedAt,
      updated_at = @updatedAt
    WHERE id = @id
  `);
  const insertEvent = db.prepare(`
    INSERT INTO marketing_contact_events (
      id, contact_id, event_type, source, ip, user_agent, consent_copy_version, created_at
    ) VALUES (@id, @contactId, @eventType, @source, @ip, @userAgent, @consentCopyVersion, @createdAt)
  `);

  return {
    async byEmail(email) { return byEmail.get(email) || null; },
    async byToken(token) { return byToken.get(token) || null; },
    async list() { return list.all(); },
    async insert(row) { insert.run(row); return byEmail.get(row.email); },
    async update(row) { update.run(row); return byEmail.get(row.email); },
    async insertEvent(row) { insertEvent.run(row); }
  };
}

function createPostgresAdapter(pool) {
  const ready = (async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS marketing_contacts (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        display_name TEXT,
        marketing_status TEXT NOT NULL DEFAULT 'transactional_only',
        latest_source TEXT NOT NULL,
        consent_at TEXT,
        consent_ip TEXT,
        consent_user_agent TEXT,
        consent_copy_version TEXT,
        unsubscribed_at TEXT,
        unsubscribe_token TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS marketing_contact_events (
        id TEXT PRIMARY KEY,
        contact_id TEXT NOT NULL REFERENCES marketing_contacts(id) ON DELETE CASCADE,
        event_type TEXT NOT NULL,
        source TEXT NOT NULL,
        ip TEXT,
        user_agent TEXT,
        consent_copy_version TEXT,
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_marketing_contacts_status ON marketing_contacts(marketing_status);
      CREATE INDEX IF NOT EXISTS idx_marketing_contact_events_contact ON marketing_contact_events(contact_id);
    `);
  })();

  return {
    async byEmail(email) {
      await ready;
      const result = await pool.query(`SELECT * FROM marketing_contacts WHERE email = $1`, [email]);
      return result.rows[0] || null;
    },
    async byToken(token) {
      await ready;
      const result = await pool.query(`SELECT * FROM marketing_contacts WHERE unsubscribe_token = $1`, [token]);
      return result.rows[0] || null;
    },
    async list() {
      await ready;
      const result = await pool.query(`SELECT * FROM marketing_contacts ORDER BY created_at DESC`);
      return result.rows;
    },
    async insert(row) {
      await ready;
      const result = await pool.query(`
        INSERT INTO marketing_contacts (
          id, email, display_name, marketing_status, latest_source,
          consent_at, consent_ip, consent_user_agent, consent_copy_version,
          unsubscribed_at, unsubscribe_token, created_at, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        RETURNING *
      `, [
        row.id, row.email, row.displayName, row.marketingStatus, row.latestSource,
        row.consentAt, row.consentIp, row.consentUserAgent, row.consentCopyVersion,
        row.unsubscribedAt, row.unsubscribeToken, row.createdAt, row.updatedAt
      ]);
      return result.rows[0];
    },
    async update(row) {
      await ready;
      const result = await pool.query(`
        UPDATE marketing_contacts SET
          display_name = $1, marketing_status = $2, latest_source = $3,
          consent_at = $4, consent_ip = $5, consent_user_agent = $6,
          consent_copy_version = $7, unsubscribed_at = $8, updated_at = $9
        WHERE id = $10
        RETURNING *
      `, [
        row.displayName, row.marketingStatus, row.latestSource,
        row.consentAt, row.consentIp, row.consentUserAgent,
        row.consentCopyVersion, row.unsubscribedAt, row.updatedAt, row.id
      ]);
      return result.rows[0] || null;
    },
    async insertEvent(row) {
      await ready;
      await pool.query(`
        INSERT INTO marketing_contact_events (
          id, contact_id, event_type, source, ip, user_agent, consent_copy_version, created_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      `, [row.id, row.contactId, row.eventType, row.source, row.ip, row.userAgent, row.consentCopyVersion, row.createdAt]);
    }
  };
}

function createContactService({ db, provider = "sqlite" }) {
  if (!db) throw new Error("db is required");
  const adapter = provider === "postgres" ? createPostgresAdapter(db) : createSqliteAdapter(db);

  async function recordContact({
    email,
    displayName = "",
    source,
    marketingOptIn = false,
    ip = "",
    userAgent = ""
  }) {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !normalizedEmail.includes("@")) return null;
    const timestamp = nowIso();
    const existing = await adapter.byEmail(normalizedEmail);
    const marketingStatus = nextState(existing, Boolean(marketingOptIn));
    const row = existing ? {
      id: existing.id,
      email: normalizedEmail,
      displayName: String(displayName || existing.display_name || "").trim(),
      marketingStatus,
      latestSource: source,
      consentAt: marketingOptIn ? timestamp : existing.consent_at,
      consentIp: marketingOptIn ? ip : existing.consent_ip,
      consentUserAgent: marketingOptIn ? userAgent : existing.consent_user_agent,
      consentCopyVersion: marketingOptIn ? CONSENT_COPY_VERSION : existing.consent_copy_version,
      unsubscribedAt: marketingOptIn ? null : existing.unsubscribed_at,
      updatedAt: timestamp
    } : {
      id: nanoid(18),
      email: normalizedEmail,
      displayName: String(displayName || "").trim(),
      marketingStatus,
      latestSource: source,
      consentAt: marketingOptIn ? timestamp : null,
      consentIp: marketingOptIn ? ip : null,
      consentUserAgent: marketingOptIn ? userAgent : null,
      consentCopyVersion: marketingOptIn ? CONSENT_COPY_VERSION : null,
      unsubscribedAt: null,
      unsubscribeToken: crypto.randomBytes(24).toString("hex"),
      createdAt: timestamp,
      updatedAt: timestamp
    };
    const saved = existing ? await adapter.update(row) : await adapter.insert(row);
    await adapter.insertEvent({
      id: nanoid(18),
      contactId: saved.id,
      eventType: marketingOptIn ? "marketing_opt_in" : "transactional_contact_recorded",
      source,
      ip,
      userAgent,
      consentCopyVersion: marketingOptIn ? CONSENT_COPY_VERSION : null,
      createdAt: timestamp
    });
    return mapContact(saved);
  }

  return {
    consentCopyVersion: CONSENT_COPY_VERSION,
    recordContact,
    async listContacts() {
      return (await adapter.list()).map(mapContact);
    },
    async getByUnsubscribeToken(token) {
      return mapContact(await adapter.byToken(String(token || "").trim()));
    },
    async unsubscribe(token, { ip = "", userAgent = "" } = {}) {
      const existing = await adapter.byToken(String(token || "").trim());
      if (!existing) return null;
      const timestamp = nowIso();
      const saved = await adapter.update({
        id: existing.id,
        email: existing.email,
        displayName: existing.display_name,
        marketingStatus: "unsubscribed",
        latestSource: "unsubscribe",
        consentAt: existing.consent_at,
        consentIp: existing.consent_ip,
        consentUserAgent: existing.consent_user_agent,
        consentCopyVersion: existing.consent_copy_version,
        unsubscribedAt: timestamp,
        updatedAt: timestamp
      });
      await adapter.insertEvent({
        id: nanoid(18),
        contactId: existing.id,
        eventType: "marketing_unsubscribed",
        source: "unsubscribe",
        ip,
        userAgent,
        consentCopyVersion: existing.consent_copy_version,
        createdAt: timestamp
      });
      return mapContact(saved);
    }
  };
}

module.exports = { createContactService, CONSENT_COPY_VERSION };
