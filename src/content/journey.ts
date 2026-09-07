/**
 * Experience, education and achievements — §18 of the documentation.
 *
 * The documentation supplies the education (Pharo Sheikh Secondary School), the
 * ICT Club membership, the innovation recognition, and the robotics and Smart
 * School Bell projects. Those are reproduced faithfully.
 *
 * ⚠️ CONFIRM BEFORE PUBLISHING: no employment history was given, so the
 * experience entries below describe the work the documentation does evidence —
 * independent project development and the ICT Club. Add real roles, employers
 * and dates as they apply.
 */

import type { Achievement, EducationEntry, ExperienceEntry } from "./types";

export const experience: ExperienceEntry[] = [
  {
    title: "Software & Web Developer",
    org: "Independent",
    period: "2025 — Present", // TODO: confirm
    current: true,
    description:
      "Building management platforms end to end — data model, backend, interface and deployment. Current work is the Kaabe School Management System, Warsan Web and Macallin Diyaarshe.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Supabase", "Tailwind CSS"],
  },
  {
    title: "Web Developer",
    org: "Project work",
    period: "2024 — 2025", // TODO: confirm
    description:
      "Front-end and full-stack builds: turning designs into interfaces that hold up on slow connections and low-end devices, and connecting them to real data.",
    tags: ["React", "JavaScript", "SQL"],
  },
  {
    title: "Member, ICT Club",
    org: "Pharo Sheikh Secondary School",
    period: "Secondary school",
    description:
      "Contributed to the club's technology projects: a small robotics build, hand- and eye-gesture control experiments, and the Smart School Bell. The team was recognised for innovation.",
    tags: ["Robotics", "Microcontrollers", "Computer vision"],
  },
];

export const education: EducationEntry[] = [
  {
    title: "Secondary education",
    org: "Pharo Sheikh Secondary School",
    period: "Completed", // TODO: add years
    icon: "graduation-cap",
    description:
      "Where the technology work started. I was a member of the ICT Club and worked on the robotics, gesture-control and Smart School Bell projects with the team.",
  },
  {
    title: "Self-directed software engineering",
    org: "Continuous",
    period: "Ongoing",
    icon: "book-open",
    description:
      "Everything in the stack I use professionally — JavaScript and TypeScript, React and Next.js, PostgreSQL and Prisma — learned by building the projects on this site rather than by course alone.",
  },
];

export const achievements: Achievement[] = [
  {
    icon: "trophy",
    title: "Innovation recognition",
    meta: "ICT Club · Pharo Sheikh Secondary School",
    description:
      "Our team was recognised for innovation for the technology projects we built at the club.",
  },
  {
    icon: "cpu",
    title: "Robotics & gesture control",
    meta: "ICT Club project",
    description:
      "Built a small robot and experimented with hand- and eye-gesture input as a way of controlling it.",
  },
  {
    icon: "bell",
    title: "Smart School Bell",
    meta: "ICT Club innovation project",
    description:
      "Automated the school's period bell so it follows the timetable instead of being rung by hand.",
  },
  {
    icon: "layout-dashboard",
    title: "Kaabe School Management System",
    meta: "Near completion",
    description:
      "A full school management platform — records, attendance, fees, exams and reporting — built solo.",
  },
];
