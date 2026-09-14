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
import { ContactCTA } from "@/components/sections/ContactCTA";
import { Reveal } from "@/components/layout/Reveal";
import { Magnet } from "@/components/motion/Magnet";
import { Marquee } from "@/components/motion/Marquee";
import { StackedProjects } from "@/components/motion/StackedProjects";

/* ---------------- Hero ---------------- */

async function Hero() {
  return (
    <section className="hero">
      <div className="hero-glow" aria-hidden="true" />
      <div className="grid-texture" aria-hidden="true" />

      <div className="hero-inner">
        <div className="shell">
          <p className="hero-mission rise">{site.mission}</p>
        </div>

        {/* Full-bleed statement. Kept on one line at every width, which is what
            gives the reference its scale — the type shrinks, it never wraps. */}
        <div className="hero-title-wrap">
          <h1 className="hero-title gradient-text rise" style={{ animationDelay: "60ms" }}>
            hi, i&apos;m mohamed
          </h1>
        </div>

        <div className="shell hero-bottom">
          <p className="hero-blurb rise" style={{ animationDelay: "350ms" }}>
            a software &amp; web developer building the systems that replace a
            paper register
          </p>
          <div className="rise" style={{ animationDelay: "500ms" }}>
            <ButtonLink href="/contact" size="lg">
              Contact me
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="hero-portrait rise" style={{ animationDelay: "600ms" }}>
        <Magnet padding={150} strength={3}>
          <div className="portrait-frame">
            <Image
              src="/brand/mohamed-weli-jama.jpg"
              alt={`${site.name}, ${site.role}`}
              width={960}
              height={1280}
              priority
              sizes="(max-width: 900px) 70vw, 520px"
              className="portrait-img"
            />
          </div>
        </Magnet>
      </div>
    </section>
  );
}

/* ---------------- Numbers strip ---------------- */

async function Numbers() {
  const [publishedProjects, services, skillGroups] = await Promise.all([
    getPublishedProjects(),
    getServices(),
    getSkillGroups(),
  ]);

  return (
    <section className="shell numbers-strip">
      <Stat value={String(publishedProjects.length)} label="Projects shipped or in build" />
      <Stat value={String(services.length)} label="Services offered" />
      <Stat
        value={String(skillGroups.reduce((n, g) => n + g.items.length, 0))}
        label="Technologies in use"
      />
    </section>
  );
}

/* ---------------- Screenshot marquee ---------------- */

async function ScreenshotMarquee() {
  const projects = await getPublishedProjects();
  const tiles = projects.flatMap((project) =>
    (project.gallery ?? []).map((shot) => ({
      src: shot.src,
      alt: shot.alt || project.title,
    })),
  );

  return <Marquee tiles={tiles} />;
}

/* ---------------- Featured work ---------------- */

async function FeaturedWork() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <section className="projects-panel">
      <div className="shell">
        <h2 className="panel-heading">Projects</h2>

        <StackedProjects projects={featuredProjects} />

        <div style={{ display: "flex", justifyContent: "center", marginTop: "var(--space-11)" }}>
          <ArrowLink href="/projects">All projects</ArrowLink>
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
    <section className="services-panel">
      <div className="shell">
        <h2 className="panel-heading">Services</h2>

        <div className="service-list">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 80}>
              <Link href="/services" className="service-row">
                <span className="service-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="service-body">
                  <span className="service-name">{service.title}</span>
                  <span className="service-desc">{service.body}</span>
                </span>
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
      <Numbers />
      <ScreenshotMarquee />
      <MissionStrip />
      <SkillsOverview />
      <SelectedAchievements />
      <ServicesTeaser />
      <FeaturedWork />
      <ContactCTA />
    </>
  );
}
