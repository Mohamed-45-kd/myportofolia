import { site } from "@/content/site";
import { getSettings } from "@/lib/repo";
import type { IconName } from "@/content/types";

/**
 * Resolves the contact details the public site shows.
 *
 * The dashboard's Settings page writes these to the database, but the database
 * on an already-deployed site was seeded from an earlier version of
 * `src/content/site.ts` and therefore still holds the original placeholders.
 * Reading it blindly would publish `hello@mohamedwelijama.com` over a real
 * address, so a stored value only wins when it is genuinely set: not empty, and
 * not one of the placeholders that shipped before the real details existed.
 *
 * Net effect: real edits in the dashboard take effect immediately, and stale
 * placeholder rows quietly defer to the values in `site.ts`.
 */

const PLACEHOLDERS = new Set(
  [
    "hello@mohamedwelijama.com",
    "you@example.com",
    "https://wa.me/000000000000",
    "https://linkedin.com/in/mohamed-weli-jama",
    "https://mohamedwelijama.com",
  ].map((value) => value.toLowerCase()),
);

function pick(stored: string | undefined, fallback: string): string {
  const trimmed = stored?.trim();
  if (!trimmed) return fallback;
  if (PLACEHOLDERS.has(trimmed.toLowerCase())) return fallback;
  return trimmed;
}

export interface ResolvedContact {
  email: string;
  whatsapp: string;
  whatsappDisplay: string;
  github: string;
  linkedin: string;
}

export async function getContact(): Promise<ResolvedContact> {
  let stored: Partial<ResolvedContact> = {};
  try {
    stored = await getSettings();
  } catch {
    // A database hiccup must never take the footer down — fall back to config.
  }

  return {
    email: pick(stored.email, site.contact.email),
    whatsapp: pick(stored.whatsapp, site.contact.whatsapp),
    whatsappDisplay: site.contact.whatsappDisplay,
    github: pick(stored.github, site.contact.github),
    linkedin: pick(stored.linkedin, site.contact.linkedin),
  };
}

export function socialsFor(
  contact: ResolvedContact,
): { href: string; label: string; icon: IconName; detail?: string }[] {
  return [
    { href: contact.github, label: "GitHub", icon: "github" },
    { href: contact.linkedin, label: "LinkedIn", icon: "linkedin" },
    {
      href: contact.whatsapp,
      label: "WhatsApp",
      icon: "message-circle",
      detail: contact.whatsappDisplay,
    },
    { href: `mailto:${contact.email}`, label: "Email", icon: "mail", detail: contact.email },
  ];
}
