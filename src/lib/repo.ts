import { mutate, newId, readDatabase, stamp } from "./db";
import type {
  AchievementRecord,
  Collection,
  Database,
  EducationRecord,
  ExperienceRecord,
  MessageRecord,
  MessageStatus,
  PostRecord,
  ProjectRecord,
  ServiceRecord,
  SettingsRecord,
  SkillGroupRecord,
  TechnologyRecord,
} from "./types";

/**
 * Every read and write in the application goes through this module — the public
 * pages, the admin dashboard and the contact form alike. It is the only place
 * that knows how the data is stored.
 */

/* ------------------------------------------------------------------ *
 * Reads — public site
 * ------------------------------------------------------------------ */

export async function getSettings(): Promise<SettingsRecord> {
  return (await readDatabase()).settings;
}

export async function getProjects(): Promise<ProjectRecord[]> {
  return (await readDatabase()).projects;
}

export async function getPublishedProjects(): Promise<ProjectRecord[]> {
  return (await getProjects()).filter((p) => p.published);
}

export async function getFeaturedProjects(): Promise<ProjectRecord[]> {
  return (await getPublishedProjects()).filter((p) => p.featured);
}

export async function getProjectBySlug(slug: string): Promise<ProjectRecord | undefined> {
  return (await getPublishedProjects()).find((p) => p.slug === slug);
}

export async function getProjectById(id: string): Promise<ProjectRecord | undefined> {
  return (await getProjects()).find((p) => p.id === id);
}

export async function getTechnologies(): Promise<TechnologyRecord[]> {
  return (await readDatabase()).technologies;
}

export async function getSkillGroups(): Promise<SkillGroupRecord[]> {
  return sortByOrder((await readDatabase()).skillGroups);
}

export async function getServices(): Promise<ServiceRecord[]> {
  return sortByOrder((await readDatabase()).services);
}

export async function getExperience(): Promise<ExperienceRecord[]> {
  return sortByOrder((await readDatabase()).experience);
}

export async function getEducation(): Promise<EducationRecord[]> {
  return sortByOrder((await readDatabase()).education);
}

export async function getAchievements(): Promise<AchievementRecord[]> {
  return sortByOrder((await readDatabase()).achievements);
}

export async function getPosts(): Promise<PostRecord[]> {
  return (await readDatabase()).posts;
}

export async function getPublishedPosts(): Promise<PostRecord[]> {
  return (await getPosts())
    .filter((p) => p.published)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<PostRecord | undefined> {
  return (await getPublishedPosts()).find((p) => p.slug === slug);
}

export async function getPostById(id: string): Promise<PostRecord | undefined> {
  return (await getPosts()).find((p) => p.id === id);
}

export async function getMessages(): Promise<MessageRecord[]> {
  return (await readDatabase()).messages.sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1,
  );
}

export async function getMessageById(id: string): Promise<MessageRecord | undefined> {
  return (await readDatabase()).messages.find((m) => m.id === id);
}

function sortByOrder<T extends { order: number }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => a.order - b.order);
}

/* ------------------------------------------------------------------ *
 * Dashboard overview (§22)
 * ------------------------------------------------------------------ */

export interface OverviewStats {
  totalProjects: number;
  featuredProjects: number;
  inProgressProjects: number;
  completedProjects: number;
  publishedProjects: number;
  totalTechnologies: number;
  totalPosts: number;
  publishedPosts: number;
  newMessages: number;
  totalMessages: number;
  recentProjects: ProjectRecord[];
  recentMessages: MessageRecord[];
}

export async function getOverviewStats(): Promise<OverviewStats> {
  const db = await readDatabase();
  const inProgress = ["Idea", "Planning", "In Progress", "Near Completion"];
  const completed = ["Completed", "Maintained"];

  return {
    totalProjects: db.projects.length,
    featuredProjects: db.projects.filter((p) => p.featured).length,
    inProgressProjects: db.projects.filter((p) => inProgress.includes(p.status)).length,
    completedProjects: db.projects.filter((p) => completed.includes(p.status)).length,
    publishedProjects: db.projects.filter((p) => p.published).length,
    totalTechnologies: db.technologies.length,
    totalPosts: db.posts.length,
    publishedPosts: db.posts.filter((p) => p.published).length,
    newMessages: db.messages.filter((m) => m.status === "New").length,
    totalMessages: db.messages.length,
    recentProjects: [...db.projects]
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
      .slice(0, 5),
    recentMessages: [...db.messages]
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, 5),
  };
}

