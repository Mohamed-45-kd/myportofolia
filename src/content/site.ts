/**
 * Site-wide settings — mirrors the `site_settings` table (§25).
 *
 * ⚠️ CONFIRM BEFORE PUBLISHING: the contact handles below are placeholders.
 * The documentation names the channels (email, GitHub, LinkedIn, WhatsApp)
 * but not the actual addresses. Replace the values marked TODO.
 */

import type { IconName } from "./types";

/**
 * Resolves the canonical site origin.
 *
 * `??` is not enough here: a platform can supply the variable as an EMPTY
 * STRING, which passes the nullish check and then blows up in `new URL("")`.
 * That is exactly what broke the first Vercel build. So each candidate is
 * trimmed, checked, given a protocol if missing, and parsed before use — and
 * Vercel's own deployment URL is used automatically when nothing is set, so a
 * deploy produces correct canonical URLs with zero configuration.
 */
function resolveSiteUrl(): string {
  // On a deployed host, a localhost value is always a copy-paste leftover from
  // local config. Trusting it publishes canonical URLs, og:url tags and a whole
  // sitemap pointing at 127.0.0.1 — which is exactly what happened on the first
  // production deploy. So it is ignored when we know we are deployed.
  const isDeployed =
    process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
  const isLoopback = (url: URL) =>
    ["localhost", "127.0.0.1", "[::1]", "0.0.0.0"].includes(url.hostname);

  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.NEXT_PUBLIC_VERCEL_URL,
    process.env.VERCEL_URL,
  ];

  for (const candidate of candidates) {
    const trimmed = candidate?.trim();
    if (!trimmed) continue;

    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

    let parsed: URL;
    try {
      parsed = new URL(withProtocol);
    } catch {
      continue; // Malformed — try the next rather than failing the build.
    }

    if (isDeployed && isLoopback(parsed)) continue;

    return parsed.origin;
  }

  return "https://mohamedwelijama.com";
}

export const site = {
  name: "Mohamed Weli Jama",
  shortName: "MWJ",
  role: "Software Developer & Web Developer",
  /** Set verbatim, always in tracked uppercase. Never paraphrased, never translated. */
  mission: "My mission is to digitalize our Country.",
  tagline: "I build software that solves real problems — and keeps working after handover.",
  location: "Somaliland",
  url: resolveSiteUrl(),

  description:
    "Mohamed Weli Jama is a software and web developer building school management systems, ordering platforms and custom management software. Mission: to digitalize our Country.",

  contact: {
    email: "hello@mohamedwelijama.com", // TODO: replace with the real address
    whatsapp: "https://wa.me/000000000000", // TODO: replace with the real number
    github: "https://github.com/Mohamed-45-kd",
    linkedin: "https://linkedin.com/in/mohamed-weli-jama", // TODO: confirm handle
  },

  /** Optional CV download — drop the file at public/mohamed-weli-jama-cv.pdf to enable. */
  cv: {
    href: "/mohamed-weli-jama-cv.pdf",
    enabled: false,
  },
} as const;

export const nav: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/journey", label: "Journey" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export const socials: { href: string; label: string; icon: IconName }[] = [
  { href: site.contact.github, label: "GitHub", icon: "github" },
  { href: site.contact.linkedin, label: "LinkedIn", icon: "linkedin" },
  { href: site.contact.whatsapp, label: "WhatsApp", icon: "message-circle" },
  { href: `mailto:${site.contact.email}`, label: "Email", icon: "mail" },
];
