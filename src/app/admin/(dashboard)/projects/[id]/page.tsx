import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectById, getTechnologies } from "@/lib/repo";
import { Icon } from "@/components/ui";
import { PageHead } from "../../../ui";
import { ProjectForm } from "../ProjectForm";

export const metadata = { title: "Edit project" };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, technologies] = await Promise.all([
    getProjectById(id),
    getTechnologies(),
  ]);

  if (!project) notFound();

  return (
    <>
      <PageHead
        title={project.title}
        description={`/projects/${project.slug}`}
        action={
          <Link
            href={`/projects/${project.slug}`}
            className="btn btn-secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="external-link" size={16} />
            View on site
          </Link>
        }
      />
      <ProjectForm project={project} technologyNames={technologies.map((t) => t.name)} />
    </>
  );
}
