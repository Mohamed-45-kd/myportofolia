import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/repo";
import { ContactCTA, PageHeader } from "@/components/sections/shared";
import { ProjectGallery } from "./ProjectGallery";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected work by Mohamed Weli Jama — the Kaabe School Management System, Warsan Web, Macallin Diyaarshe, the Smart School Bell and the ICT Club robotics project.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const publishedProjects = await getPublishedProjects();

  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Selected work."
        lead="Every one of these started as a process someone was doing by hand. Open a case study for the problem, the approach, and what it does now."
      />

      <section className="section-tight">
        <div className="shell">
          <ProjectGallery projects={publishedProjects} />
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
