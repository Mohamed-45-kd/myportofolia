import type { Metadata } from "next";
import { getSkillGroups } from "@/lib/repo";
import { PageHeader, SkillMeter } from "@/components/sections/shared";
import { ContactCTA } from "@/components/sections/ContactCTA";
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

      <section className="panel panel-light panel-2">
        <div className="shell">
          <h2 className="panel-heading">Stack</h2>

          <div className="big-list">
            {skillGroups.map((group, i) => (
              <Reveal key={group.title} delay={i * 70}>
                <div className="big-row">
                  <span className="big-number">{String(i + 1).padStart(2, "0")}</span>
                  <span className="big-body">
                    <span className="big-name">{group.title}</span>
                    <span className="big-desc">{group.note}</span>
                    <span className="skill-meters">
                      {group.items.map((item) => (
                        <SkillMeter key={item.name} name={item.name} level={item.level} />
                      ))}
                    </span>
                  </span>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="panel-lead" style={{ marginTop: "clamp(48px, 7vw, 88px)", marginBottom: 0 }}>
            I pick the stack the project can be maintained in, not the one that is
            interesting this year. When something simpler would do, I use something
            simpler.
          </p>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
