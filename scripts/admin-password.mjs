#!/usr/bin/env node
/**
 * Sets the admin password.
 *
 *   npm run admin:password
 *
 * Reads a password from a hidden prompt, derives an scrypt hash, and writes it
 * straight into .env.local. The password is never echoed, never written to
 * disk, never passed as a command-line argument (which would land in shell
 * history), and cannot be recovered from the stored hash.
 *
 * It writes the file itself on purpose. The previous version printed lines to
 * copy by hand, and it is far too easy to paste the password itself where the
 * hash belongs — which silently breaks sign-in with a misleading error.
 *
 * Pass --print to output the lines instead of writing the file.
 */

import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";
import fs from "node:fs";
import path from "node:path";

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;
const MIN_LENGTH = 12;
const ENV_FILE = path.join(process.cwd(), ".env.local");

const CTRL_C = String.fromCharCode(3);
const BACKSPACE = String.fromCharCode(127);
const BS = String.fromCharCode(8);

/** Reads a line without echoing it, masking each character with an asterisk. */
function askHidden(question) {
  return new Promise((resolve, reject) => {
    const { stdin, stdout } = process;

    if (!stdin.isTTY) {
      reject(
        new Error(
          "This needs an interactive terminal.\n" +
            "  Run it directly in your terminal:  npm run admin:password",
        ),
      );
      return;
    }

    stdout.write(question);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    let value = "";

    const finish = (result, error) => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.removeListener("data", onData);
      stdout.write("\n");
      if (error) reject(error);
      else resolve(result);
    };

    const onData = (chunk) => {
      for (const ch of chunk) {
        if (ch === "\r" || ch === "\n") return finish(value);
        if (ch === CTRL_C) return finish(null, new Error("Cancelled."));
        if (ch === BACKSPACE || ch === BS) {
          if (value.length > 0) {
            value = value.slice(0, -1);
            stdout.write("\b \b");
          }
          continue;
        }
        // Ignore arrow keys and other control sequences.
        if (ch < " ") continue;
        value += ch;
        stdout.write("*");
      }
    };

    stdin.on("data", onData);
  });
}

function askVisible(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.setEncoding("utf8");
    process.stdin.resume();
    process.stdin.once("data", (data) => {
      process.stdin.pause();
      resolve(String(data).trim());
    });
  });
}

/** Replaces a KEY="value" line, or appends it if absent. Other lines untouched. */
function upsertEnv(file, updates) {
  const lines = fs.existsSync(file)
    ? fs.readFileSync(file, "utf8").split(/\r?\n/)
    : [];

  for (const [key, value] of Object.entries(updates)) {
    const line = `${key}="${value}"`;
    const index = lines.findIndex((l) => l.trimStart().startsWith(`${key}=`));
    if (index >= 0) lines[index] = line;
    else lines.push(line);
  }

  while (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
  fs.writeFileSync(file, lines.join("\n") + "\n", "utf8");
}

function readEnvValue(file, key) {
  if (!fs.existsSync(file)) return null;
  const match = fs
    .readFileSync(file, "utf8")
    .split(/\r?\n/)
    .find((l) => l.trimStart().startsWith(`${key}=`));
  if (!match) return null;
  const raw = match.slice(match.indexOf("=") + 1).trim();
  return raw.replace(/^"(.*)"$/, "$1");
}

async function main() {
  const printOnly = process.argv.includes("--print");

  console.log("\n  Admin credentials\n  " + "-".repeat(50) + "\n");

  const password = await askHidden("  Choose an admin password: ");
  if (password.length < MIN_LENGTH) {
    throw new Error(
      `Password must be at least ${MIN_LENGTH} characters. Nothing was changed.`,
    );
  }

  const confirm = await askHidden("  Type it again to confirm:  ");
  if (password !== confirm) {
    throw new Error("The two passwords did not match. Nothing was changed.");
  }

  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, KEY_LENGTH);
  const hash = `scrypt:${salt.toString("hex")}:${derived.toString("hex")}`;

  // Keep an existing secret so current sessions survive; create one if missing.
  const existingSecret = readEnvValue(ENV_FILE, "AUTH_SECRET");
  const authSecret =
    existingSecret && existingSecret.length >= 32
      ? existingSecret
      : randomBytes(32).toString("hex");

  let email = readEnvValue(ENV_FILE, "ADMIN_EMAIL");
  if (!email || email === "you@example.com") {
    email = await askVisible("  Sign-in email address:     ");
  }

  if (printOnly) {
    console.log("\n  Add these to .env.local:\n");
    console.log(`ADMIN_EMAIL="${email}"`);
    console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
    console.log(`AUTH_SECRET="${authSecret}"`);
    console.log("");
    return;
  }

  upsertEnv(ENV_FILE, {
    ADMIN_EMAIL: email,
    ADMIN_PASSWORD_HASH: hash,
    AUTH_SECRET: authSecret,
  });

  console.log("\n  " + "-".repeat(50));
  console.log("  Saved to .env.local");
  console.log(`    ADMIN_EMAIL          ${email}`);
  console.log("    ADMIN_PASSWORD_HASH  updated (scrypt)");
  console.log(
    `    AUTH_SECRET          ${existingSecret ? "kept" : "generated"}`,
  );
  console.log("  " + "-".repeat(50));
  console.log(
    "\n  Restart the dev server for this to take effect.\n" +
      "  Your password is not stored anywhere — only the hash is.\n",
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(`\n  ${error.message}\n`);
    process.exit(1);
  });
