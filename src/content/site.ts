/**
 * Site-wide settings — mirrors the `site_settings` table (§25).
 *
 * ⚠️ CONFIRM BEFORE PUBLISHING: the contact handles below are placeholders.
 * The documentation names the channels (email, GitHub, LinkedIn, WhatsApp)
 * but not the actual addresses. Replace the values marked TODO.
 */

import type { IconName } from "./types";

export const site = {
  name: "Mohamed Weli Jama",
  shortName: "MWJ",
  role: "Software Developer & Web Developer",
  /** Set verbatim, always in tracked uppercase. Never paraphrased, never translated. */
  mission: "My mission is to digitalize our Country.",
  tagline: "I build software that solves real problems — and keeps working after handover.",
  location: "Somaliland",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mohamedwelijama.com",

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
