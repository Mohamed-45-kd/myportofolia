import type { Metadata } from "next";
import { site } from "@/content/site";
import { getContact, socialsFor } from "@/lib/contact";
import { Card, Icon } from "@/components/ui";
import { PageHeader } from "@/components/sections/shared";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Mohamed Weli Jama about a web application, a management system, or digitalizing a process that still runs on paper.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const contact = await getContact();
  const socials = socialsFor(contact);
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's work together."
        lead="Tell me what the process looks like today. If I am the right person to build it, I will say so — and if I am not, I will say that too."
      />

      <section className="section-tight">
        <div className="shell">
          <div
            className="case-grid"
            style={{ gridTemplateColumns: "minmax(0, 1fr)", gap: "var(--space-9)" }}
          >
            <div className="grid-2" style={{ gap: "clamp(32px, 5vw, 64px)", alignItems: "start" }}>
              <Card>
                <p className="eyebrow" style={{ marginBottom: "var(--space-6)" }}>
                  Send a message
                </p>
                <ContactForm />
              </Card>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                <Card>
                  <p className="eyebrow" style={{ marginBottom: "var(--space-5)" }}>
                    Direct channels
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                    {socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--space-4)",
                          padding: "var(--space-3) 0",
                          borderBottom: "1px solid var(--border-subtle)",
                          color: "var(--text-secondary)",
                          fontSize: "var(--text-sm)",
                        }}
                      >
                        <Icon name={s.icon} size={18} />
                        <span style={{ flex: 1 }}>{s.label}</span>
                        <Icon name="arrow-up-right" size={14} />
                      </a>
                    ))}
                  </div>
                </Card>

                <Card>
                  <p className="eyebrow" style={{ marginBottom: "var(--space-4)" }}>
                    What helps
                  </p>
                  <ul className="case-list">
                    {[
                      "What the process looks like now, and who does each step.",
                      "What goes wrong most often.",
                      "Who will use the system, and on what device.",
                      "Any deadline you are working to.",
                    ].map((t) => (
                      <li key={t} style={{ fontSize: "var(--text-sm)" }}>
                        <Icon name="check" size={16} />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card>
                  <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
                    <Icon name="map-pin" size={18} />
                    <div>
                      <p style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>
                        {site.location}
                      </p>
                      <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
                        Working remotely and on-site.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
