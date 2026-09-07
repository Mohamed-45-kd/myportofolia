import Link from "next/link";
import { Icon } from "@/components/ui";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

/**
 * Root 404. It sits outside the (public) group so that unmatched URLs anywhere
 * still reach it, and therefore renders the public chrome itself.
 */
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main">
    <section
      style={{
        position: "relative",
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        paddingTop: "var(--nav-h)",
        overflow: "hidden",
      }}
    >
      <div className="hero-glow" aria-hidden="true" />
      <div className="grid-texture" aria-hidden="true" />
      <div className="shell" style={{ position: "relative", textAlign: "center" }}>
        <p className="eyebrow">Error 404</p>
        <h1 style={{ fontSize: "clamp(48px, 9vw, 108px)", marginTop: "var(--space-4)" }}>
          <span className="gradient-text">Page not found</span>
        </h1>
        <p
          className="prose-body"
          style={{ marginInline: "auto", marginTop: "var(--space-6)", textAlign: "center" }}
        >
          That address does not exist on this site. The projects are probably what you
          were looking for.
        </p>
        <div
          style={{
            display: "flex",
            gap: "var(--space-3)",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "var(--space-9)",
          }}
        >
          <Link href="/projects" className="btn btn-primary">
            View projects
            <Icon name="arrow-right" size={16} />
          </Link>
          <Link href="/" className="btn btn-secondary">
            Back to home
          </Link>
        </div>
      </div>
    </section>
      </main>
      <Footer />
    </>
  );
}
