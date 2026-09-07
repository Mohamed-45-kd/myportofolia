import { getExperience } from "@/lib/repo";
import { PageHead } from "../../ui";
import { OrderedManager, type FieldSpec, type Row } from "../OrderedManager";

export const metadata = { title: "Experience" };

const fields: FieldSpec[] = [
  { kind: "text", name: "title", label: "Role", placeholder: "Software & Web Developer", required: true },
  { kind: "text", name: "org", label: "Organisation", placeholder: "Independent" },
  { kind: "text", name: "period", label: "Period", placeholder: "2025 — Present" },
  { kind: "switch", name: "current", label: "Current role" },
  { kind: "textarea", name: "description", label: "Description", placeholder: "What you did there." },
  { kind: "list", name: "tag", label: "Tags", placeholder: "Next.js" },
];

export default async function AdminExperiencePage() {
  const experience = await getExperience();

  const rows: Row[] = experience.map((e) => ({
    id: e.id,
    title: e.title,
    meta: `${e.org} · ${e.period}`,
    values: {
      title: e.title,
      org: e.org,
      period: e.period,
      current: Boolean(e.current),
      description: e.description,
      tag: e.tags ?? [],
    },
  }));

  return (
    <>
      <PageHead title="Experience" description="The work timeline on the Journey and About pages." />
      <OrderedManager collection="experience" singular="role" fields={fields} rows={rows} />
    </>
  );
}
