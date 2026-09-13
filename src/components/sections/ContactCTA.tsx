import { getContact } from "@/lib/contact";
import { ButtonLink, Icon } from "@/components/ui";

/**
 * Server-only: reads contact details from the database.
 *
 * Deliberately NOT in `shared.tsx` — that module is imported by the client
 * component `ProjectGallery`, and a database import there pulls the Postgres
 * driver into the browser bundle, which fails the build on `fs`.
 */
export async function ContactCTA() {
  const contact = await getContact();
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
              <ButtonLink href={`mailto:${contact.email}`} variant="secondary" size="lg">
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
