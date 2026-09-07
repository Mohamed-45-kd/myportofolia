import type { Metadata } from "next";
import { getSkillGroups } from "@/lib/repo";
import { Card, IconBubble } from "@/components/ui";
import { ContactCTA, PageHeader, SkillMeter } from "@/components/sections/shared";
import { Reveal } from "@/components/layout/Reveal";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "The languages, frameworks, databases and tools Mohamed Weli Jama builds with — programming, web development, backend and database, development tools, design and media.",
  alternates: { canonical: "/skills" },
};

export default async function SkillsPage() {
  const skillGroups = await getSkillGroups();

  return (
    <>
      <PageHeader
        eyebrow="Skills"
        title="What I build with, and how much."
        lead="Percentages reflect how much of my shipped work leans on each tool — not a self-assessment."
      />

      <section className="section-tight">
        <div className="shell">
          <div className="grid-2">
            {skillGroups.map((group, i) => (
              <Reveal key={group.title} delay={i * 60}>
                <Card>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-4)",
                    }}
                  >
                    <IconBubble name={group.icon} />
                    <div>
                      <h2 style={{ fontSize: "var(--text-lg)" }}>{group.title}</h2>
                      <p
                        style={{
                          fontSize: "var(--text-sm)",
                          color: "var(--text-muted)",
                          marginTop: "var(--space-1)",
                        }}
                      >
                        {group.note}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--space-5)",
                      marginTop: "var(--space-7)",
                    }}
                  >
                    {group.items.map((item) => (
                      <SkillMeter key={item.name} name={item.name} level={item.level} />
                    ))}
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="shell">
          <Card>
            <p className="eyebrow">How I choose</p>
            <p className="prose-body" style={{ marginTop: "var(--space-5)" }}>
              I pick the stack the project can be maintained in, not the one that is
              interesting this year. That usually means Next.js and PostgreSQL,
              because the tooling is stable, the hosting is cheap, and the next
              developer will recognise it. When something simpler would do, I use
              something simpler.
            </p>
          </Card>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
