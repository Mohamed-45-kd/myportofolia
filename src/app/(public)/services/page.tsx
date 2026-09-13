import type { Metadata } from "next";
import { getServices } from "@/lib/repo";
import { Card, Icon, IconBubble } from "@/components/ui";
import { PageHeader } from "@/components/sections/shared";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { Reveal } from "@/components/layout/Reveal";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web development, software development, custom management systems, automation, database systems and digital transformation — how Mohamed Weli Jama works with schools, businesses and organisations.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="How I can help."
        lead="Six ways I work with schools, businesses, NGOs and organisations. Most projects are a combination of two or three of them."
      />

      <section className="section-tight">
        <div className="shell">
          <div className="grid-cards">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 60}>
                <Card id={service.slug}>
                  <IconBubble name={service.icon} />
                  <h2 style={{ fontSize: "var(--text-lg)", marginTop: "var(--space-5)" }}>
                    {service.title}
                  </h2>
                  <p
                    style={{
                      marginTop: "var(--space-3)",
                      fontSize: "var(--text-sm)",
                      color: "var(--text-muted)",
                      lineHeight: "var(--leading-relaxed)",
                    }}
                  >
                    {service.body}
                  </p>

                  <p
                    className="eyebrow"
                    style={{ marginTop: "var(--space-6)", marginBottom: "var(--space-3)" }}
                  >
                    What you get
                  </p>
                  <ul className="case-list">
                    {service.deliverables.map((d) => (
                      <li key={d} style={{ fontSize: "var(--text-sm)" }}>
                        <Icon name="check" size={16} />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="shell">
          <Card>
            <p className="eyebrow">How a project runs</p>
            <div
              style={{
                display: "grid",
                gap: "var(--space-6)",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                marginTop: "var(--space-6)",
              }}
            >
              {[
                {
                  step: "01",
                  title: "Map it",
                  body: "I watch the process as it is actually done, not as it is described.",
                },
                {
                  step: "02",
                  title: "Model it",
                  body: "The data model comes before any screen. It is the expensive thing to change.",
                },
                {
                  step: "03",
                  title: "Build it",
                  body: "In stages, starting with the step that hurts most, so it can be used early.",
                },
                {
                  step: "04",
                  title: "Hand it over",
                  body: "Training, documentation and a system your own team can run without me.",
                },
              ].map((s) => (
                <div key={s.step}>
                  <p className="eyebrow" style={{ color: "var(--text-accent)" }}>
                    {s.step}
                  </p>
                  <h3 style={{ fontSize: "var(--text-base)", marginTop: "var(--space-3)" }}>
                    {s.title}
                  </h3>
                  <p
                    style={{
                      marginTop: "var(--space-2)",
                      fontSize: "var(--text-sm)",
                      color: "var(--text-muted)",
                      lineHeight: "var(--leading-normal)",
                    }}
                  >
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
