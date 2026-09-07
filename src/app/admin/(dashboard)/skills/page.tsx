import { getSkillGroups } from "@/lib/repo";
import { PageHead } from "../../ui";
import { OrderedManager, type FieldSpec, type Row } from "../OrderedManager";

export const metadata = { title: "Skills" };

const ICONS = ["code", "terminal", "database", "folder-git", "palette", "layers", "server", "cpu"] as const;

const fields: FieldSpec[] = [
  { kind: "text", name: "title", label: "Group name", placeholder: "Web Development", required: true },
  { kind: "select", name: "icon", label: "Icon", options: ICONS },
  { kind: "text", name: "note", label: "Note", placeholder: "Where most of my shipped work lives." },
  {
    kind: "pairs",
    label: "Skills",
    keyName: "skillName",
    valueName: "skillLevel",
    keyPlaceholder: "Next.js",
    valuePlaceholder: "86",
    valueType: "number",
    hint: "Percentages reflect how much of the shipped work leans on each — not a self-assessment.",
  },
];

export default async function AdminSkillsPage() {
  const groups = await getSkillGroups();

  const rows: Row[] = groups.map((g) => ({
    id: g.id,
    title: g.title,
    meta: `${g.items.length} skill${g.items.length === 1 ? "" : "s"} — ${g.items.map((i) => i.name).join(", ")}`,
    values: {
      title: g.title,
      icon: g.icon,
      note: g.note,
      skillName: g.items.map((i) => [i.name, String(i.level)] as [string, string]),
    },
  }));

  return (
    <>
      <PageHead title="Skills" description="Skill groups and their levels, as shown on the Skills page." />
      <OrderedManager collection="skillGroups" singular="skill group" fields={fields} rows={rows} />
    </>
  );
}
