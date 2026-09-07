import { getAchievements } from "@/lib/repo";
import { PageHead } from "../../ui";
import { OrderedManager, type FieldSpec, type Row } from "../OrderedManager";

export const metadata = { title: "Achievements" };

const ICONS = ["trophy", "award", "cpu", "bell", "layout-dashboard", "users", "sparkles", "milestone"] as const;

const fields: FieldSpec[] = [
  { kind: "text", name: "title", label: "Achievement", placeholder: "Innovation recognition", required: true },
  { kind: "text", name: "meta", label: "Context", placeholder: "ICT Club · Pharo Sheikh Secondary School" },
  { kind: "select", name: "icon", label: "Icon", options: ICONS },
  { kind: "textarea", name: "description", label: "Description", placeholder: "One or two sentences." },
];

export default async function AdminAchievementsPage() {
  const achievements = await getAchievements();

  const rows: Row[] = achievements.map((a) => ({
    id: a.id,
    title: a.title,
    meta: a.meta,
    values: {
      title: a.title,
      meta: a.meta,
      icon: a.icon,
      description: a.description,
    },
  }));

  return (
    <>
      <PageHead title="Achievements" description="Shown on the homepage, About and Journey pages." />
      <OrderedManager collection="achievements" singular="achievement" fields={fields} rows={rows} />
    </>
  );
}
