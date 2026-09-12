#!/usr/bin/env node
/**
 * Verifies the database connection.
 *
 *   npm run db:check
 *
 * Reads the same environment variables the app does, connects, creates the
 * table if needed, writes a probe row and reads it back. Run it after adding a
 * connection string to confirm the dashboard will be able to save.
 */

import fs from "node:fs";
import path from "node:path";
import pg from "pg";

// Load .env.local the same way Next.js does, so this matches the app.
const envFile = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^"(.*)"$/, "$1");
    if (!(key in process.env)) process.env[key] = value;
  }
}

const NAMES = [
  "DATABASE_URL",
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL_NON_POOLING",
];

const found = NAMES.find((n) => process.env[n]?.trim());

console.log("\n  Database check\n  " + "-".repeat(52) + "\n");

if (!found) {
  console.log("  No connection string found.\n");
  console.log("  Checked: " + NAMES.join(", ") + "\n");
  console.log("  Without one the dashboard uses a local JSON file, which does");
  console.log("  not persist on a serverless host such as Vercel.\n");
  console.log("  Fastest fix — in the Vercel dashboard:");
  console.log("    Storage -> Create Database -> Neon (Postgres) -> Connect");
  console.log("  That injects POSTGRES_URL automatically. Then redeploy.\n");
  process.exit(1);
}

const url = process.env[found].trim();
const redacted = url.replace(/\/\/([^:]+):([^@]+)@/, "//$1:****@");
console.log(`  Using ${found}`);
console.log(`  ${redacted}\n`);

function sslOption(u) {
  if (/sslmode=disable/i.test(u)) return undefined;
  if (/@(localhost|127\.0\.0\.1|\[::1\])[:/]/i.test(u)) return undefined;
  if (process.env.DATABASE_SSL_STRICT === "true") return true;
  return { rejectUnauthorized: false };
}

const pool = new pg.Pool({
  connectionString: url,
  ssl: sslOption(url),
  connectionTimeoutMillis: 15_000,
});

try {
  const { rows: v } = await pool.query("SELECT version() AS version");
  console.log("  [ok] connected — " + v[0].version.split(",")[0]);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_state (
      id         TEXT PRIMARY KEY,
      data       JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  console.log("  [ok] table app_state is present");

  await pool.query(
    `INSERT INTO app_state (id, data) VALUES ('__probe', $1)
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
    [JSON.stringify({ checkedAt: new Date().toISOString() })],
  );
  const { rows: probe } = await pool.query(
    "SELECT data FROM app_state WHERE id = '__probe'",
  );
  console.log("  [ok] wrote and read back a row");

  await pool.query("DELETE FROM app_state WHERE id = '__probe'");
  console.log("  [ok] cleaned up the probe row");

  const { rows: content } = await pool.query(
    "SELECT updated_at FROM app_state WHERE id = 'content'",
  );
  console.log(
    content.length > 0
      ? `  [ok] content row exists, last updated ${content[0].updated_at.toISOString()}`
      : "  [--] no content row yet — it seeds on first use of the dashboard",
  );

  console.log("\n  " + "-".repeat(52));
  console.log("  Ready. Dashboard changes will be saved.\n");
  process.exit(0);
} catch (error) {
  console.error("\n  [FAILED] " + error.message + "\n");
  if (/self.signed|certificate/i.test(error.message)) {
    console.error("  TLS problem. Try adding ?sslmode=require to the URL.\n");
  } else if (/password|authentication/i.test(error.message)) {
    console.error("  Credentials rejected — re-copy the connection string.\n");
  } else if (/ENOTFOUND|ETIMEDOUT|ECONNREFUSED/i.test(error.message)) {
    console.error("  Could not reach the host — check the URL and network.\n");
  }
  process.exit(1);
} finally {
  await pool.end().catch(() => undefined);
}
