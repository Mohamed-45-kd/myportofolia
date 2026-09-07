import type { Metadata } from "next";
import { getAchievements, getEducation, getExperience } from "@/lib/repo";
import { Card, IconBubble, SectionHeading, TagList } from "@/components/ui";
import { ContactCTA, PageHeader } from "@/components/sections/shared";
import { Reveal } from "@/components/layout/Reveal";

export const metadata: Metadata = {
  title: "Journey",
  description:
    "Experience, education and achievements — from the ICT Club at Pharo Sheikh Secondary School to building school management systems and web platforms.",
  alternates: { canonical: "/journey" },
};

export default async function JourneyPage() {
  const [experience, education, achievements] = await Promise.all([
    getExperience(),
    getEducation(),
    getAchievements(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Journey"
        title="Experience, education and what came out of it."
        lead="The route from a school ICT club to building the systems on this site."
      />

      {/* ---------------- Experience ---------------- */}
      <section className="section-tight" id="experience">
        <div className="shell">
          <SectionHeading eyebrow="01 — Experience" title="Where I have worked" />

          <div className="timeline">
            {experience.map((item, i) => (
              <Reveal key={item.title + item.period} delay={i * 70}>
                <article className="timeline-item">
                  <span
                    className={`timeline-dot${item.current ? " timeline-dot-current" : ""}`}
                    aria-hidden="true"
                  />
                  <p className="timeline-period">
                    {item.period}
                    {item.current ? (
                      <span className="badge badge-success" style={{ marginLeft: 12 }}>
                        Current
                      </span>
                    ) : null}
                  </p>
                  <h3 className="timeline-title" style={{ marginTop: "var(--space-3)" }}>
                    {item.title}
                  </h3>
                  <p className="timeline-org">{item.org}</p>
                  <p
                    style={{
                      marginTop: "var(--space-4)",
                      color: "var(--text-secondary)",
                      lineHeight: "var(--leading-relaxed)",
                      maxWidth: 640,
                    }}
                  >
                    {item.description}
                  </p>
                  {item.tags ? (
                    <div style={{ marginTop: "var(--space-5)" }}>
                      <TagList items={item.tags} />
                    </div>
                  ) : null}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Education ---------------- */}
      <section className="section-tight" id="education" style={{ background: "var(--bg-subtle)" }}>
        <div className="shell">
          <SectionHeading
            eyebrow="02 — Education"
            title="Where I learned it"
            lead="Pharo Sheikh Secondary School, and everything learned since by building."
          />

          <div className="grid-2">
            {education.map((item, i) => (
              <Reveal key={item.title} delay={i * 70}>
                <Card>
                  <div style={{ display: "flex", gap: "var(--space-4)" }}>
                    <IconBubble name={item.icon} />
                    <div>
                      <p className="timeline-period">{item.period}</p>
                      <h3 style={{ fontSize: "var(--text-lg)", marginTop: "var(--space-2)" }}>
                        {item.title}
                      </h3>
                      <p className="timeline-org">{item.org}</p>
                      <p
                        style={{
                          marginTop: "var(--space-4)",
                          fontSize: "var(--text-sm)",
                          color: "var(--text-muted)",
                          lineHeight: "var(--leading-relaxed)",
                        }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Achievements ---------------- */}
      <section className="section-tight" id="achievements">
        <div className="shell">
          <SectionHeading
            eyebrow="03 — Achievements"
            title="Recognition and results"
            lead="The ICT Club work, the innovation recognition, and what has been built since."
          />

          <div className="grid-cards">
            {achievements.map((a, i) => (
              <Reveal key={a.title} delay={i * 60}>
                <Card interactive>
                  <IconBubble name={a.icon} />
                  <h3 style={{ fontSize: "var(--text-md)", marginTop: "var(--space-5)" }}>
                    {a.title}
                  </h3>
                  <p
                    className="eyebrow"
                    style={{ marginTop: "var(--space-2)", letterSpacing: "var(--track-wide)" }}
                  >
                    {a.meta}
                  </p>
                  <p
                    style={{
                      marginTop: "var(--space-4)",
                      fontSize: "var(--text-sm)",
                      color: "var(--text-muted)",
                      lineHeight: "var(--leading-normal)",
                    }}
                  >
                    {a.description}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
