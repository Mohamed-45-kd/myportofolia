import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate } from "@/content/posts";
import { jsonLd } from "@/lib/jsonld";
import { getPostBySlug, getPublishedPosts } from "@/lib/repo";
import { site } from "@/content/site";
import { Badge, Icon } from "@/components/ui";
import { ContactCTA } from "@/components/sections/ContactCTA";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPublishedPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: `${post.title} — ${site.name}`,
      description: post.excerpt,
      url: `${site.url}/blog/${post.slug}`,
      publishedTime: post.date,
      authors: [site.name],
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Person", name: site.name, url: site.url },
    url: `${site.url}/blog/${post.slug}`,
  };

  const more = (await getPublishedPosts()).filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
      />

      <article>
        <section
          style={{
            position: "relative",
            paddingTop: "calc(var(--nav-h) + clamp(40px, 6vw, 72px))",
            paddingBottom: "clamp(24px, 4vw, 40px)",
            overflow: "hidden",
          }}
        >
          <div className="hero-glow" aria-hidden="true" />
          <div className="shell" style={{ position: "relative" }}>
            <Link
              href="/blog"
              className="link-arrow"
              style={{ marginBottom: "var(--space-6)", display: "inline-flex" }}
            >
              <Icon name="chevron-right" size={13} style={{ transform: "rotate(180deg)" }} />
              All posts
            </Link>

            <div
              style={{
                display: "flex",
                gap: "var(--space-4)",
                alignItems: "center",
                flexWrap: "wrap",
                marginTop: "var(--space-4)",
              }}
            >
              <Badge tone="info">{post.tag}</Badge>
              <time
                dateTime={post.date}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: "var(--text-faint)",
                }}
              >
                {formatPostDate(post.date)}
              </time>
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

            <h1
              style={{
                fontSize: "clamp(32px, 5vw, 56px)",
                marginTop: "var(--space-5)",
                maxWidth: 800,
              }}
            >
              {post.title}
            </h1>

            <p className="prose-body" style={{ marginTop: "var(--space-6)" }}>
              {post.excerpt}
            </p>
          </div>
        </section>

        <section className="shell" style={{ paddingBottom: "var(--space-12)" }}>
          <div className="article">
            {post.body.map((block, i) =>
              block.startsWith("## ") ? (
                <h2 key={i}>{block.replace("## ", "")}</h2>
              ) : (
                <p key={i}>{block}</p>
              ),
            )}

            <div
              style={{
                marginTop: "var(--space-11)",
                paddingTop: "var(--space-6)",
                borderTop: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-4)",
              }}
            >
              <span className="logo-mark" aria-hidden="true">
                {site.shortName}
              </span>
              <div>
                <p style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>{site.name}</p>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
                  {site.role}
                </p>
              </div>
            </div>
          </div>
        </section>
      </article>

      {more.length > 0 ? (
        <section className="section-tight" style={{ background: "var(--bg-subtle)" }}>
          <div className="shell">
            <p className="eyebrow" style={{ marginBottom: "var(--space-6)" }}>
              Keep reading
            </p>
            <div className="grid-2">
              {more.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} style={{ display: "block" }}>
                  <div className="card card-interactive">
                    <Badge tone="info">{p.tag}</Badge>
                    <h3 style={{ fontSize: "var(--text-lg)", marginTop: "var(--space-4)" }}>
                      {p.title}
                    </h3>
                    <p
                      style={{
                        marginTop: "var(--space-3)",
                        fontSize: "var(--text-sm)",
                        color: "var(--text-muted)",
                        lineHeight: "var(--leading-normal)",
                      }}
                    >
                      {p.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <ContactCTA />
    </>
  );
}
