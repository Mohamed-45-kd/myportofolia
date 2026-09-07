/**
 * Projects — mirrors the `projects` table (§11–§15).
 *
 * The five projects below are the real ones named in the documentation.
 * Everything stated there (name, purpose, status, the ICT Club origin of the
 * robotics and bell projects) is reproduced faithfully.
 *
 * ⚠️ CONFIRM BEFORE PUBLISHING — the documentation did not specify these, so
 * they are written to be edited rather than to be believed:
 *   • technology stacks per project   • dates   • repository / demo links
 *   • the exact wording of challenges and results
 * Results are deliberately kept to facts (status, scope, language count)
 * rather than invented percentages.
 */

import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "kaabe-school-management-system",
    title: "Kaabe School Management System",
    summary:
      "A school management platform covering students, staff, classes, attendance, fees and reporting in one place.",
    overview:
      "Kaabe is the largest thing I have built. Schools here run on paper registers, exercise books for fees and a separate spreadsheet for every report the principal needs. Kaabe replaces that with one system where a record is entered once and everything else reads from it.",
    category: "Management System",
    status: "Near Completion",
    featured: true,
    published: true,
    date: "2025 — 2026", // TODO: confirm
    role: "Solo developer — data model, backend, interface and deployment",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS", "Supabase"], // TODO: confirm
    keyFeatures: [
      "Student records, enrolment and class assignment",
      "Staff records and teaching assignments",
      "Daily attendance for students and staff",
      "Fee tracking with payment history per student",
      "Exams, marks entry and printable result sheets",
      "Role-based access for administrators, teachers and principals",
      "Dashboard reporting the numbers a principal is asked for",
    ],
    problem:
      "Everything a school needs to know about itself is spread across paper registers, receipt books and disconnected spreadsheets. Answering a simple question — who has not paid, who was absent this week, how many students are in Grade 7 — means someone counting by hand, and the answer is out of date by the time it is written down.",
    solution:
      "One database behind one interface. Each record is entered once, by the person closest to it: the teacher marks attendance, the accountant records the payment, the principal reads the report. Permissions decide who sees what, so the same system serves four different jobs without four different tools.",
    challenges: [
      "Modelling a school properly — terms, classes, sections, subjects and re-enrolment — so the second academic year does not need a rebuild.",
      "Keeping the interface usable for staff who have never used management software, on the low-end laptops and phones actually in the building.",
      "Getting fees right. Money is the part nobody forgives a bug in, so payments are append-only and every change leaves a trace.",
    ],
    results: [
      { label: "Status", value: "Near completion" },
      { label: "User roles", value: "4" },
      { label: "Core modules", value: "7" },
    ],
    links: {}, // TODO: add GitHub / live demo when available
    gallery: [],
  },
  {
    slug: "warsan-web",
    title: "Warsan Web",
    summary:
      "An online book ordering system with full support for three languages, built so readers can order in the language they actually read in.",
    overview:
      "Warsan Web is a book shop that works online. Its distinguishing requirement was language: the catalogue, the checkout and the order emails all had to exist in three languages, not just the marketing page.",
    category: "E-commerce",
    status: "Completed",
    featured: true,
    published: true,
    date: "2025", // TODO: confirm
    role: "Solo developer",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"], // TODO: confirm
    keyFeatures: [
      "Full catalogue with search and category browsing",
      "Three-language interface across every screen, not only the homepage",
      "Cart and checkout with delivery details",
      "Order management for the shop owner",
      "Stock levels kept per title",
    ],
    problem:
      "Ordering a book meant a phone call or a WhatsApp message, and the shop tracked orders in a notebook. Customers could not see what was in stock, and the owner could not see what had been promised to whom.",
    solution:
      "A catalogue readers can browse and order from directly, with the shop owner getting a proper order list instead of a chat thread. Every user-facing string is translated rather than hardcoded, so adding a fourth language is a data change, not a rewrite.",
    challenges: [
      "Building for three languages from the first commit — no string is written into a component, and layouts have to survive text that changes length.",
      "Keeping stock honest when two customers order the last copy at the same time.",
    ],
    results: [
      { label: "Languages", value: "3" },
      { label: "Ordering channel", value: "Self-service" },
      { label: "Status", value: "Completed" },
    ],
    links: {},
    gallery: [],
  },
  {
    slug: "macallin-diyaarshe",
    title: "Macallin Diyaarshe",
    summary:
      "A platform that connects teachers with teaching opportunities and lets schools and principals request a teacher directly.",
    overview:
      "Hiring a teacher is a word-of-mouth process: a principal asks around, someone knows someone. Macallin Diyaarshe puts both sides in one place — teachers list what they can teach and where, schools post what they need, and a request goes to a named person instead of into a rumour.",
    category: "Platform",
    status: "In Progress",
    featured: true,
    published: true,
    date: "2026 — present", // TODO: confirm
    role: "Solo developer",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS"], // TODO: confirm
    keyFeatures: [
      "Teacher profiles — subjects, grade levels, location and availability",
      "School and principal accounts that can request a teacher",
      "Opportunity listings with subject and location filters",
      "Request tracking so both sides can see where an application stands",
    ],
    problem:
      "Schools struggle to find qualified teachers for specific subjects, and teachers looking for work depend on who they happen to know. Neither side has a list of the other.",
    solution:
      "A two-sided directory with a request flow on top. A principal filters for the subject and area they need and sends a request; the teacher receives it and answers. The status is visible to both, so nobody is left guessing.",
    challenges: [
      "Trust. A directory is only useful if the profiles in it are real, so verification is part of the product rather than an afterthought.",
      "Designing one system for two very different users without turning it into two products.",
    ],
    results: [
      { label: "Status", value: "In progress" },
      { label: "Sides served", value: "2" },
      { label: "Stage", value: "Core flows" },
    ],
    links: {},
    gallery: [],
  },
  {
    slug: "smart-school-bell",
    title: "Smart School Bell",
    summary:
      "An automated school bell that rings the period schedule on its own — built as an ICT Club innovation project.",
    overview:
      "The school bell was rung by hand, which meant it was rung late whenever the person holding the schedule was busy. We automated it: the timetable is programmed once and the bell follows it, including the different Friday schedule.",
    category: "Hardware / Innovation",
    status: "Completed",
    featured: false,
    published: true,
    date: "Pharo Sheikh Secondary School · ICT Club", // TODO: confirm year
    role: "ICT Club project member",
    team: "ICT Club, Pharo Sheikh Secondary School",
    technologies: ["Microcontroller", "Real-time clock", "Relay switching", "C"], // TODO: confirm
    keyFeatures: [
      "Period schedule programmed once and followed automatically",
      "Separate schedules for different days",
      "Manual override for assemblies and exam days",
    ],
    problem:
      "A hand-rung bell drifts. Lessons started and ended at slightly different times every day, and the drift compounded across the timetable.",
    solution:
      "A microcontroller holding the timetable against a real-time clock, driving the existing bell through a relay. The schedule is data, so changing a period does not mean changing the wiring.",
    challenges: [
      "Keeping time accurately through power cuts.",
      "Working inside an existing bell installation rather than replacing it.",
    ],
    results: [
      { label: "Ringing", value: "Automatic" },
      { label: "Origin", value: "ICT Club" },
      { label: "Recognition", value: "Innovation" },
    ],
    links: {},
    gallery: [],
  },
  {
    slug: "robotics-project",
    title: "Robotics & Gesture Control",
    summary:
      "A small robotics build plus hand- and eye-gesture control experiments — where the technology journey started.",
    overview:
      "Before any of the web work, there was the ICT Club. We built a small robot and, separately, experimented with controlling things by hand and eye gesture. It is the least commercial thing on this site and the reason for everything after it.",
    category: "Robotics / Innovation",
    status: "Completed",
    featured: false,
    published: true,
    date: "Pharo Sheikh Secondary School · ICT Club", // TODO: confirm year
    role: "ICT Club project member",
    team: "ICT Club, Pharo Sheikh Secondary School",
    technologies: ["Microcontroller", "Sensors", "Computer vision", "Python"], // TODO: confirm
    keyFeatures: [
      "A small mobile robot built and programmed by the club",
      "Hand-gesture input mapped to control commands",
      "Eye-gesture experiments as an accessibility idea",
    ],
    problem:
      "None of us had built anything physical before. The point was to find out whether we could — and whether an input other than a keyboard could drive a machine.",
    solution:
      "We built the robot first and used it as the test bed for gesture input, reading gestures and translating them into the same commands a controller would send.",
    challenges: [
      "Working with the components that were available rather than the ones the tutorial assumed.",
      "Making gesture recognition reliable enough to be usable, in a room where the light changes.",
    ],
    results: [
      { label: "Team", value: "ICT Club" },
      { label: "Recognition", value: "Innovation" },
      { label: "Outcome", value: "Working build" },
    ],
    links: {},
    gallery: [],
  },
];

export const publishedProjects = projects.filter((p) => p.published);

export const featuredProjects = publishedProjects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return publishedProjects.find((p) => p.slug === slug);
}

/** Distinct statuses present in the published set, for the gallery filter. */
export function projectStatuses(): string[] {
  return Array.from(new Set(publishedProjects.map((p) => p.status)));
}
