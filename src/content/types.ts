/**
 * Content types.
 *
 * These mirror the database tables described in §25 of
 * "Mohamed Weli Jama — Personal Developer Platform Documentation v1.0",
 * so that swapping the static content layer for Supabase/Prisma later is a
 * change of data source only, not a change of component contracts.
 */

export type ProjectStatus =
  | "Idea"
  | "Planning"
  | "In Progress"
  | "Near Completion"
  | "Completed"
  | "Maintained"
  | "Archived";

/** projects + project_images + project_technologies */
export interface Project {
  slug: string;
  title: string;
  /** Card / meta-description length. One sentence. */
  summary: string;
  /** Case-study opening. A short paragraph. */
  overview: string;
  category: string;
  status: ProjectStatus;
  featured: boolean;
  published: boolean;
  /** Display date, e.g. "2026" or "2025 — 2026". */
  date: string;
  role: string;
  team?: string;
  technologies: string[];
  keyFeatures: string[];
  problem: string;
  solution: string;
  challenges: string[];
  results: { label: string; value: string }[];
  links?: {
    github?: string;
    demo?: string;
    docs?: string;
    video?: string;
  };
  /** Gallery slots. Empty array renders the deliberate grid placeholder. */
  gallery?: { src: string; alt: string }[];
}

/** technologies */
export interface SkillGroup {
  title: string;
  icon: IconName;
  note: string;
  items: { name: string; level: number }[];
}

/** services */
export interface Service {
  slug: string;
  icon: IconName;
  title: string;
  body: string;
  deliverables: string[];
}

/** experience */
export interface ExperienceEntry {
  title: string;
  org: string;
  period: string;
  current?: boolean;
  description: string;
  tags?: string[];
}

/** education */
export interface EducationEntry {
  title: string;
  org: string;
  period: string;
  icon: IconName;
  description: string;
}

/** achievements */
export interface Achievement {
  icon: IconName;
  title: string;
  meta: string;
  description: string;
}

/** blog_posts */
export interface Post {
  slug: string;
  title: string;
  date: string;
  readingTime: string;
  tag: string;
  excerpt: string;
  /** Plain paragraphs; headings start with "## ". */
  body: string[];
  published: boolean;
}

/**
 * Icon names used across the site. The design system specifies Lucide at
 * 1.75px stroke — these are drawn inline in `components/ui/Icon.tsx` at that
 * weight so the site ships no icon runtime and no CDN dependency.
 */
export type IconName =
  | "code"
  | "terminal"
  | "server"
  | "database"
  | "layers"
  | "folder-git"
  | "layout-dashboard"
  | "file-text"
  | "graduation-cap"
  | "briefcase"
  | "milestone"
  | "trophy"
  | "award"
  | "mail"
  | "send"
  | "github"
  | "linkedin"
  | "message-circle"
  | "arrow-up-right"
  | "arrow-right"
  | "external-link"
  | "search"
  | "settings"
  | "lock"
  | "sun"
  | "moon"
  | "menu"
  | "close"
  | "check"
  | "chevron-right"
  | "chevron-down"
  | "chevron-up"
  | "cpu"
  | "bell"
  | "workflow"
  | "globe"
  | "palette"
  | "users"
  | "sparkles"
  | "book-open"
  | "download"
  | "clock"
  | "map-pin";
