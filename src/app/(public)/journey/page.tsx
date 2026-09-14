import type { Metadata } from "next";
import { getAchievements, getEducation, getExperience } from "@/lib/repo";
import { Card, IconBubble, SectionHeading, TagList } from "@/components/ui";
import { PageHeader } from "@/components/sections/shared";
import { ContactCTA } from "@/components/sections/ContactCTA";
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

      <section className="panel panel-light panel-2" id="experience">
        <div className="shell">
          <h2 className="panel-heading">Experience</h2>
          <div className="big-list">
            {experience.map((item, i) => (
              <Reveal key={item.title + item.period} delay={i * 70}>
                <div className="big-row">
                  <span className="big-number">{String(i + 1).padStart(2, "0")}</span>
                  <span className="big-body">
                    <span className="big-name">{item.title}</span>
                    <span className="big-meta">
                      {item.org} · {item.period}
                    </span>
                    <span className="big-desc">{item.description}</span>
                    {item.tags ? (
                      <span className="big-tags">
                        {item.tags.map((t) => (
                          <span className="big-tag" key={t}>
                            {t}
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="panel panel-dark panel-3" id="education">
        <div className="shell">
          <h2 className="panel-heading">Education</h2>
          <div className="big-list">
            {education.map((item, i) => (
              <Reveal key={item.title} delay={i * 70}>
                <div className="big-row">
                  <span className="big-number">{String(i + 1).padStart(2, "0")}</span>
                  <span className="big-body">
                    <span className="big-name">{item.title}</span>
                    <span className="big-meta">
                      {item.org} · {item.period}
                    </span>
                    <span className="big-desc">{item.description}</span>
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="panel panel-dark panel-flush panel-4" id="achievements">
        <div className="shell">
          <h2 className="panel-heading">Recognition</h2>
          <div className="big-list">
            {achievements.map((item, i) => (
              <Reveal key={item.title} delay={i * 70}>
                <div className="big-row">
                  <span className="big-number">{String(i + 1).padStart(2, "0")}</span>
                  <span className="big-body">
                    <span className="big-name">{item.title}</span>
                    <span className="big-meta">{item.meta}</span>
                    <span className="big-desc">{item.description}</span>
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
