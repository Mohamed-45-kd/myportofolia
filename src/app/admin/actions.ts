"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { endSession, requireAdmin } from "@/lib/auth";
import {
  createRecord,
  deleteRecord,
  isSlugAvailable,
  nextOrder,
  reorderRecord,
  setMessageStatus,
  slugify,
  updateRecord,
  updateSettings,
} from "@/lib/repo";
import type { Collection, MessageStatus } from "@/lib/types";
import type { ProjectStatus } from "@/content/types";

/**
 * Admin server actions.
 *
 * Every action calls `requireAdmin()` first. Server actions are individually
 * addressable HTTP endpoints — middleware does not protect them, so the guard
 * has to live here rather than only in the layout.
 *
 * After a write, the affected public routes are revalidated so the change is
 * visible immediately without making the whole site dynamic.
 */

export interface ActionState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
}

async function guard(): Promise<ActionState | null> {
  try {
    await requireAdmin();
    return null;
  } catch {
    return { status: "error", message: "Your session has expired. Sign in again." };
  }
}

function revalidatePublic(paths: string[]) {
  for (const path of paths) revalidatePath(path);
}

/* ------------------------------------------------------------------ *
 * Session
 * ------------------------------------------------------------------ */

export async function signOut(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const bool = (fd: FormData, key: string) => fd.get(key) === "on" || fd.get(key) === "true";
/** Reads a repeated field, dropping blanks. */
const list = (fd: FormData, key: string) =>
  fd
    .getAll(key)
    .map((v) => String(v).trim())
    .filter(Boolean);

/* ------------------------------------------------------------------ *
 * Projects (§11–§15)
 * ------------------------------------------------------------------ */

export async function saveProject(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const denied = await guard();
  if (denied) return denied;

  const id = str(formData, "id");
  const title = str(formData, "title");
  const slug = slugify(str(formData, "slug") || title);

  const fieldErrors: Record<string, string> = {};
  if (title.length < 2) fieldErrors.title = "Title needs at least 2 characters.";
  if (!slug) fieldErrors.slug = "Slug cannot be empty.";
  if (slug && !/^[a-z0-9-]+$/.test(slug))
    fieldErrors.slug = "Slug can contain lowercase letters, numbers and hyphens only.";
  if (slug && !(await isSlugAvailable("projects", slug, id || undefined)))
    fieldErrors.slug = "That slug is already used by another project.";
  if (str(formData, "summary").length < 10)
    fieldErrors.summary = "Summary needs at least 10 characters.";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Fix the highlighted fields.", fieldErrors };
  }

  const resultLabels = list(formData, "resultLabel");
  const resultValues = formData.getAll("resultValue").map((v) => String(v).trim());

  const data = {
    slug,
    title,
    summary: str(formData, "summary"),
    overview: str(formData, "overview"),
    category: str(formData, "category") || "Project",
    status: (str(formData, "status") || "In Progress") as ProjectStatus,
    featured: bool(formData, "featured"),
    published: bool(formData, "published"),
    date: str(formData, "date"),
    role: str(formData, "role"),
    team: str(formData, "team") || undefined,
    technologies: list(formData, "technology"),
    keyFeatures: list(formData, "keyFeature"),
    problem: str(formData, "problem"),
    solution: str(formData, "solution"),
    challenges: list(formData, "challenge"),
    results: resultLabels
      .map((label, i) => ({ label, value: resultValues[i] ?? "" }))
      .filter((r) => r.label && r.value),
    links: {
      github: str(formData, "github") || undefined,
      demo: str(formData, "demo") || undefined,
      docs: str(formData, "docs") || undefined,
      video: str(formData, "video") || undefined,
    },
    // Zip the two parallel field lists BEFORE discarding blanks, so a missing
    // URL cannot shift every following description onto the wrong image.
    gallery: formData
      .getAll("galleryUrl")
      .map((src, i) => ({
        src: String(src).trim(),
        alt: String(formData.getAll("galleryAlt")[i] ?? "").trim(),
      }))
      .filter((entry) => entry.src !== "")
      .map((entry) => ({ src: entry.src, alt: entry.alt || title })),
  };

  const ok = id
    ? await updateRecord("projects", id, data)
    : (await createRecord("projects", data)).ok;

  if (!ok) {
    return {
      status: "error",
      message: "Could not save — the data directory is not writable on this host.",
    };
  }

  revalidatePublic(["/", "/projects", `/projects/${slug}`, "/sitemap.xml"]);
  redirect("/admin/projects?saved=1");
}

export async function deleteProject(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  await deleteRecord("projects", id);
  revalidatePublic(["/", "/projects", `/projects/${slug}`, "/sitemap.xml"]);
  redirect("/admin/projects?deleted=1");
}

