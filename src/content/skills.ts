/**
 * Skills — the five groups listed in §10 of the documentation, reproduced exactly.
 *
 * ⚠️ The percentages are NOT a self-assessment and were not in the documentation.
 * Per the brand voice rules they represent how much of the shipped work leans on
 * each tool. Adjust them to taste — they are the one number on this site that is
 * a judgement call rather than a fact.
 */

import type { SkillGroup } from "./types";

export const skillGroups: SkillGroup[] = [
  {
    title: "Programming",
    icon: "terminal",
    note: "The languages I reach for first, and the ones I learned on.",
    items: [
      { name: "JavaScript", level: 90 },
      { name: "Python", level: 82 },
      { name: "SQL", level: 80 },
      { name: "C", level: 70 },
      { name: "C++", level: 65 },
    ],
  },
  {
    title: "Web Development",
    icon: "code",
    note: "Where most of my shipped work lives.",
    items: [
      { name: "HTML", level: 95 },
      { name: "CSS", level: 92 },
      { name: "React", level: 88 },
      { name: "Next.js", level: 86 },
      { name: "TypeScript", level: 82 },
      { name: "Tailwind CSS", level: 90 },
    ],
  },
  {
    title: "Backend & Database",
    icon: "database",
    note: "Data models first. The interface is easier to change than the schema.",
    items: [
      { name: "PostgreSQL", level: 84 },
      { name: "Supabase", level: 82 },
      { name: "Prisma", level: 78 },
      { name: "REST APIs", level: 80 },
    ],
  },
  {
    title: "Development Tools",
    icon: "folder-git",
    note: "Version control on every project, however small.",
    items: [
      { name: "Git", level: 88 },
      { name: "GitHub", level: 88 },
      { name: "VS Code", level: 92 },
      { name: "Vercel", level: 80 },
    ],
  },
  {
    title: "Design & Media",
    icon: "palette",
    note: "Enough to design what I build, and to produce the material around it.",
    items: [
      { name: "Photoshop", level: 75 },
      { name: "Illustrator", level: 70 },
      { name: "Premiere Pro", level: 68 },
      { name: "Canva", level: 85 },
    ],
  },
];

/** Flat list, used for the technology marquee and project tag matching. */
export const allTechnologies: string[] = skillGroups.flatMap((g) =>
  g.items.map((i) => i.name),
);
