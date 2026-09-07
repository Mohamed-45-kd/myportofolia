import { getTechnologies } from "@/lib/repo";
import { PageHead } from "../../../ui";
import { ProjectForm } from "../ProjectForm";

export const metadata = { title: "New project" };

export default async function NewProjectPage() {
  const technologies = await getTechnologies();

  return (
    <>
      <PageHead
        title="New project"
        description="Nothing is visible on the public site until you switch Published on."
      />
      <ProjectForm technologyNames={technologies.map((t) => t.name)} />
    </>
  );
}
