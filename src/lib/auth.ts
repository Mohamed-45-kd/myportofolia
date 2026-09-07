import {
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

/**
 * Admin authentication (§23).
 *
 * A single administrator, so there is no user table: the credential lives in
 * environment variables and the session is a signed, httpOnly cookie.
 *
 *   ADMIN_EMAIL          the sign-in address
 *   ADMIN_PASSWORD_HASH  scrypt:<salt-hex>:<hash-hex>, produced by
 *                        `npm run admin:password` — the plain password is never
 *                        stored anywhere
 *   AUTH_SECRET          random 32+ byte string used to sign session cookies
 *
 * The password is verified with scrypt and a constant-time comparison. The
 * session cookie carries no privileges of its own — it is an HMAC over the
 * subject and expiry, so it cannot be forged or extended without the secret.
 *
 * When Supabase Auth replaces this, `getSession` and `requireAdmin` are the
 * only functions the rest of the application calls.
 */

const COOKIE_NAME = "mwj_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours
const KEY_LENGTH = 64;

export interface Session {
  email: string;
  issuedAt: number;
  expiresAt: number;
}

/* ------------------------------------------------------------------ *
 * Configuration
 * ------------------------------------------------------------------ */

export interface AuthConfigStatus {
  configured: boolean;
  missing: string[];
  /** Set when a value is present but unusable, e.g. a password stored in plain text. */
  problem?: string;
}

/**
 * Distinguishes "not set up yet" from "set up wrongly".
 *
 * The common mistake is putting the password itself into ADMIN_PASSWORD_HASH
 * instead of the hash the generator produces. Without this check the app just
 * says the sign-in details are wrong, which sends you looking in the wrong
 * place entirely.
 */
export function authConfigStatus(): AuthConfigStatus {
  const missing: string[] = [];
  if (!process.env.ADMIN_EMAIL) missing.push("ADMIN_EMAIL");
  if (!process.env.ADMIN_PASSWORD_HASH) missing.push("ADMIN_PASSWORD_HASH");
  if (!process.env.AUTH_SECRET) missing.push("AUTH_SECRET");
  if (missing.length > 0) return { configured: false, missing };

  const stored = process.env.ADMIN_PASSWORD_HASH ?? "";
  if (!isWellFormedHash(stored)) {
    return {
      configured: false,
      missing: [],
      problem:
        "ADMIN_PASSWORD_HASH does not contain a valid hash. It looks like a plain password was saved there instead. Run \"npm run admin:password\" — it writes the correct value into .env.local for you.",
    };
  }

  return { configured: true, missing: [] };
}

/** `scrypt:<32 hex>:<128 hex>`, or the legacy `$`-separated form. */
export function isWellFormedHash(stored: string): boolean {
  const parts = stored.includes(":") ? stored.split(":") : stored.split("$");
  if (parts.length !== 3) return false;
  if (parts[0] !== "scrypt") return false;
  if (!/^[0-9a-f]+$/i.test(parts[1]) || parts[1].length !== 32) return false;
  if (!/^[0-9a-f]+$/i.test(parts[2]) || parts[2].length !== KEY_LENGTH * 2) return false;
  return true;
}

function secret(): string {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 16) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Set a random 32+ character value in .env.local.",
    );
  }
  return value;
}

/* ------------------------------------------------------------------ *
 * Passwords
 * ------------------------------------------------------------------ */

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, KEY_LENGTH);
  return `scrypt:${salt.toString("hex")}:${derived.toString("hex")}`;
}

/**
 * Accepts `scrypt:salt:hash`.
 *
 * The separator is a colon rather than `$` on purpose: Next.js runs dotenv
 * expansion over .env files, so a `$` inside ADMIN_PASSWORD_HASH is treated as
 * a variable reference and silently eats part of the hash. `$`-separated
 * hashes from an earlier version are still read, for anyone who generated one.
 */
export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.includes(":") ? stored.split(":") : stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;

  const salt = Buffer.from(parts[1], "hex");
  const expected = Buffer.from(parts[2], "hex");
  if (expected.length !== KEY_LENGTH) return false;

  const derived = await scrypt(password, salt, KEY_LENGTH);
  return timingSafeEqual(derived, expected);
}

/* ------------------------------------------------------------------ *
 * Session tokens
 * ------------------------------------------------------------------ */

function b64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sign(payload: string): string {
  return b64url(createHmac("sha256", secret()).update(payload).digest());
}

export function createToken(email: string): { token: string; expiresAt: number } {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + SESSION_TTL_SECONDS;
  const payload = b64url(JSON.stringify({ email, issuedAt, expiresAt }));
  return { token: `${payload}.${sign(payload)}`, expiresAt };
}

export function verifyToken(token: string | undefined): Session | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  // Constant-time comparison of the signature.
  const expected = Buffer.from(sign(payload));
  const provided = Buffer.from(signature);
  if (expected.length !== provided.length) return null;
  if (!timingSafeEqual(expected, provided)) return null;

  try {
    const data = JSON.parse(
      Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString(),
    ) as Session;
    if (typeof data.expiresAt !== "number") return null;
    if (data.expiresAt * 1000 < Date.now()) return null;
    if (data.email !== process.env.ADMIN_EMAIL) return null;
    return data;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ *
 * Session lifecycle
 * ------------------------------------------------------------------ */

export async function startSession(email: string): Promise<void> {
  const { token, expiresAt } = createToken(email);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt * 1000),
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<Session | null> {
  try {
    const store = await cookies();
    return verifyToken(store.get(COOKIE_NAME)?.value);
  } catch {
    return null;
  }
}

/**
 * Guard for every admin page and every admin server action. Server actions are
 * separately reachable HTTP endpoints, so each one must call this itself —
 * the layout guard does not protect them.
 */
export async function requireAdmin(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;

/* ------------------------------------------------------------------ *
 * Sign-in throttling
 * ------------------------------------------------------------------ */

const attempts = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export function throttle(key: string): { allowed: boolean; retryInMinutes: number } {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now - entry.first > WINDOW_MS) {
    attempts.set(key, { count: 1, first: now });
    return { allowed: true, retryInMinutes: 0 };
  }

  entry.count += 1;
  if (entry.count > MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryInMinutes: Math.ceil((WINDOW_MS - (now - entry.first)) / 60000),
    };
  }
  return { allowed: true, retryInMinutes: 0 };
}

export function clearThrottle(key: string): void {
  attempts.delete(key);
}
