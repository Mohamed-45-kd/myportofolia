import { getEducation } from "@/lib/repo";
import { PageHead } from "../../ui";
import { OrderedManager, type FieldSpec, type Row } from "../OrderedManager";

export const metadata = { title: "Education" };

const ICONS = ["graduation-cap", "book-open", "award", "milestone"] as const;

const fields: FieldSpec[] = [
  { kind: "text", name: "title", label: "Qualification", placeholder: "Secondary education", required: true },
  { kind: "text", name: "org", label: "Institution", placeholder: "Pharo Sheikh Secondary School" },
  { kind: "text", name: "period", label: "Period", placeholder: "Completed" },
  { kind: "select", name: "icon", label: "Icon", options: ICONS },
  { kind: "textarea", name: "description", label: "Description", placeholder: "What it covered, and what came out of it." },
];

export default async function AdminEducationPage() {
  const education = await getEducation();

  const rows: Row[] = education.map((e) => ({
    id: e.id,
    title: e.title,
    meta: `${e.org} · ${e.period}`,
    values: {
      title: e.title,
      org: e.org,
      period: e.period,
      icon: e.icon,
      description: e.description,
    },
  }));

  return (
    <>
      <PageHead title="Education" description="Shown on the Journey page and summarised on About." />
      <OrderedManager collection="education" singular="entry" fields={fields} rows={rows} />
    </>
  );
}
