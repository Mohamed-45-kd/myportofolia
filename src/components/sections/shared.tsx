import Link from "next/link";
import type { Project } from "@/content/types";
import { Card, Icon, StatusBadge, TagList, ButtonLink } from "@/components/ui";
import { site } from "@/content/site";

/* ---------------- Page header ---------------- */

export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <section
      style={{
        position: "relative",
        paddingTop: "calc(var(--nav-h) + clamp(48px, 7vw, 88px))",
        paddingBottom: "clamp(32px, 5vw, 56px)",
        overflow: "hidden",
      }}
    >
      <div className="hero-glow" aria-hidden="true" />
      <div className="shell" style={{ position: "relative" }}>
        <p className="eyebrow rise">{eyebrow}</p>
        <h1
          className="rise"
          style={{
            fontSize: "clamp(38px, 6vw, 68px)",
            marginTop: "var(--space-4)",
            letterSpacing: "var(--track-tight)",
            animationDelay: "60ms",
          }}
        >
          {title}
        </h1>
        {lead ? (
          <p
            className="prose-body rise"
            style={{ marginTop: "var(--space-6)", animationDelay: "120ms" }}
          >
            {lead}
          </p>
        ) : null}
      </div>
    </section>
  );
}

/* ---------------- Project card ---------------- */

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card as="article" interactive flush className="project-card">
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`${project.title} — read the case study`}
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <div className="project-thumb">
          <div className="grid-texture" aria-hidden="true" />
          {project.gallery && project.gallery.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.gallery[0].src}
              alt={project.gallery[0].alt}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span className="project-thumb-label">Screenshot</span>
          )}
          {project.featured ? (
            <span
              className="badge badge-info"
              style={{ position: "absolute", top: 12, right: 12 }}
            >
              Featured
            </span>
          ) : null}
        </div>

        <div className="project-body">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--space-3)",
            }}
          >
            <StatusBadge status={project.status} />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--text-faint)",
              }}
            >
              {project.category}
            </span>
          </div>

          <h3 className="project-title">{project.title}</h3>
          <p className="project-summary">{project.summary}</p>

          <div style={{ marginTop: "auto", paddingTop: "var(--space-4)" }}>
            <TagList items={project.technologies.slice(0, 4)} />
          </div>

          <span
            className="link-arrow"
            style={{ marginTop: "var(--space-4)" }}
            aria-hidden="true"
          >
            Read case study
            <Icon name="arrow-up-right" size={14} />
          </span>
        </div>
      </Link>
    </Card>
  );
}

/* ---------------- Skill meter ---------------- */

export function SkillMeter({ name, level }: { name: string; level: number }) {
  return (
    <div className="meter-row">
      <div className="meter-head">
        <span className="meter-name">{name}</span>
        <span className="meter-value">{level}%</span>
      </div>
      <div
        className="meter-track"
        role="meter"
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={name}
      >
        <div className="meter-fill" style={{ width: `${level}%` }} />
      </div>
    </div>
  );
}

/* ---------------- Contact CTA band ---------------- */

export function ContactCTA() {
  return (
    <section className="section-tight">
      <div className="shell">
        <div
          className="card"
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "clamp(32px, 6vw, 64px)",
            textAlign: "center",
          }}
        >
          <div className="hero-glow" aria-hidden="true" />
          <div style={{ position: "relative" }}>
            <p className="eyebrow">Next step</p>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                marginTop: "var(--space-4)",
                maxWidth: 620,
                marginInline: "auto",
              }}
            >
              Have something that should be{" "}
              <span className="gradient-text">a system instead of a spreadsheet?</span>
            </h2>
            <p
              className="prose-body"
              style={{
                marginTop: "var(--space-5)",
                marginInline: "auto",
                textAlign: "center",
              }}
            >
              Tell me what the process looks like today. If I am the right person to
              build it, I will say so — and if I am not, I will say that too.
            </p>
            <div
              style={{
                display: "flex",
                gap: "var(--space-3)",
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: "var(--space-8)",
              }}
            >
              <ButtonLink href="/contact" size="lg">
                Let&apos;s work together
                <Icon name="arrow-right" size={16} />
              </ButtonLink>
              <ButtonLink href={`mailto:${site.contact.email}`} variant="secondary" size="lg">
                <Icon name="mail" size={16} />
                Email me directly
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
