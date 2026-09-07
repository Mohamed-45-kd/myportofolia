"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  authConfigStatus,
  clearThrottle,
  startSession,
  throttle,
  verifyPassword,
} from "@/lib/auth";

export interface LoginState {
  error?: string;
  email?: string;
}

/**
 * Sign in.
 *
 * The failure message never distinguishes "no such user" from "wrong password",
 * so it cannot be used to discover whether an address is the admin one. Attempts
 * are throttled per client address.
 */
export async function signIn(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const status = authConfigStatus();
  if (!status.configured) {
    // Say which of the two it is. Reporting a config fault as a bad password
    // sends you hunting for the wrong problem.
    return {
      error: status.problem
        ? status.problem
        : `Admin sign-in is not configured yet. Missing: ${status.missing.join(", ")}. Run "npm run admin:password" — it writes the values into .env.local for you.`,
    };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "");

  if (!email || !password) {
    return { error: "Enter both an email address and a password.", email };
  }

  const headerList = await headers();
  const clientKey =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "local";

  const gate = throttle(clientKey);
  if (!gate.allowed) {
    return {
      error: `Too many sign-in attempts. Try again in ${gate.retryInMinutes} minute${gate.retryInMinutes === 1 ? "" : "s"}.`,
      email,
    };
  }

  const expectedEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const storedHash = process.env.ADMIN_PASSWORD_HASH ?? "";

  // Always run the hash comparison, even when the address is wrong, so the
  // response time does not reveal which half failed.
  const passwordOk = await verifyPassword(password, storedHash);
  const emailOk = email === expectedEmail;

  if (!emailOk || !passwordOk) {
    return { error: "Those details are not correct.", email };
  }

  clearThrottle(clientKey);
  await startSession(expectedEmail);

  // Only allow redirects back into the dashboard.
  const destination = from.startsWith("/admin") ? from : "/admin";
  redirect(destination);
}