/** Publish / feature switches on the list view. */
export async function toggleProjectFlag(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const field = String(formData.get("field") ?? "");
  const value = String(formData.get("value") ?? "") === "true";
  if (field !== "published" && field !== "featured") return;

  await updateRecord("projects", id, { [field]: value });
  revalidatePublic(["/", "/projects", "/sitemap.xml"]);
  revalidatePath("/admin/projects");
}

/* ------------------------------------------------------------------ *
 * Technologies (§16)
 * ------------------------------------------------------------------ */

export async function saveTechnology(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const denied = await guard();
  if (denied) return denied;

  const name = str(formData, "name");
  if (name.length < 1) {
    return {
      status: "error",
      message: "Fix the highlighted fields.",
      fieldErrors: { name: "Name cannot be empty." },
    };
  }

  const id = str(formData, "id");
  const data = {
    name,
    category: str(formData, "category") || "Other",
    icon: (str(formData, "icon") || "layers") as never,
    description: str(formData, "description"),
    websiteUrl: str(formData, "websiteUrl"),
    featured: bool(formData, "featured"),
  };

  const ok = id
    ? await updateRecord("technologies", id, data)
    : (await createRecord("technologies", data)).ok;

  if (!ok) return { status: "error", message: "Could not save. The store is read-only." };

  revalidatePath("/admin/technologies");
  return { status: "success", message: id ? "Technology updated." : "Technology added." };
}

export async function deleteTechnology(formData: FormData): Promise<void> {
  await requireAdmin();
  await deleteRecord("technologies", String(formData.get("id") ?? ""));
  revalidatePath("/admin/technologies");
}

/* ------------------------------------------------------------------ *
 * Ordered content — services, skills, experience, education, achievements
 * ------------------------------------------------------------------ */

type Ordered = Extract<
  Collection,
  "services" | "skillGroups" | "experience" | "education" | "achievements"
>;

const orderedPaths: Record<Ordered, string[]> = {
  services: ["/", "/services"],
  skillGroups: ["/", "/skills"],
  experience: ["/about", "/journey"],
  education: ["/about", "/journey"],
  achievements: ["/", "/about", "/journey"],
};

export async function saveOrdered(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const denied = await guard();
  if (denied) return denied;

  const collection = str(formData, "collection") as Ordered;
  if (!orderedPaths[collection]) {
    return { status: "error", message: "Unknown content type." };
  }

  const id = str(formData, "id");
  let data: Record<string, unknown>;

  switch (collection) {
    case "services":
      data = {
        slug: slugify(str(formData, "slug") || str(formData, "title")),
        title: str(formData, "title"),
        body: str(formData, "body"),
        icon: str(formData, "icon") || "layers",
        deliverables: list(formData, "deliverable"),
      };
      if (!data.title) return fieldError("title", "Title cannot be empty.");
      break;

    case "skillGroups": {
      const names = list(formData, "skillName");
      const levels = formData.getAll("skillLevel").map((v) => Number(v));
      data = {
        title: str(formData, "title"),
        note: str(formData, "note"),
        icon: str(formData, "icon") || "code",
        items: names.map((name, i) => ({
          name,
          level: Math.min(100, Math.max(0, Number.isFinite(levels[i]) ? levels[i] : 0)),
        })),
      };
      if (!data.title) return fieldError("title", "Title cannot be empty.");
      break;
    }

    case "experience":
      data = {
        title: str(formData, "title"),
        org: str(formData, "org"),
        period: str(formData, "period"),
        current: bool(formData, "current"),
        description: str(formData, "description"),
        tags: list(formData, "tag"),
      };
      if (!data.title) return fieldError("title", "Title cannot be empty.");
      break;

    case "education":
      data = {
        title: str(formData, "title"),
        org: str(formData, "org"),
        period: str(formData, "period"),
        icon: str(formData, "icon") || "graduation-cap",
        description: str(formData, "description"),
      };
      if (!data.title) return fieldError("title", "Title cannot be empty.");
      break;

    case "achievements":
      data = {
        title: str(formData, "title"),
        meta: str(formData, "meta"),
        icon: str(formData, "icon") || "trophy",
        description: str(formData, "description"),
      };
      if (!data.title) return fieldError("title", "Title cannot be empty.");
      break;
  }

  const ok = id
    ? await updateRecord(collection, id, data as never)
    : (await createRecord(collection, { ...data, order: await nextOrder(collection) } as never)).ok;

  if (!ok) return { status: "error", message: "Could not save. The store is read-only." };

  revalidatePublic(orderedPaths[collection]);
  revalidatePath(`/admin/${adminSegment(collection)}`);
  return { status: "success", message: id ? "Saved." : "Added." };
}

