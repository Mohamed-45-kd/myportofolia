import Link from "next/link";
import { nav, site, socials } from "@/content/site";
import { Icon } from "@/components/ui/Icon";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-grid">
          <div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "var(--text-lg)",
                letterSpacing: "var(--track-tight)",
              }}
            >
              {site.name}
            </p>
            <p
              className="eyebrow"
              style={{ marginTop: "var(--space-2)", color: "var(--text-faint)" }}
            >
              Software Developer &amp; Web Developer
            </p>
            {/* The mission line — always full tracked uppercase, never paraphrased. */}
            <p
              className="hero-mission"
              style={{ marginTop: "var(--space-6)", maxWidth: 420, lineHeight: 1.8 }}
            >
              {site.mission}
            </p>
            <p
              style={{
                marginTop: "var(--space-6)",
                display: "flex",
                gap: "var(--space-2)",
                alignItems: "center",
                color: "var(--text-faint)",
                fontSize: "var(--text-sm)",
              }}
            >
              <Icon name="map-pin" size={16} />
              {site.location}
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="footer-heading">Pages</p>
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="footer-link">
                {item.label}
              </Link>
            ))}
          </nav>

          <div>
            <p className="footer-heading">Elsewhere</p>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="footer-link"
                target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}
              >
                <Icon name={s.icon} size={16} />
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>
            <span className="code-glyph">&lt;/&gt;</span> Built with Next.js — designed and
            developed in-house.
          </p>
        </div>
      </div>
    </footer>
  );
}
