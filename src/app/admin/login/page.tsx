import type { Metadata } from "next";
import Link from "next/link";
import { authConfigStatus } from "@/lib/auth";
import { site } from "@/content/site";
import { Icon } from "@/components/ui";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const status = authConfigStatus();

  return (
    <div className="signin">
      <div className="hero-glow" aria-hidden="true" />
      <div className="grid-texture" aria-hidden="true" />

      <div className="signin-card">
        <div className="logo" style={{ marginBottom: "var(--space-8)" }}>
          <span className="logo-mark" aria-hidden="true">
            {site.shortName}
          </span>
          <span className="logo-text">
            <span className="logo-name">{site.name}</span>
            <span className="logo-role">Admin dashboard</span>
          </span>
        </div>

        <h1 style={{ fontSize: "var(--text-2xl)" }}>Sign in</h1>
        <p
          style={{
            marginTop: "var(--space-3)",
            marginBottom: "var(--space-8)",
            color: "var(--text-muted)",
            fontSize: "var(--text-sm)",
          }}
        >
          This dashboard is private. Content changes made here appear on the public
          site immediately.
        </p>

        {status.problem ? (
          <div className="alert alert-danger" style={{ marginBottom: "var(--space-6)" }} role="alert">
            <Icon name="close" size={18} />
            <div>
              <p style={{ fontWeight: 600 }}>Sign-in is misconfigured</p>
              <p style={{ marginTop: 4 }}>{status.problem}</p>
            </div>
          </div>
        ) : !status.configured ? (
          <div className="alert alert-info" style={{ marginBottom: "var(--space-6)" }}>
            <Icon name="settings" size={18} />
            <div>
              <p style={{ fontWeight: 600 }}>Set up required</p>
              <p style={{ marginTop: 4 }}>
                Run <code>npm run admin:password</code>. It writes the values into{" "}
                <code>.env.local</code> for you. Then restart the server.
              </p>
            </div>
          </div>
        ) : null}

        <LoginForm from={from ?? ""} />

        <p
          style={{
            marginTop: "var(--space-8)",
            paddingTop: "var(--space-5)",
            borderTop: "1px solid var(--border-subtle)",
            fontSize: "var(--text-sm)",
          }}
        >
          <Link href="/" className="link-arrow">
            <Icon name="chevron-right" size={13} style={{ transform: "rotate(180deg)" }} />
            Back to the site
          </Link>
        </p>
      </div>
    </div>
  );
}
