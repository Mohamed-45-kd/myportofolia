import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

import type { Database } from "./types";
import { seedDatabase } from "./seed";
import * as pg from "./store/postgres";

/**
 * The storage seam.
 *
 * Everything above this file talks to `repo.ts`, which talks to these two
 * functions. Today they read and write a single JSON document; on first run the
 * document is seeded from the modules in `src/content/`, so the CMS starts with
 * the real content already in it rather than an empty shell.
 *
 * To move to Supabase, replace `readDatabase` and `writeDatabase` with queries
 * (or replace the individual functions in `repo.ts` with per-table queries,
 * which is the better shape once the data is relational). Nothing else changes:
 * every page and every server action goes through `repo.ts`.
 *
 * TWO BACKENDS, chosen automatically:
 *
 *   • Postgres — used whenever a connection string is present (DATABASE_URL,
 *     POSTGRES_URL, ...). This is what makes the dashboard work on a serverless
 *     host, where there is no writable disk.
 *   • JSON file — the local default, so a fresh clone runs with no setup.
 *
 * `storageMode()` reports which one is live, and the admin UI explains the
 * situation when writes cannot be persisted.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "content.json");

/** Serialises writes within a single process so two actions cannot interleave. */
let writeQueue: Promise<unknown> = Promise.resolve();

let cache: { db: Database; mtime: number } | null = null;

async function loadFromDisk(): Promise<Database | null> {
  try {
    const [raw, stat] = await Promise.all([
      fs.readFile(DB_PATH, "utf8"),
      fs.stat(DB_PATH),
    ]);
    const db = JSON.parse(raw) as Database;
    cache = { db, mtime: stat.mtimeMs };
    return db;
  } catch {
    return null;
  }
}

export type StorageMode = "postgres" | "file" | "ephemeral";

/** Which backend is actually in use right now. */
export async function storageMode(): Promise<StorageMode> {
  if (pg.isConfigured()) return "postgres";
  return (await isFileWritable()) ? "file" : "ephemeral";
}

export async function readDatabase(): Promise<Database> {
  if (pg.isConfigured()) return pg.readStore();
  return readFromFile();
}

async function readFromFile(): Promise<Database> {
  // Reuse the cached copy when the file has not changed underneath us.
  if (cache) {
    try {
      const stat = await fs.stat(DB_PATH);
      if (stat.mtimeMs === cache.mtime) return cache.db;
    } catch {
      /* file went away — fall through and reseed */
    }
  }

  const onDisk = await loadFromDisk();
  if (onDisk) return onDisk;

  // First run (or a read-only filesystem): seed from the content modules.
  const seeded = seedDatabase();
  const saved = await writeToFile(seeded);
  if (!saved) cache = { db: seeded, mtime: 0 };
  return seeded;
}

export async function writeDatabase(db: Database): Promise<boolean> {
  if (pg.isConfigured()) return pg.writeStore(db);
  return writeToFile(db);
}

async function writeToFile(db: Database): Promise<boolean> {
  const task = writeQueue.then(async () => {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      // Write to a temporary file and rename, so a crash mid-write cannot
      // truncate the store.
      const tmp = `${DB_PATH}.${randomUUID()}.tmp`;
      await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
      await fs.rename(tmp, DB_PATH);
      const stat = await fs.stat(DB_PATH);
      cache = { db, mtime: stat.mtimeMs };
      return true;
    } catch (error) {
      console.error("[db] write failed:", error);
      cache = { db, mtime: 0 };
      return false;
    }
  });

  writeQueue = task.catch(() => undefined);
  return task;
}

/** Read, mutate, write. Returns false if the write could not be persisted. */
export async function mutate(
  fn: (db: Database) => void | Promise<void>,
): Promise<boolean> {
  // Postgres does this in a transaction so concurrent edits cannot clobber.
  if (pg.isConfigured()) return pg.mutateStore(fn);

  const db = await readDatabase();
  // Work on a copy so a failed write cannot leave a half-applied object cached.
  const next: Database = JSON.parse(JSON.stringify(db));
  await fn(next);
  return writeDatabase(next);
}

/** Whether changes made in the dashboard will actually persist. */
export async function isWritable(): Promise<boolean> {
  if (pg.isConfigured()) return true;
  return isFileWritable();
}

async function isFileWritable(): Promise<boolean> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const probe = path.join(DATA_DIR, ".write-probe");
    await fs.writeFile(probe, "ok", "utf8");
    await fs.unlink(probe);
    return true;
  } catch {
    return false;
  }
}

export function newId(): string {
  return randomUUID();
}

export function stamp() {
  const now = new Date().toISOString();
  return { createdAt: now, updatedAt: now };
}
