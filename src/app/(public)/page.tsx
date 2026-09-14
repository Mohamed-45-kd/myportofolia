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
import { AnimatedText } from "@/components/motion/AnimatedText";
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
    <section className="shell numbers-band">
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

/* ---------------- About ---------------- */

function AboutPanel() {
  return (
    <section className="panel panel-dark panel-1">
      <div className="shell">
        <h2 className="panel-heading">About me</h2>

        <AnimatedText
          className="statement"
          text="I am a software and web developer. Most of what I build is management software — the systems that hold the records an organisation runs on. I care about two things more than anything else: that the thing gets shipped, and that it still works six months after I hand it over."
        />

        <div className="statement-actions">
          <ButtonLink href="/about" size="lg">
            More about me
          </ButtonLink>
          <ButtonLink href="/journey" variant="secondary" size="lg">
            My journey
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Skills ---------------- */

async function SkillsOverview() {
  const skillGroups = await getSkillGroups();

  return (
    <section className="panel panel-light panel-2">
      <div className="shell">
        <h2 className="panel-heading">Skills</h2>
        <p className="panel-lead">
          The stack I actually ship on, grouped the way I use it.
        </p>

        <div className="big-list">
          {skillGroups.map((group, i) => (
            <Reveal key={group.title} delay={i * 70}>
              <Link href="/skills" className="big-row">
                <span className="big-number">{String(i + 1).padStart(2, "0")}</span>
                <span className="big-body">
                  <span className="big-name">{group.title}</span>
                  <span className="big-desc">{group.note}</span>
                  <span className="big-tags">
                    {group.items.map((item) => (
                      <span className="big-tag" key={item.name}>
                        {item.name}
                      </span>
                    ))}
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Mission ---------------- */

function MissionStrip() {
  return (
    <section className="panel panel-dark panel-3">
      <div className="shell">
        <h2 className="panel-heading">Mission</h2>

        {/* Set verbatim, in tracked uppercase, exactly as the brand requires. */}
        <p className="mission-statement">{site.mission}</p>

        <p className="statement" style={{ marginTop: "clamp(32px, 5vw, 56px)" }}>
          Not as a slogan. Every organisation here that still runs on paper is
          losing time it cannot get back and information it cannot check. One
          system at a time — a school, a bookshop, a hiring process — is how that
          changes.
        </p>

        <div className="statement-actions">
          <ButtonLink href="/about#mission" variant="secondary" size="lg">
            Read the full mission
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Achievements ---------------- */

async function SelectedAchievements() {
  const achievements = await getAchievements();

  return (
    <section className="panel panel-dark panel-flush panel-4">
      <div className="shell">
        <h2 className="panel-heading">Recognition</h2>
        <p className="panel-lead">
          Where the technology journey started, and what has come out of it since.
        </p>

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
  );
}

/* ---------------- Projects ---------------- */

async function FeaturedWork() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <section className="panel panel-dark" style={{ zIndex: 6, marginTop: "-56px" }}>
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

async function ServicesTeaser() {
  const services = await getServices();

  return (
    <section className="panel panel-light panel-5">
      <div className="shell">
        <h2 className="panel-heading">Services</h2>

        <div className="big-list">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 80}>
              <Link href="/services" className="big-row">
                <span className="big-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="big-body">
                  <span className="big-name">{service.title}</span>
                  <span className="big-desc">{service.body}</span>
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
      <AboutPanel />
      <SkillsOverview />
      <MissionStrip />
      <SelectedAchievements />
      <ServicesTeaser />
      <FeaturedWork />
      <ContactCTA />
    </>
  );
}
