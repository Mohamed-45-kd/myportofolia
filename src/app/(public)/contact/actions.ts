"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createMessage } from "@/lib/repo";

/**
 * Per-address submission limit. The inbox is the one public write path on the
 * site, so it is the one worth throttling: without this a script can fill the
 * store with junk and bury real enquiries.
 */
const submissions = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function withinRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = submissions.get(key);
  if (!entry || now - entry.first > WINDOW_MS) {
    submissions.set(key, { count: 1, first: now });
    return true;
  }
  entry.count += 1;
  return entry.count <= MAX_PER_WINDOW;
}

export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "subject" | "message", string>>;
  values?: { name: string; email: string; subject: string; message: string };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Errors state the rule, not the failure — per the microcopy rules in the
 * design system. Validation runs on the server so it cannot be bypassed.
 *
 * The message is stored through the same repository the dashboard reads, so a
 * submission appears in the admin inbox straight away.
 */
export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    subject: String(formData.get("subject") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  // Honeypot — bots fill every field they find.
  if (String(formData.get("company") ?? "").length > 0) {
    return { status: "success", message: "Thank you — your message has been sent." };
  }

  const errors: ContactState["errors"] = {};
  if (values.name.length < 2) errors.name = "Name needs at least 2 characters.";
  if (!EMAIL.test(values.email)) errors.email = "Email must look like name@example.com.";
  if (values.subject.length < 3) errors.subject = "Subject needs at least 3 characters.";
  if (values.message.length < 20)
    errors.message = "Message needs at least 20 characters — tell me what you are building.";
  if (values.message.length > 4000)
    errors.message = "Message cannot be longer than 4000 characters.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, values };
  }

  const headerList = await headers();
  const clientKey =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "local";

  if (!withinRateLimit(clientKey)) {
    return {
      status: "error",
      message:
        "You have sent several messages already. Please wait an hour, or email me directly using the address below.",
      values,
    };
  }

  const { ok } = await createMessage(values);

  if (!ok) {
    return {
      status: "error",
      message:
        "Your message could not be stored on the server. Please email me directly using the address below — it reaches me the same way.",
      values,
    };
  }

  // Refresh the dashboard's unread count.
  revalidatePath("/admin");
  revalidatePath("/admin/messages");

  return {
    status: "success",
    message: "Thank you — your message has been received. I reply within two working days.",
  };
}