/** Counts shown against the sidebar items. */
export async function getNavCounts() {
  const db = await readDatabase();
  return {
    projects: db.projects.length,
    technologies: db.technologies.length,
    services: db.services.length,
    skillGroups: db.skillGroups.length,
    experience: db.experience.length,
    education: db.education.length,
    achievements: db.achievements.length,
    posts: db.posts.length,
    messages: db.messages.filter((m) => m.status === "New").length,
  };
}

/* ------------------------------------------------------------------ *
 * Writes
 * ------------------------------------------------------------------ */

type WithId = { id: string };

/** Insert a record into a collection. Returns the new id. */
export async function createRecord<K extends Collection>(
  collection: K,
  data: Omit<Database[K][number], "id" | "createdAt" | "updatedAt">,
): Promise<{ ok: boolean; id: string }> {
  const id = newId();
  const ok = await mutate((db) => {
    const rows = db[collection] as unknown as WithId[];
    rows.push({ ...(data as object), id, ...stamp() } as WithId);
  });
  return { ok, id };
}

/** Merge a partial update into one record. */
export async function updateRecord<K extends Collection>(
  collection: K,
  id: string,
  data: Partial<Database[K][number]>,
): Promise<boolean> {
  return mutate((db) => {
    const rows = db[collection] as unknown as WithId[];
    const index = rows.findIndex((r) => r.id === id);
    if (index === -1) return;
    rows[index] = {
      ...rows[index],
      ...(data as object),
      id,
      updatedAt: new Date().toISOString(),
    } as WithId;
  });
}

export async function deleteRecord<K extends Collection>(
  collection: K,
  id: string,
): Promise<boolean> {
  return mutate((db) => {
    const rows = db[collection] as unknown as WithId[];
    const index = rows.findIndex((r) => r.id === id);
    if (index !== -1) rows.splice(index, 1);
  });
}

/** Move a record up or down within an ordered collection. */
export async function reorderRecord(
  collection: Extract<
    Collection,
    "services" | "skillGroups" | "experience" | "education" | "achievements"
  >,
  id: string,
  direction: "up" | "down",
): Promise<boolean> {
  return mutate((db) => {
    const rows = db[collection] as unknown as { id: string; order: number }[];
    const sorted = [...rows].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((r) => r.id === id);
    if (index === -1) return;
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= sorted.length) return;
    [sorted[index], sorted[target]] = [sorted[target], sorted[index]];
    sorted.forEach((row, i) => {
      const live = rows.find((r) => r.id === row.id);
      if (live) live.order = i;
    });
  });
}

/** Next order value for a new row in an ordered collection. */
export async function nextOrder(
  collection: Extract<
    Collection,
    "services" | "skillGroups" | "experience" | "education" | "achievements"
  >,
): Promise<number> {
  const db = await readDatabase();
  const rows = db[collection] as unknown as { order: number }[];
  return rows.reduce((max, r) => Math.max(max, r.order + 1), 0);
}

export async function updateSettings(data: Partial<SettingsRecord>): Promise<boolean> {
  return mutate((db) => {
    db.settings = {
      ...db.settings,
      ...data,
      updatedAt: new Date().toISOString(),
    };
  });
}

/* ------------------------------------------------------------------ *
 * Messages
 * ------------------------------------------------------------------ */

export async function createMessage(
  input: Pick<MessageRecord, "name" | "email" | "subject" | "message">,
): Promise<{ ok: boolean; id: string }> {
  return createRecord("messages", { ...input, status: "New" });
}

export async function setMessageStatus(
  id: string,
  status: MessageStatus,
): Promise<boolean> {
  return updateRecord("messages", id, { status });
}

/* ------------------------------------------------------------------ *
 * Slug helpers
 * ------------------------------------------------------------------ */

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** True when the slug is free, ignoring the record currently being edited. */
export async function isSlugAvailable(
  collection: "projects" | "posts",
  slug: string,
  exceptId?: string,
): Promise<boolean> {
  const db = await readDatabase();
  const rows = db[collection] as unknown as { id: string; slug: string }[];
  return !rows.some((r) => r.slug === slug && r.id !== exceptId);
}
