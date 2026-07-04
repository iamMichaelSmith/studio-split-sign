const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const { Pool } = require("pg");

function ensureParentDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function createSqliteProvider({ dbPath }) {
  if (!dbPath) throw new Error("dbPath is required for sqlite provider");
  ensureParentDir(dbPath);
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  return {
    provider: "sqlite",
    client: db,
    async close() {
      db.close();
    }
  };
}

function createPostgresProvider({ databaseUrl }) {
  if (!databaseUrl) throw new Error("DATABASE_URL is required for postgres provider");
  const normalizedUrl = new URL(databaseUrl);
  normalizedUrl.searchParams.delete("sslmode");
  normalizedUrl.searchParams.delete("ssl");
  normalizedUrl.searchParams.delete("sslcert");
  normalizedUrl.searchParams.delete("sslkey");
  normalizedUrl.searchParams.delete("sslrootcert");
  normalizedUrl.searchParams.delete("sslaccept");
  normalizedUrl.searchParams.delete("sslacceptstrict");
  normalizedUrl.searchParams.delete("gssencmode");
  const sslMode = String(process.env.PGSSLMODE || "").trim().toLowerCase();
  const rejectUnauthorized = String(process.env.PG_SSL_REJECT_UNAUTHORIZED || "false").toLowerCase() === "true";
  let ssl;
  if (sslMode === "disable") {
    ssl = false;
  } else if (sslMode === "verify-full" || rejectUnauthorized) {
    ssl = { rejectUnauthorized: true };
  } else {
    ssl = { rejectUnauthorized: false };
  }
  const pool = new Pool({
    connectionString: normalizedUrl.toString(),
    ssl
  });

  return {
    provider: "postgres",
    client: pool,
    async close() {
      await pool.end();
    }
  };
}

function createDatabaseService({
  provider = "sqlite",
  dbPath,
  databaseUrl
}) {
  const normalizedProvider = String(provider || "sqlite").trim().toLowerCase();

  if (normalizedProvider === "sqlite") {
    return createSqliteProvider({ dbPath });
  }

  if (normalizedProvider === "postgres") {
    return createPostgresProvider({ databaseUrl });
  }

  throw new Error(`Unsupported DB_PROVIDER: ${normalizedProvider}${databaseUrl ? ` (${databaseUrl})` : ""}`);
}

module.exports = {
  createDatabaseService
};
