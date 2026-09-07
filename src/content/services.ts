/**
 * Services — the six offerings listed in §17 of the documentation.
 * Body copy is written in the brand voice; the service names are as specified.
 */

import type { Service } from "./types";

export const services: Service[] = [
  {
    slug: "web-development",
    icon: "globe",
    title: "Web development",
    body: "Websites and web applications built to be fast on the connections my users actually have, and maintainable by whoever takes over after me.",
    deliverables: [
      "Responsive site or application",
      "Content that can be edited without a developer",
      "Deployment and a handover document",
    ],
  },
  {
    slug: "software-development",
    icon: "code",
    title: "Software development",
    body: "End-to-end builds: the data model, the logic, the interface, the deployment. I would rather build the smaller thing that ships than the larger one that does not.",
    deliverables: [
      "Data model and architecture",
      "Working application, tested",
      "Source code and documentation",
    ],
  },
  {
    slug: "custom-management-systems",
    icon: "layout-dashboard",
    title: "Custom management systems",
    body: "School, business and organisation systems for the parts of the job that are currently held in registers and spreadsheets — records, tracking, roles and reporting.",
    deliverables: [
      "Role-based access for each kind of user",
      "Records, tracking and reporting modules",
      "Admin dashboard for day-to-day operation",
    ],
  },
  {
    slug: "automation",
    icon: "workflow",
    title: "Automation",
    body: "The repeated task that eats an afternoon every week — mapped first, then automated. It usually turns out the process needs fixing more than it needs code.",
    deliverables: [
      "Process mapped as it is actually performed",
      "Automated workflow with a manual override",
      "A record of what ran and when",
    ],
  },
  {
    slug: "database-systems",
    icon: "database",
    title: "Database systems",
    body: "Designing the schema, moving what exists into it, and making sure the queries the business asks every day are the fast ones.",
    deliverables: [
      "Normalised schema with constraints",
      "Migration from spreadsheets or paper records",
      "Backups and a restore procedure",
    ],
  },
  {
    slug: "digital-transformation",
    icon: "sparkles",
    title: "Digital transformation",
    body: "Paper intake, exercise-book records, WhatsApp order books — mapped, then replaced with something auditable. This is the mission, sold by the project.",
    deliverables: [
      "Review of the current process",
      "A staged plan, not a big-bang replacement",
      "Training for the people who will use it",
    ],
  },
];
