import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import {
  getAchievements,
  getFeaturedProjects,
  getPublishedProjects,
  getServices,
  getSkillGroups,
} from "@/lib/repo";
import {
  ArrowLink,
  ButtonLink,
  Card,
  Icon,
  IconBubble,
  SectionHeading,
  Stat,
} from "@/components/ui";
import { ProjectCard } from "@/components/sections/shared";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { Reveal } from "@/components/layout/Reveal";

/* ---------------- Hero ---------------- */

async function Hero() {
  const [publishedProjects, services, skillGroups] = await Promise.all([
    getPublishedProjects(),
    getServices(),
    getSkillGroups(),
  ]);

  return (
    <section className="hero">
      <div className="hero-glow" aria-hidden="true" />
      <div className="grid-texture" aria-hidden="true" />

      <div className="shell" style={{ position: "relative" }}>
        <div className="hero-grid">
          <div>
        <p className="hero-mission rise">{site.mission}</p>

        <h1
          className="hero-title rise"
          style={{ marginTop: "var(--space-6)", animationDelay: "60ms" }}
        >
          {site.name}
        </h1>

        <p
          className="rise"
          style={{
            marginTop: "var(--space-5)",
            fontSize: "clamp(20px, 2.6vw, 30px)",
            fontFamily: "var(--font-display)",
            fontWeight: "var(--weight-medium)",
            letterSpacing: "var(--track-snug)",
            color: "var(--text-secondary)",
            animationDelay: "120ms",
          }}
        >
          Software Developer &amp; Web Developer{" "}
          <span className="code-glyph" aria-hidden="true">
            &lt;/&gt;
          </span>
        </p>

        <p
          className="prose-body rise"
          style={{ marginTop: "var(--space-7)", animationDelay: "180ms" }}
        >
          I build management systems, ordering platforms and the software that
          replaces a paper register. Most of my work is for schools and small
          organisations here — the places where the process still runs on exercise
          books and someone&apos;s memory. My job is to make that process a system
          that keeps working after I hand it over.
        </p>

        <div
          className="rise"
          style={{
            display: "flex",
            gap: "var(--space-3)",
            flexWrap: "wrap",
            marginTop: "var(--space-9)",
            animationDelay: "240ms",
          }}
        >
          <ButtonLink href="/projects" size="lg">
            View my projects
            <Icon name="arrow-right" size={16} />
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary" size="lg">
            Let&apos;s work together
          </ButtonLink>
          {site.cv.enabled ? (
            <ButtonLink href={site.cv.href} variant="ghost" size="lg" external>
              <Icon name="download" size={16} />
              Download CV
            </ButtonLink>
          ) : null}
        </div>

        <div
          className="rise"
          style={{
            display: "flex",
            gap: "clamp(32px, 6vw, 72px)",
            flexWrap: "wrap",
            marginTop: "var(--space-11)",
            paddingTop: "var(--space-8)",
            borderTop: "1px solid var(--border-subtle)",
            animationDelay: "300ms",
          }}
        >
          <Stat value={String(publishedProjects.length)} label="Projects shipped or in build" />
          <Stat value={String(services.length)} label="Services offered" />
          <Stat
            value={String(skillGroups.reduce((n, g) => n + g.items.length, 0))}
            label="Technologies in use"
          />
            </div>
          </div>

          {/* Portrait. Framed as a card so it reads as part of the system
              rather than a photo dropped onto the page. */}
          <div className="hero-portrait rise" style={{ animationDelay: "200ms" }}>
            <div className="portrait-frame">
              <Image
                src="/brand/mohamed-weli-jama.jpg"
                alt={`${site.name}, ${site.role}`}
                width={960}
                height={1280}
                priority
                sizes="(max-width: 900px) 70vw, 420px"
                className="portrait-img"
              />
              <span className="portrait-tag">
                <span className="code-glyph" aria-hidden="true">&lt;/&gt;</span>
                {site.location}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Featured work ---------------- */

async function FeaturedWork() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <section className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="01 — Selected work"
          title={
            <>
              Projects that <span className="gradient-text">solve a real problem</span>
            </>
          }
          lead="Each one started as a process someone was doing by hand. Open a case study for the problem, the approach and what it does now."
          action={<ArrowLink href="/projects">All projects</ArrowLink>}
        />

        <div className="grid-cards">
          {featuredProjects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 70}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Skills overview ---------------- */

async function SkillsOverview() {
  const skillGroups = await getSkillGroups();

  return (
    <section className="section" style={{ background: "var(--bg-subtle)" }}>
      <div className="shell">
        <SectionHeading
          eyebrow="02 — Technology"
          title="What I build with"
          lead="The stack I actually ship on, grouped the way I use it."
          action={<ArrowLink href="/skills">Full breakdown</ArrowLink>}
        />

        <div className="grid-cards">
          {skillGroups.map((group, i) => (
            <Reveal key={group.title} delay={i * 60}>
              <Card interactive className="h-full">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-4)",
                    marginBottom: "var(--space-5)",
                  }}
                >
                  <IconBubble name={group.icon} />
                  <h3 style={{ fontSize: "var(--text-lg)" }}>{group.title}</h3>
                </div>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--text-muted)",
                    marginBottom: "var(--space-5)",
                    lineHeight: "var(--leading-normal)",
                  }}
                >
                  {group.note}
                </p>
                <div className="tag-list">
                  {group.items.map((item) => (
                    <span className="tag" key={item.name}>
                      {item.name}
                    </span>
                  ))}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Mission strip ---------------- */

function MissionStrip() {
  return (
    <section className="section-tight">
      <div className="shell">
        <div
          className="card"
          style={{ position: "relative", overflow: "hidden", padding: "clamp(32px, 5vw, 56px)" }}
        >
          <div className="grid-texture" aria-hidden="true" />
          <div
            style={{
              position: "relative",
              display: "grid",
              gap: "var(--space-8)",
              gridTemplateColumns: "1fr",
              alignItems: "center",
            }}
          >
            <div>
              <p className="eyebrow">The mission</p>
              <p
                className="hero-mission"
                style={{
                  fontSize: "clamp(16px, 2.4vw, 26px)",
                  marginTop: "var(--space-5)",
                  lineHeight: 1.7,
                }}
              >
                {site.mission}
              </p>
              <p className="prose-body" style={{ marginTop: "var(--space-6)" }}>
                Not as a slogan. Every organisation here that still runs on paper is
                losing time it cannot get back and information it cannot check. One
                system at a time — a school, a bookshop, a hiring process — is how
                that changes.
              </p>
              <div style={{ marginTop: "var(--space-7)" }}>
                <ArrowLink href="/about#mission">Read the full mission</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Achievements ---------------- */

async function SelectedAchievements() {
  const achievements = await getAchievements();

  return (
    <section className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="03 — Recognition"
          title="Selected achievements"
          lead="Where the technology journey started, and what has come out of it since."
          action={<ArrowLink href="/journey">Full journey</ArrowLink>}
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
                  style={{ marginTop: "var(--space-2)", textTransform: "none", letterSpacing: "var(--track-wide)" }}
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
  );
}

/* ---------------- Services teaser ---------------- */

async function ServicesTeaser() {
  const services = await getServices();

  return (
    <section className="section" style={{ background: "var(--bg-subtle)" }}>
      <div className="shell">
        <SectionHeading
          eyebrow="04 — Services"
          title="How I can help"
          lead="Six ways I work with schools, businesses and organisations."
          action={<ArrowLink href="/services">All services</ArrowLink>}
        />

        <div className="grid-cards">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 50}>
              <Link href="/services" style={{ display: "block", height: "100%" }}>
                <Card interactive>
                  <IconBubble name={service.icon} />
                  <h3 style={{ fontSize: "var(--text-md)", marginTop: "var(--space-5)" }}>
                    {service.title}
                  </h3>
                  <p
                    style={{
                      marginTop: "var(--space-3)",
                      fontSize: "var(--text-sm)",
                      color: "var(--text-muted)",
                      lineHeight: "var(--leading-normal)",
                    }}
                  >
                    {service.body}
                  </p>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedWork />
      <SkillsOverview />
      <MissionStrip />
      <SelectedAchievements />
      <ServicesTeaser />
      <ContactCTA />
    </>
  );
}
