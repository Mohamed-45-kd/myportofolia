import { createHash } from "node:crypto";

import { projects as seedProjects } from "@/content/projects";
import { skillGroups as seedSkillGroups } from "@/content/skills";
import { services as seedServices } from "@/content/services";
import {
  achievements as seedAchievements,
  education as seedEducation,
  experience as seedExperience,
} from "@/content/journey";
import { posts as seedPosts } from "@/content/posts";
import { site } from "@/content/site";
import type { IconName } from "@/content/types";

import type { Database, TechnologyRecord } from "./types";

/**
 * Seeds the store from the modules in `src/content/`.
 *
 * The content files stay the source of truth for the *initial* state, which
 * keeps them useful as a readable, reviewable record of the real content. Once
 * the store exists on disk the CMS owns the data and the seed is not consulted
 * again — delete `data/content.json` to reset to these values.
 *
 * IDs are derived from a stable key (the slug, or the entity name) rather than
 * generated randomly, so reseeding produces the same identifiers and any link
 * that referenced one keeps working.
 */

function stableId(namespace: string, key: string): string {
  return createHash("sha1").update(`${namespace}:${key}`).digest("hex").slice(0, 24);
}

const SEED_TIME = "2026-01-01T00:00:00.000Z";
const stamps = { createdAt: SEED_TIME, updatedAt: SEED_TIME };

const categoryIcons: Record<string, IconName> = {
  Programming: "terminal",
  "Web Development": "code",
  "Backend & Database": "database",
  "Development Tools": "folder-git",
  "Design & Media": "palette",
};

function seedTechnologies(): TechnologyRecord[] {
  const rows: TechnologyRecord[] = [];
  const seen = new Set<string>();

  // Everything named in the skill groups becomes a reusable technology.
  for (const group of seedSkillGroups) {
    for (const item of group.items) {
      const key = item.name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push({
        id: stableId("technology", key),
        name: item.name,
        category: group.title,
        icon: categoryIcons[group.title] ?? "layers",
        description: "",
        websiteUrl: "",
        featured: item.level >= 85,
        ...stamps,
      });
    }
  }

  // Anything a project uses that the skill groups did not mention.
  for (const project of seedProjects) {
    for (const name of project.technologies) {
      const key = name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push({
        id: stableId("technology", key),
        name,
        category: "Other",
        icon: "layers",
        description: "",
        websiteUrl: "",
        featured: false,
        ...stamps,
      });
    }
  }

  return rows.sort((a, b) => a.name.localeCompare(b.name));
}

export function seedDatabase(): Database {
  return {
    version: 1,

    projects: seedProjects.map((p) => ({
      ...p,
      id: stableId("project", p.slug),
      ...stamps,
    })),

    technologies: seedTechnologies(),

    skillGroups: seedSkillGroups.map((g, i) => ({
      ...g,
      id: stableId("skillGroup", g.title),
      order: i,
      ...stamps,
    })),

    services: seedServices.map((s, i) => ({
      ...s,
      id: stableId("service", s.slug),
      order: i,
      ...stamps,
    })),

    experience: seedExperience.map((e, i) => ({
      ...e,
      id: stableId("experience", `${e.title}|${e.org}|${e.period}`),
      order: i,
      ...stamps,
    })),

    education: seedEducation.map((e, i) => ({
      ...e,
      id: stableId("education", `${e.title}|${e.org}`),
      order: i,
      ...stamps,
    })),

    achievements: seedAchievements.map((a, i) => ({
      ...a,
      id: stableId("achievement", a.title),
      order: i,
      ...stamps,
    })),

    posts: seedPosts.map((p) => ({
      ...p,
      id: stableId("post", p.slug),
      ...stamps,
    })),

    messages: [],

    settings: {
      name: site.name,
      role: site.role,
      mission: site.mission,
      location: site.location,
      description: site.description,
      email: site.contact.email,
      whatsapp: site.contact.whatsapp,
      github: site.contact.github,
      linkedin: site.contact.linkedin,
      cvEnabled: site.cv.enabled,
      cvHref: site.cv.href,
      ...stamps,
    },
  };
}
