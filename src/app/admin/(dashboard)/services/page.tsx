import { getServices } from "@/lib/repo";
import { PageHead } from "../../ui";
import { OrderedManager, type FieldSpec, type Row } from "../OrderedManager";

export const metadata = { title: "Services" };

const ICONS = ["globe", "code", "layout-dashboard", "workflow", "database", "sparkles", "briefcase", "server"] as const;

const fields: FieldSpec[] = [
  { kind: "text", name: "title", label: "Service name", placeholder: "Web development", required: true },
  { kind: "text", name: "slug", label: "Slug", placeholder: "web-development", hint: "Leave blank to generate from the name." },
  { kind: "select", name: "icon", label: "Icon", options: ICONS },
  { kind: "textarea", name: "body", label: "Description", placeholder: "One or two sentences in your own voice." },
  { kind: "list", name: "deliverable", label: "What you get", placeholder: "Deployment and a handover document" },
];

export default async function AdminServicesPage() {
  const services = await getServices();

  const rows: Row[] = services.map((s) => ({
    id: s.id,
    title: s.title,
    meta: s.body,
    values: {
      title: s.title,
      slug: s.slug,
      icon: s.icon,
      body: s.body,
      deliverable: s.deliverables,
    },
  }));

  return (
    <>
      <PageHead title="Services" description="The services listed on the public site, in display order." />
      <OrderedManager collection="services" singular="service" fields={fields} rows={rows} />
    </>
  );
}
