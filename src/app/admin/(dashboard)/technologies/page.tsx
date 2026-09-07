import { getTechnologies } from "@/lib/repo";
import { Badge } from "@/components/ui";
import { deleteTechnology } from "../../actions";
import { ConfirmButton } from "../../ConfirmButton";
import { PageHead, timeAgo } from "../../ui";
import { TechnologyForm } from "./TechnologyForm";

export const metadata = { title: "Technologies" };

export default async function TechnologiesPage() {
  const technologies = await getTechnologies();

  const byCategory = technologies.reduce<Record<string, typeof technologies>>(
    (acc, t) => {
      (acc[t.category] ??= []).push(t);
      return acc;
    },
    {},
  );

  return (
    <>
      <PageHead
        title="Technologies"
        description="Created once here, then reused across projects and the skills page."
      />

      <div style={{ display: "grid", gap: "var(--space-8)", gridTemplateColumns: "1fr" }}>
        <TechnologyForm />

        {Object.entries(byCategory)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([category, rows]) => (
            <section key={category}>
              <h2
                className="eyebrow"
                style={{ marginBottom: "var(--space-4)" }}
              >
                {category} — {rows.length}
              </h2>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Featured</th>
                      <th>Website</th>
                      <th>Added</th>
                      <th aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <span className="table-title">{t.name}</span>
                          {t.description ? (
                            <>
                              <br />
                              <span className="table-mono">{t.description}</span>
                            </>
                          ) : null}
                        </td>
                        <td>
                          {t.featured ? (
                            <Badge tone="info">Featured</Badge>
                          ) : (
                            <span className="table-mono">—</span>
                          )}
                        </td>
                        <td className="table-mono">
                          {t.websiteUrl ? (
                            <a
                              href={t.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link-brand"
                            >
                              Link
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="table-mono">{timeAgo(t.createdAt)}</td>
                        <td>
                          <div className="table-actions">
                            <form action={deleteTechnology}>
                              <input type="hidden" name="id" value={t.id} />
                              <ConfirmButton
                                message={`Remove "${t.name}" from the technology list? Projects that name it keep their tag.`}
                                label="Remove"
                              />
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
      </div>
    </>
  );
}
