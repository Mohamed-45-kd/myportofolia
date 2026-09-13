import type { Metadata } from "next";
import Link from "next/link";
import { formatPostDate } from "@/content/posts";
import { getPublishedPosts } from "@/lib/repo";
import { Badge, Card, Icon } from "@/components/ui";
import { PageHeader } from "@/components/sections/shared";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { Reveal } from "@/components/layout/Reveal";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on shipping software — performance on slow connections, digitalizing paper processes, and what building a school management system actually takes.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const publishedPosts = await getPublishedPosts();

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Notes from the build."
        lead="Development stories, case studies and the things I only learned by getting them wrong first."
      />

      <section className="section-tight">
        <div className="shell">
          {publishedPosts.length === 0 ? (
            <div className="empty">
              <Icon name="file-text" size={28} />
              <p style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                No posts published yet.
              </p>
              <Link href="/projects" className="btn btn-secondary">
                Read a case study instead
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
              {publishedPosts.map((post, i) => (
                <Reveal key={post.slug} delay={i * 60}>
                  <Link href={`/blog/${post.slug}`} style={{ display: "block" }}>
                    <Card interactive>
                      <div
                        style={{
                          display: "flex",
                          gap: "var(--space-4)",
                          alignItems: "center",
                          flexWrap: "wrap",
                          marginBottom: "var(--space-4)",
                        }}
                      >
                        <Badge tone="info">{post.tag}</Badge>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "var(--text-xs)",
                            color: "var(--text-faint)",
                          }}
                        >
                          {formatPostDate(post.date)}
                        </span>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontFamily: "var(--font-mono)",
                            fontSize: "var(--text-xs)",
                            color: "var(--text-faint)",
                          }}
                        >
                          <Icon name="clock" size={13} />
                          {post.readingTime}
                        </span>
                      </div>

                      <h2 style={{ fontSize: "clamp(22px, 3vw, 30px)" }}>{post.title}</h2>
                      <p
                        style={{
                          marginTop: "var(--space-4)",
                          color: "var(--text-muted)",
                          lineHeight: "var(--leading-relaxed)",
                          maxWidth: 680,
                        }}
                      >
                        {post.excerpt}
                      </p>

                      <span className="link-arrow" style={{ marginTop: "var(--space-6)" }}>
                        Read post
                        <Icon name="arrow-up-right" size={14} />
                      </span>
                    </Card>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