function fieldError(field: string, message: string): ActionState {
  return { status: "error", message: "Fix the highlighted fields.", fieldErrors: { [field]: message } };
}

function adminSegment(collection: Ordered): string {
  return collection === "skillGroups" ? "skills" : collection;
}

export async function deleteOrdered(formData: FormData): Promise<void> {
  await requireAdmin();
  const collection = String(formData.get("collection") ?? "") as Ordered;
  if (!orderedPaths[collection]) return;
  await deleteRecord(collection, String(formData.get("id") ?? ""));
  revalidatePublic(orderedPaths[collection]);
  revalidatePath(`/admin/${adminSegment(collection)}`);
}

export async function moveOrdered(formData: FormData): Promise<void> {
  await requireAdmin();
  const collection = String(formData.get("collection") ?? "") as Ordered;
  const direction = String(formData.get("direction") ?? "") as "up" | "down";
  if (!orderedPaths[collection] || (direction !== "up" && direction !== "down")) return;

  await reorderRecord(collection, String(formData.get("id") ?? ""), direction);
  revalidatePublic(orderedPaths[collection]);
  revalidatePath(`/admin/${adminSegment(collection)}`);
}

/* ------------------------------------------------------------------ *
 * Blog (§19)
 * ------------------------------------------------------------------ */

export async function savePost(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const denied = await guard();
  if (denied) return denied;

  const id = str(formData, "id");
  const title = str(formData, "title");
  const slug = slugify(str(formData, "slug") || title);

  const fieldErrors: Record<string, string> = {};
  if (title.length < 2) fieldErrors.title = "Title needs at least 2 characters.";
  if (!slug) fieldErrors.slug = "Slug cannot be empty.";
  if (slug && !(await isSlugAvailable("posts", slug, id || undefined)))
    fieldErrors.slug = "That slug is already used by another post.";
  const date = str(formData, "date");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    fieldErrors.date = "Date must be in YYYY-MM-DD form.";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Fix the highlighted fields.", fieldErrors };
  }

  const body = str(formData, "body")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  const data = {
    slug,
    title,
    date,
    readingTime: str(formData, "readingTime") || estimateReadingTime(body),
    tag: str(formData, "tag") || "Notes",
    excerpt: str(formData, "excerpt"),
    body,
    published: bool(formData, "published"),
  };

  const ok = id
    ? await updateRecord("posts", id, data)
    : (await createRecord("posts", data)).ok;

  if (!ok) return { status: "error", message: "Could not save. The store is read-only." };

  revalidatePublic(["/blog", `/blog/${slug}`, "/sitemap.xml"]);
  redirect("/admin/blog?saved=1");
}

function estimateReadingTime(blocks: string[]): string {
  const words = blocks.join(" ").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min`;
}

export async function deletePost(formData: FormData): Promise<void> {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  await deleteRecord("posts", String(formData.get("id") ?? ""));
  revalidatePublic(["/blog", `/blog/${slug}`, "/sitemap.xml"]);
  redirect("/admin/blog?deleted=1");
}

export async function togglePostPublished(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const value = String(formData.get("value") ?? "") === "true";
  await updateRecord("posts", id, { published: value });
  revalidatePublic(["/blog", "/sitemap.xml"]);
  revalidatePath("/admin/blog");
}

/* ------------------------------------------------------------------ *
 * Messages (§20)
 * ------------------------------------------------------------------ */

export async function markMessage(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as MessageStatus;
  if (!["New", "Read", "Replied"].includes(status)) return;
  await setMessageStatus(id, status);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(formData: FormData): Promise<void> {
  await requireAdmin();
  await deleteRecord("messages", String(formData.get("id") ?? ""));
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  redirect("/admin/messages");
}

/* ------------------------------------------------------------------ *
 * Settings
 * ------------------------------------------------------------------ */

export async function saveSettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const denied = await guard();
  if (denied) return denied;

  const mission = str(formData, "mission");
  if (!mission) {
    return fieldError("mission", "The mission line cannot be empty.");
  }

  const ok = await updateSettings({
    name: str(formData, "name"),
    role: str(formData, "role"),
    mission,
    location: str(formData, "location"),
    description: str(formData, "description"),
    email: str(formData, "email"),
    whatsapp: str(formData, "whatsapp"),
    github: str(formData, "github"),
    linkedin: str(formData, "linkedin"),
    cvEnabled: bool(formData, "cvEnabled"),
    cvHref: str(formData, "cvHref") || "/mohamed-weli-jama-cv.pdf",
  });

  if (!ok) return { status: "error", message: "Could not save. The store is read-only." };

  revalidatePublic(["/", "/about", "/contact", "/projects", "/services", "/skills", "/journey", "/blog"]);
  return { status: "success", message: "Settings saved." };
}
