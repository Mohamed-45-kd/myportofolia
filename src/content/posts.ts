/**
 * Blog — §19. The documentation describes this as a future-ready module, so the
 * module is built and wired; these three posts are starter drafts written in the
 * brand voice about the real work.
 *
 * ⚠️ Edit or replace before publishing. Set `published: false` to hide a post —
 * the index and the sitemap both respect it.
 */

import type { Post } from "./types";

export const posts: Post[] = [
  {
    slug: "building-for-the-connection-you-actually-have",
    title: "Building for the connection you actually have",
    date: "2026-08-12",
    readingTime: "6 min",
    tag: "Performance",
    excerpt:
      "A page that is fast on my laptop tells me nothing. The question is what it does on a shared mobile connection, on a phone that is three years old.",
    published: true,
    body: [
      "There is a version of web development where performance is a score in a tool. You run the audit, you get a number, the number is green, you move on. That version does not survive contact with the machines my software actually runs on.",
      "## The test that matters",
      "Every project I ship gets opened on a mid-range Android phone, on mobile data, in a building with ordinary walls. Not a simulation — the actual phone. Most of what I have learned about performance came from watching a page I was proud of take eleven seconds to become useful.",
      "The fixes are rarely clever. Ship less JavaScript. Do not load a font file to draw a heading nobody scrolls to. Render on the server so the first paint contains something to read. Size images to the box they land in. None of this is new advice; the difference is treating it as a requirement rather than a refinement.",
      "## Budgets, not intentions",
      "A budget is a number you are not allowed to exceed. Intentions are what you have instead of a budget. I hold a page to a small amount of blocking JavaScript and a first view that is readable before anything else arrives, and when a feature would break that, the feature changes — not the budget.",
      "The reward is not a score. It is that someone in a school office with two bars of signal can open the attendance page and it just appears.",
    ],
  },
  {
    slug: "map-the-process-before-you-write-the-code",
    title: "Map the process before you write the code",
    date: "2026-07-28",
    readingTime: "8 min",
    tag: "Digital transformation",
    excerpt:
      "Every paper process I have replaced turned out to be two processes: the one described to me, and the one people actually follow.",
    published: true,
    body: [
      "When someone asks me to digitalize a process, the first thing I ask for is not a specification. It is a morning of watching the process happen.",
      "## The written process and the real one",
      "The written process is what a manager describes: forms are submitted here, approved there, filed at the end. The real process contains the exception that happens twice a week, the register that lives in someone's drawer, and the step everybody skips because it was designed for a situation that no longer exists.",
      "If you build the written process, you ship something that is technically correct and unusable. People go back to paper, and the failure gets blamed on the software.",
      "## What I do instead",
      "I follow one real case from beginning to end and write down every hand it passes through. Then I ask the person doing each step what goes wrong. That conversation produces more requirements than any document, because it surfaces the exceptions — and the exceptions are the system.",
      "Only then does the data model get drawn. It is easier to change a diagram than a table with a year of records in it.",
      "## Replace in stages",
      "Nobody should have to switch everything on a Monday. Start with the one step that hurts most, run it alongside the paper for a while, and let the parallel run prove the system. Trust is earned per module, not granted at launch.",
    ],
  },
  {
    slug: "what-i-learned-building-a-school-system-alone",
    title: "What I learned building a school system alone",
    date: "2026-07-03",
    readingTime: "9 min",
    tag: "Case study",
    excerpt:
      "Kaabe took longer than I estimated, for reasons that had almost nothing to do with writing code.",
    published: true,
    body: [
      "I estimated the Kaabe School Management System the way most developers estimate: by listing the screens. Screens are the easy part.",
      "## The schema is the project",
      "A school looks simple until you model it. A student belongs to a class, but classes reset every year, and the student re-enrols, and last year's marks must still be readable. A teacher teaches subjects, but only to certain grades, and sometimes covers for someone else. Get these relationships wrong and the second academic year forces a rewrite.",
      "I redrew the data model three times before I wrote a single interface. That felt like it was not progress. It was the only real progress in that period.",
      "## Money is not a feature",
      "The fee module took longer than the rest of the system combined, because fees are where a bug becomes an accusation. Payments are append-only. A correction is a new record that references the old one. Nothing is ever silently overwritten, and every figure on a report can be traced to the entries that produced it.",
      "## Build for the person, not the role",
      "\"Administrator\" is not a person. The administrator here is one man who also teaches, uses a phone more than a laptop, and has ten minutes between periods. Designing for that person produced a different system than designing for the role — larger touch targets, fewer steps, and reports that answer the question directly instead of offering a filter builder.",
      "It is near completion now. The part I would repeat is the slow start on the data model. The part I would change is telling myself the interface would be quick.",
    ],
  },
];

export const publishedPosts = posts
  .filter((p) => p.published)
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getPost(slug: string): Post | undefined {
  return publishedPosts.find((p) => p.slug === slug);
}

/** Absolute dates per the brand rule: "12 Aug 2026". */
export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
