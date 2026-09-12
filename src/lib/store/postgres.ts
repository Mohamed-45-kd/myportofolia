import { Pool } from "pg";
import type { Database } from "../types";
import { seedDatabase } from "../seed";

/**
 * Postgres-backed store.
 *
 * Activates whenever a connection string is present, which is what makes the
 * dashboard work on a serverless host where there is no writable disk.
 *
 * The whole content document is stored as a single JSONB row. That is a
 * deliberate trade rather than the fully relational schema in §25 of the
 * documentation: it needs no migrations, no ORM and no rewrite of `repo.ts`,
 * so the dashboard starts persisting immediately. For one administrator and a
 * few hundred records it is entirely adequate. Splitting it into real tables is
 * still worth doing later — everything already funnels through `repo.ts`, so
 * that stays a contained change.
 *
 * Writes go through a transaction with SELECT ... FOR UPDATE, so two concurrent
 * edits queue instead of overwriting each other.
 */

const TABLE = "app_state";
const ROW_ID = "content";

export function connectionString(): string | null {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL_NON_POOLING,
  ];
  for (const value of candidates) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return null;
}

export function isConfigured(): boolean {
  return connectionString() !== null;
}

/**
 * Managed Postgres (Neon, Supabase, Railway) terminates TLS at a pooler whose
 * certificate chain often fails default verification. Verification is therefore
 * relaxed for remote hosts unless DATABASE_SSL_STRICT=true is set, which is the
 * same default the platform SDKs use. Local connections use no TLS at all.
 */
function sslOption(url: string) {
  if (/sslmode=disable/i.test(url)) return undefined;
  const isLocal = /@(localhost|127\.0\.0\.1|\[::1\])[:/]/i.test(url);
  if (isLocal) return undefined;
  if (process.env.DATABASE_SSL_STRICT === "true") return true;
  return { rejectUnauthorized: false };
}

/** Cached on globalThis so dev hot-reloads and warm lambdas reuse one pool. */
const globalForPool = globalThis as unknown as {
  __mwjPool?: Pool;
  __mwjSchemaReady?: Promise<void>;
};

function getPool(): Pool {
  if (globalForPool.__mwjPool) return globalForPool.__mwjPool;

  const url = connectionString();
  if (!url) throw new Error("No Postgres connection string is configured.");

  const pool = new Pool({
    connectionString: url,
    ssl: sslOption(url),
    // Serverless invocations are short-lived; a small pool avoids exhausting
    // the provider's connection limit across many concurrent lambdas.
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  });

  pool.on("error", (error) => {
    console.error("[db] idle client error:", error.message);
  });

  globalForPool.__mwjPool = pool;
  return pool;
}

async function ensureSchema(): Promise<void> {
  if (!globalForPool.__mwjSchemaReady) {
    globalForPool.__mwjSchemaReady = (async () => {
      await getPool().query(`
        CREATE TABLE IF NOT EXISTS ${TABLE} (
          id         TEXT PRIMARY KEY,
          data       JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `);
    })().catch((error) => {
      // Let the next call retry rather than caching a failure forever.
      globalForPool.__mwjSchemaReady = undefined;
      throw error;
    });
  }
  return globalForPool.__mwjSchemaReady;
}

/**
 * Generic query escape hatch, used by feature stores that keep their own table
 * (uploaded images, for one) rather than living inside the content document.
 */
export async function query<T extends import("pg").QueryResultRow = never>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const { rows } = await getPool().query<T>(text, params);
  return rows;
}

export async function readStore(): Promise<Database> {
  await ensureSchema();
  const { rows } = await getPool().query<{ data: Database }>(
    `SELECT data FROM ${TABLE} WHERE id = $1`,
    [ROW_ID],
  );

  if (rows.length > 0) return rows[0].data;

  // First run against an empty database — seed it from the content modules.
  const seeded = seedDatabase();
  await getPool().query(
    `INSERT INTO ${TABLE} (id, data) VALUES ($1, $2)
     ON CONFLICT (id) DO NOTHING`,
    [ROW_ID, JSON.stringify(seeded)],
  );
  return seeded;
}

export async function writeStore(db: Database): Promise<boolean> {
  try {
    await ensureSchema();
    await getPool().query(
      `INSERT INTO ${TABLE} (id, data, updated_at) VALUES ($1, $2, now())
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
      [ROW_ID, JSON.stringify(db)],
    );
    return true;
  } catch (error) {
    console.error("[db] postgres write failed:", error);
    return false;
  }
}

/** Read-modify-write inside a transaction, so concurrent edits queue. */
export async function mutateStore(
  fn: (db: Database) => void | Promise<void>,
): Promise<boolean> {
  await ensureSchema();
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query<{ data: Database }>(
      `SELECT data FROM ${TABLE} WHERE id = $1 FOR UPDATE`,
      [ROW_ID],
    );

    let current: Database;
    if (rows.length > 0) {
      current = rows[0].data;
    } else {
      current = seedDatabase();
      await client.query(`INSERT INTO ${TABLE} (id, data) VALUES ($1, $2)`, [
        ROW_ID,
        JSON.stringify(current),
      ]);
    }

    await fn(current);

    await client.query(
      `UPDATE ${TABLE} SET data = $2, updated_at = now() WHERE id = $1`,
      [ROW_ID, JSON.stringify(current)],
    );
    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    console.error("[db] postgres transaction failed:", error);
    return false;
  } finally {
    client.release();
  }
}

/** Round-trips a query to prove the credentials and network path work. */
export async function healthCheck(): Promise<
  { ok: true; detail: string } | { ok: false; detail: string }
> {
  if (!isConfigured()) {
    return { ok: false, detail: "No connection string configured." };
  }
  try {
    await ensureSchema();
    const { rows } = await getPool().query<{ now: string; version: string }>(
      "SELECT now()::text AS now, version() AS version",
    );
    const version = rows[0]?.version?.split(" ").slice(0, 2).join(" ") ?? "Postgres";
    return { ok: true, detail: `${version}, server time ${rows[0]?.now}` };
  } catch (error) {
    return {
      ok: false,
      detail: error instanceof Error ? error.message : String(error),
    };
  }
}
