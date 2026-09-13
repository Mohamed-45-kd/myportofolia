import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getPublishedProjects } from "@/lib/repo";
import { jsonLd } from "@/lib/jsonld";
import { site } from "@/content/site";
import {
  ArrowLink,
  ButtonLink,
  Card,
  Icon,
  StatusBadge,
  TagList,
} from "@/components/ui";
import { ProjectCard } from "@/components/sections/shared";
import { ContactCTA } from "@/components/sections/ContactCTA";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPublishedProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.title} — ${site.name}`,
      description: project.summary,
      url: `${site.url}/projects/${project.slug}`,
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const related = (await getPublishedProjects())
    .filter((p) => p.slug !== project.slug)
    .slice(0, 3);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    author: { "@type": "Person", name: site.name },
    url: `${site.url}/projects/${project.slug}`,
    keywords: project.technologies.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
      />

      {/* ---------------- Header ---------------- */}
      <section
        style={{
          position: "relative",
          paddingTop: "calc(var(--nav-h) + clamp(40px, 6vw, 72px))",
          paddingBottom: "clamp(32px, 5vw, 56px)",
          overflow: "hidden",
        }}
      >
        <div className="hero-glow" aria-hidden="true" />
        <div className="shell" style={{ position: "relative" }}>
          <nav aria-label="Breadcrumb" style={{ marginBottom: "var(--space-6)" }}>
            <ol
              style={{
                display: "flex",
                gap: "var(--space-2)",
                alignItems: "center",
                listStyle: "none",
                padding: 0,
                margin: 0,
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--text-faint)",
              }}
            >
              <li>
                <Link href="/projects" style={{ color: "var(--text-muted)" }}>
                  Projects
                </Link>
              </li>
              <li aria-hidden="true">
                <Icon name="chevron-right" size={12} />
              </li>
              <li aria-current="page">{project.title}</li>
            </ol>
          </nav>

          <div
            style={{
              display: "flex",
              gap: "var(--space-3)",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <StatusBadge status={project.status} />
            <span className="eyebrow">{project.category}</span>
          </div>

          <h1
            className="rise"
            style={{
              fontSize: "clamp(34px, 5.6vw, 64px)",
              marginTop: "var(--space-5)",
            }}
          >
            {project.title}
          </h1>

          <p className="prose-body" style={{ marginTop: "var(--space-6)" }}>
            {project.overview}
          </p>

          {(project.links?.github || project.links?.demo || project.links?.docs) && (
            <div
              style={{
                display: "flex",
                gap: "var(--space-3)",
                flexWrap: "wrap",
                marginTop: "var(--space-8)",
              }}
            >
              {project.links?.demo ? (
                <ButtonLink href={project.links.demo} external>
                  <Icon name="external-link" size={16} />
                  Live demo
                </ButtonLink>
              ) : null}
              {project.links?.github ? (
                <ButtonLink href={project.links.github} variant="secondary" external>
                  <Icon name="github" size={16} />
                  Source code
                </ButtonLink>
              ) : null}
              {project.links?.docs ? (
                <ButtonLink href={project.links.docs} variant="ghost" external>
                  <Icon name="file-text" size={16} />
                  Documentation
                </ButtonLink>
              ) : null}
            </div>
          )}
        </div>
      </section>

      {/* ---------------- Gallery ---------------- */}
      <section className="shell" style={{ marginBottom: "var(--space-11)" }}>
        <div
          className="card card-flush"
          style={{
            position: "relative",
            aspectRatio: "16 / 8",
            display: "grid",
            placeItems: "center",
            overflow: "hidden",
            background: "var(--surface-inset)",
          }}
        >
          <div className="grid-texture" aria-hidden="true" />
          {project.gallery && project.gallery.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.gallery[0].src}
              alt={project.gallery[0].alt}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span className="project-thumb-label" style={{ position: "relative" }}>
              Screenshot
            </span>
          )}
        </div>
      </section>

      {/* ---------------- Body ---------------- */}
      <section className="shell" style={{ paddingBottom: "var(--space-12)" }}>
        <div className="case-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-11)" }}>
            <div className="case-block">
              <p className="eyebrow">The problem</p>
              <h2>What was going wrong</h2>
              <p>{project.problem}</p>
            </div>

            <div className="case-block">
              <p className="eyebrow">The solution</p>
              <h2>What I built</h2>
              <p>{project.solution}</p>
            </div>

            <div className="case-block">
              <p className="eyebrow">Key features</p>
              <h2>What it does</h2>
              <ul className="case-list">
                {project.keyFeatures.map((f) => (
                  <li key={f}>
                    <Icon name="check" size={18} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="case-block">
              <p className="eyebrow">Challenges</p>
              <h2>The hard parts</h2>
              <ul className="case-list">
                {project.challenges.map((c) => (
                  <li key={c}>
                    <Icon name="arrow-right" size={18} />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="case-block">
              <p className="eyebrow">Results</p>
              <h2>Where it stands</h2>
              <div
                style={{
                  display: "grid",
                  gap: "var(--space-4)",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                }}
              >
                {project.results.map((r) => (
                  <Card key={r.label}>
                    <p className="stat-value" style={{ fontSize: "var(--text-xl)" }}>
                      {r.value}
                    </p>
                    <p className="stat-label" style={{ marginTop: "var(--space-2)" }}>
                      {r.label}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* ---------------- Aside ---------------- */}
          <aside className="case-aside">
            <Card>
              <p className="eyebrow">Project details</p>
              <div style={{ marginTop: "var(--space-4)" }}>
                <div className="meta-row">
                  <span className="meta-key">Status</span>
                  <span className="meta-val">{project.status}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Category</span>
                  <span className="meta-val">{project.category}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Date</span>
                  <span className="meta-val">{project.date}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">My role</span>
                  <span className="meta-val">{project.role}</span>
                </div>
                {project.team ? (
                  <div className="meta-row">
                    <span className="meta-key">Team</span>
                    <span className="meta-val">{project.team}</span>
                  </div>
                ) : null}
              </div>
            </Card>

            <Card>
              <p className="eyebrow" style={{ marginBottom: "var(--space-4)" }}>
                Technology stack
              </p>
              <TagList items={project.technologies} />
            </Card>

            <Card>
              <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>
                Interested in something similar?
              </p>
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--text-muted)",
                  lineHeight: "var(--leading-normal)",
                  marginBottom: "var(--space-5)",
                }}
              >
                Tell me what the process looks like today and I will tell you what it
                would take.
              </p>
              <ButtonLink href="/contact" className="w-full">
                Start a conversation
              </ButtonLink>
            </Card>
          </aside>
        </div>
      </section>

      {/* ---------------- More work ---------------- */}
      {related.length > 0 ? (
        <section className="section-tight" style={{ background: "var(--bg-subtle)" }}>
          <div className="shell">
            <div className="section-head">
              <p className="eyebrow">More work</p>
              <div className="section-head-row">
                <h2 className="section-title" style={{ fontSize: "var(--text-2xl)" }}>
                  Other projects
                </h2>
                <ArrowLink href="/projects">All projects</ArrowLink>
              </div>
            </div>
            <div className="grid-cards">
              {related.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <ContactCTA />
    </>
  );
}
