/**
 * Database record types.
 *
 * These extend the presentational types in `src/content/types.ts` with the
 * identity and audit columns a stored record needs. Public components keep
 * taking the base types, so nothing on the public site had to change shape
 * when the CMS was added.
 *
 * Each interface maps to a table in §25 of the documentation.
 */

import type {
  Achievement,
  EducationEntry,
  ExperienceEntry,
  IconName,
  Post,
  Project,
  Service,
  SkillGroup,
} from "@/content/types";

export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

export type ProjectRecord = Project & { id: string } & Timestamps;
export type ServiceRecord = Service & { id: string; order: number } & Timestamps;
export type SkillGroupRecord = SkillGroup & { id: string; order: number } & Timestamps;
export type ExperienceRecord = ExperienceEntry & { id: string; order: number } & Timestamps;
export type EducationRecord = EducationEntry & { id: string; order: number } & Timestamps;
export type AchievementRecord = Achievement & { id: string; order: number } & Timestamps;
export type PostRecord = Post & { id: string } & Timestamps;

/** technologies (§16) — created once, reused across projects. */
export interface TechnologyRecord extends Timestamps {
  id: string;
  name: string;
  category: string;
  icon: IconName;
  description: string;
  websiteUrl: string;
  featured: boolean;
}

export type MessageStatus = "New" | "Read" | "Replied";

/** contact_messages (§20) */
export interface MessageRecord extends Timestamps {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
}

/** site_settings (§25) — the editable half of `src/content/site.ts`. */
export interface SettingsRecord extends Timestamps {
  name: string;
  role: string;
  mission: string;
  location: string;
  description: string;
  email: string;
  whatsapp: string;
  github: string;
  linkedin: string;
  cvEnabled: boolean;
  cvHref: string;
}

export interface Database {
  version: number;
  projects: ProjectRecord[];
  technologies: TechnologyRecord[];
  skillGroups: SkillGroupRecord[];
  services: ServiceRecord[];
  experience: ExperienceRecord[];
  education: EducationRecord[];
  achievements: AchievementRecord[];
  posts: PostRecord[];
  messages: MessageRecord[];
  settings: SettingsRecord;
}

export type Collection = Exclude<keyof Database, "version" | "settings">;
