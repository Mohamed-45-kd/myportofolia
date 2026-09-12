import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import * as pg from "./store/postgres";

/**
 * Uploaded image storage.
 *
 * Follows the same two-backend rule as `db.ts`: Postgres when a connection
 * string is present, a local directory otherwise. Images are NOT written into
 * `public/`, because a serverless host has no writable disk and anything put
 * there would vanish on the next request.
 *
 * Both backends are read back through `/api/images/<id>`, so a stored image has
 * one stable URL regardless of where the bytes actually live.
 */

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB before processing
const MAX_DIMENSION = 1600; // Long edge, after resizing.
const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

export const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
] as const;

export interface StoredImage {
  bytes: Buffer;
  mime: string;
}

/**
 * Phone photos routinely arrive at 4000px and several megabytes. Storing those
 * raw would bloat the database and punish visitors on slow connections — the
 * exact audience this site is built for. So every upload is resized to fit
 * within MAX_DIMENSION and re-encoded as WebP.
 *
 * If sharp is unavailable for any reason the original bytes are kept rather
 * than failing the upload; the image still works, it is just larger.
 */
async function processImage(
  input: Buffer,
  mime: string,
): Promise<{ bytes: Buffer; mime: string }> {
  // Animated GIFs lose their animation through a naive resize — keep as-is.
  if (mime === "image/gif") return { bytes: input, mime };

  try {
    const { default: sharp } = await import("sharp");
    const output = await sharp(input)
      .rotate() // Honour EXIF orientation, or phone photos come out sideways.
      .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toBuffer();
    return { bytes: output, mime: "image/webp" };
  } catch (error) {
    console.warn("[images] sharp unavailable, storing original:", error);
    return { bytes: input, mime };
  }
}

/* ------------------------- Postgres backend ------------------------- */

let schemaReady: Promise<void> | undefined;

async function ensureImageSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = pg
      .query(
        `CREATE TABLE IF NOT EXISTS app_images (
           id         TEXT PRIMARY KEY,
           mime       TEXT NOT NULL,
           bytes      BYTEA NOT NULL,
           created_at TIMESTAMPTZ NOT NULL DEFAULT now()
         );`,
      )
      .then(() => undefined)
      .catch((error) => {
        schemaReady = undefined;
        throw error;
      });
  }
  return schemaReady;
}

/* --------------------------- Public API ---------------------------- */

/** Stores an image and returns the URL the site should reference it by. */
export async function saveImage(
  input: Buffer,
  mime: string,
): Promise<{ url: string; id: string; bytes: number }> {
  const processed = await processImage(input, mime);
  const extension = processed.mime.split("/")[1] ?? "bin";
  const id = `${randomUUID()}.${extension}`;

  if (pg.isConfigured()) {
    await ensureImageSchema();
    await pg.query(`INSERT INTO app_images (id, mime, bytes) VALUES ($1, $2, $3)`, [
      id,
      processed.mime,
      processed.bytes,
    ]);
  } else {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIR, id), processed.bytes);
  }

  return { url: `/api/images/${id}`, id, bytes: processed.bytes.length };
}

export async function getImage(id: string): Promise<StoredImage | null> {
  // `id` reaches this from a URL segment — never let it escape the directory.
  if (!/^[A-Za-z0-9._-]+$/.test(id) || id.includes("..")) return null;

  if (pg.isConfigured()) {
    try {
      await ensureImageSchema();
      const rows = await pg.query<{ mime: string; bytes: Buffer }>(
        `SELECT mime, bytes FROM app_images WHERE id = $1`,
        [id],
      );
      if (rows.length === 0) return null;
      return { bytes: rows[0].bytes, mime: rows[0].mime };
    } catch (error) {
      console.error("[images] read failed:", error);
      return null;
    }
  }

  try {
    const bytes = await fs.readFile(path.join(UPLOAD_DIR, id));
    return { bytes, mime: mimeFromExtension(id) };
  } catch {
    return null;
  }
}

export async function deleteImage(id: string): Promise<void> {
  if (!/^[A-Za-z0-9._-]+$/.test(id) || id.includes("..")) return;
  if (pg.isConfigured()) {
    await ensureImageSchema();
    await pg.query(`DELETE FROM app_images WHERE id = $1`, [id]);
    return;
  }
  await fs.unlink(path.join(UPLOAD_DIR, id)).catch(() => undefined);
}

function mimeFromExtension(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "avif":
      return "image/avif";
    case "gif":
      return "image/gif";
    default:
      return "image/jpeg";
  }
}
