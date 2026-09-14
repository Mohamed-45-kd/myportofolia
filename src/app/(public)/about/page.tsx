import type { Metadata } from "next";
import { site } from "@/content/site";
import { getAchievements, getEducation, getExperience } from "@/lib/repo";
import { Card, Icon, IconBubble, SectionHeading, ArrowLink } from "@/components/ui";
import { PageHeader } from "@/components/sections/shared";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { Reveal } from "@/components/layout/Reveal";
import { AnimatedText } from "@/components/motion/AnimatedText";

export const metadata: Metadata = {
  title: "About",
  description:
    "Mohamed Weli Jama — software and web developer. The technology journey from the ICT Club at Pharo Sheikh Secondary School to building school management systems.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const [experience, education, achievements] = await Promise.all([
    getExperience(),
    getEducation(),
    getAchievements(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="I build the system that replaces the register."
        lead="A short version of who I am, where the technology started, and what I am trying to do with it."
      />

      {/* ---------------- Profile ---------------- */}
      <section className="section-tight">
        <div className="shell">
          <div className="grid-2" style={{ gap: "clamp(32px, 6vw, 72px)" }}>
            <div>
              <p className="eyebrow">Profile</p>
              <div
                style={{
                  marginTop: "var(--space-6)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-6)",
                }}
              >
                <AnimatedText
                  className="prose-body"
                  text="I am a software and web developer. I care about two things more than anything else: that the thing gets shipped, and that it still works six months after I hand it over."
                />
                <p className="prose-body">
                  Most of what I build is management software — the systems that hold
                  the records an organisation runs on. A school management platform, an
                  online book ordering system, a directory that connects teachers with
                  the schools that need them. They look like different products. They
                  are the same job: take something being done by hand and make it
                  something you can check.
                </p>
                <p className="prose-body">
                  I work across the whole build. The data model first, because that is
                  the part that is expensive to get wrong. Then the backend, the
                  interface, the deployment, and the document that explains it to
                  whoever comes next.
                </p>
              </div>
            </div>

            <div>
              <Card>
                <p className="eyebrow">At a glance</p>
                <div style={{ marginTop: "var(--space-5)" }}>
                  <div className="meta-row">
                    <span className="meta-key">Role</span>
                    <span className="meta-val">{site.role}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-key">Based in</span>
                    <span className="meta-val">{site.location}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-key">Focus</span>
                    <span className="meta-val">Management systems, web platforms</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-key">Main stack</span>
                    <span className="meta-val">Next.js, TypeScript, PostgreSQL</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-key">Started at</span>
                    <span className="meta-val">ICT Club, Pharo Sheikh</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-key">Available for</span>
                    <span className="meta-val">Projects and collaboration</span>
                  </div>
                </div>
                <div style={{ marginTop: "var(--space-6)" }}>
                  <ArrowLink href="/contact">Get in touch</ArrowLink>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Mission ---------------- */}
      <section className="section" style={{ background: "var(--bg-subtle)" }} id="mission">
        <div className="shell">
          <SectionHeading
            eyebrow="The mission"
            title={
              <>
                To <span className="gradient-text">digitalize our Country</span>
              </>
            }
          />

          <div
            className="card"
            style={{
              position: "relative",
              overflow: "hidden",
              padding: "clamp(28px, 5vw, 56px)",
              marginBottom: "var(--space-9)",
            }}
          >
            <div className="grid-texture" aria-hidden="true" />
            <p
              className="hero-mission"
              style={{
                position: "relative",
                fontSize: "clamp(15px, 2.2vw, 24px)",
                lineHeight: 1.8,
              }}
            >
              {site.mission}
            </p>
          </div>

          <div className="grid-2">
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
              <p className="prose-body">
                Digital transformation gets talked about as if it means buying
                software. It does not. It means looking at how a job is actually done
                — who writes what down, which book it goes in, who has to be asked
                before anything moves — and then building the version of that process
                that does not depend on one person being in the room.
              </p>
              <p className="prose-body">
                The places this matters most are the ordinary ones. Schools that
                cannot answer how many students paid this term without counting.
                Businesses whose order book is a chat thread. Offices where the
                record exists in exactly one copy.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {[
                {
                  icon: "graduation-cap" as const,
                  title: "Education",
                  body: "Records, attendance, fees and results in one system instead of five registers.",
                },
                {
                  icon: "briefcase" as const,
                  title: "Business",
                  body: "Ordering, stock and customers tracked where everyone can see the same numbers.",
                },
                {
                  icon: "layout-dashboard" as const,
                  title: "Administration",
                  body: "Applications, approvals and permits that leave a trail instead of a memory.",
                },
                {
                  icon: "users" as const,
                  title: "Organisations",
                  body: "The reporting an organisation is asked for, produced from the data it already has.",
                },
              ].map((item) => (
                <Card key={item.title}>
                  <div style={{ display: "flex", gap: "var(--space-4)" }}>
                    <IconBubble name={item.icon} />
                    <div>
                      <h3 style={{ fontSize: "var(--text-base)" }}>{item.title}</h3>
                      <p
                        style={{
                          marginTop: "var(--space-2)",
                          fontSize: "var(--text-sm)",
                          color: "var(--text-muted)",
                          lineHeight: "var(--leading-normal)",
                        }}
                      >
                        {item.body}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Background ---------------- */}
      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="Background"
            title="Where this started"
            lead="Pharo Sheikh Secondary School, and a club that had access to components and no idea what it was doing yet."
          />

          <div className="grid-2" style={{ alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
              <p className="prose-body">
                I took my higher education at Pharo Sheikh Secondary School, and I was
                a member of the ICT Club there. That club is the reason I do this.
              </p>
              <p className="prose-body">
                We built a small robot. We experimented with hand- and eye-gesture
                control, which mostly meant learning how much of a demo depends on
                the lighting in the room. And we built the Smart School Bell, which
                took the one thing the whole school ran on — the period bell, rung by
                hand, late whenever the person with the schedule was busy — and made
                it follow the timetable on its own.
              </p>
              <p className="prose-body">
                The team was recognised for innovation. What actually stayed with me
                was smaller than the recognition: we had found a thing everybody put
                up with, and we had fixed it. Everything on this site since is the
                same move, in software.
              </p>
              <div>
                <ArrowLink href="/journey">See the full journey</ArrowLink>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {achievements.slice(0, 3).map((a) => (
                <Card key={a.title}>
                  <div style={{ display: "flex", gap: "var(--space-4)" }}>
                    <IconBubble name={a.icon} />
                    <div>
                      <h3 style={{ fontSize: "var(--text-base)" }}>{a.title}</h3>
                      <p
                        className="eyebrow"
                        style={{ marginTop: "var(--space-1)", letterSpacing: "var(--track-wide)" }}
                      >
                        {a.meta}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Quick journey ---------------- */}
      <section className="section" style={{ background: "var(--bg-subtle)" }}>
        <div className="shell">
          <SectionHeading
            eyebrow="Journey"
            title="Experience & education"
            action={<ArrowLink href="/journey">Everything in detail</ArrowLink>}
          />

          <div className="grid-2" style={{ gap: "clamp(32px, 6vw, 72px)" }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: "var(--space-7)" }}>
                Experience
              </p>
              <div className="timeline">
                {experience.map((item, i) => (
                  <Reveal key={item.title + item.period} delay={i * 60}>
                    <div className="timeline-item">
                      <span
                        className={`timeline-dot${item.current ? " timeline-dot-current" : ""}`}
                        aria-hidden="true"
                      />
                      <p className="timeline-period">{item.period}</p>
                      <h3 className="timeline-title" style={{ marginTop: "var(--space-2)" }}>
                        {item.title}
                      </h3>
                      <p className="timeline-org">{item.org}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow" style={{ marginBottom: "var(--space-7)" }}>
                Education
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                {education.map((item) => (
                  <Card key={item.title}>
                    <div style={{ display: "flex", gap: "var(--space-4)" }}>
                      <IconBubble name={item.icon} />
                      <div>
                        <p className="timeline-period">{item.period}</p>
                        <h3 style={{ fontSize: "var(--text-base)", marginTop: "var(--space-1)" }}>
                          {item.title}
                        </h3>
                        <p className="timeline-org">{item.org}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
