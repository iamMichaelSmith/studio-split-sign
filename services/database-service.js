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
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.PGSSLMODE === "disable" ? false : undefined
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
