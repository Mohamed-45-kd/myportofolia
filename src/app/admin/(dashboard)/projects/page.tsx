import Link from "next/link";
import { getProjects } from "@/lib/repo";
import { Badge, Icon, StatusBadge } from "@/components/ui";
import { deleteProject, toggleProjectFlag } from "../../actions";
import { ConfirmButton } from "../../ConfirmButton";
import { EmptyState, PageHead, timeAgo } from "../../ui";

export const metadata = { title: "Projects" };

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const [projects, params] = await Promise.all([getProjects(), searchParams]);

  const sorted = [...projects].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));

  return (
    <>
      <PageHead
        title="Projects"
        description="Projects are the main content type. Publish, feature and edit them here."
        action={
          <Link href="/admin/projects/new" className="btn btn-primary">
            <Icon name="code" size={16} />
            New project
          </Link>
        }
      />

      {params.saved ? (
        <div className="alert alert-success" style={{ marginBottom: "var(--space-6)" }} role="status">
          <Icon name="check" size={18} />
          <p>Project saved. The public site has been updated.</p>
        </div>
      ) : null}
      {params.deleted ? (
        <div className="alert alert-info" style={{ marginBottom: "var(--space-6)" }} role="status">
          <Icon name="check" size={18} />
          <p>Project deleted.</p>
        </div>
      ) : null}

      {sorted.length === 0 ? (
        <EmptyState
          icon="folder-git"
          title="No projects yet."
          action={
            <Link href="/admin/projects/new" className="btn btn-secondary">
              Add the first project
            </Link>
          }
        />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Status</th>
                <th>Published</th>
                <th>Featured</th>
                <th>Updated</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span className="table-title">{p.title}</span>
                    <br />
                    <span className="table-mono">/projects/{p.slug}</span>
                  </td>
                  <td>
                    <StatusBadge status={p.status} />
                  </td>
                  <td>
                    <form action={toggleProjectFlag}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="field" value="published" />
                      <input type="hidden" name="value" value={String(!p.published)} />
                      <button
                        type="submit"
                        className="btn btn-ghost btn-sm"
                        aria-label={`${p.published ? "Unpublish" : "Publish"} ${p.title}`}
                      >
                        {p.published ? (
                          <Badge tone="success">Published</Badge>
                        ) : (
                          <Badge tone="neutral">Draft</Badge>
                        )}
                      </button>
                    </form>
                  </td>
                  <td>
                    <form action={toggleProjectFlag}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="field" value="featured" />
                      <input type="hidden" name="value" value={String(!p.featured)} />
                      <button
                        type="submit"
                        className="btn btn-ghost btn-sm"
                        aria-label={`${p.featured ? "Remove from" : "Add to"} featured — ${p.title}`}
                      >
                        {p.featured ? (
                          <Badge tone="info">Featured</Badge>
                        ) : (
                          <span className="table-mono">—</span>
                        )}
                      </button>
                    </form>
                  </td>
                  <td className="table-mono">{timeAgo(p.updatedAt)}</td>
                  <td>
                    <div className="table-actions">
                      <Link
                        href={`/projects/${p.slug}`}
                        className="btn btn-ghost btn-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon name="external-link" size={14} />
                        View
                      </Link>
                      <Link href={`/admin/projects/${p.id}`} className="btn btn-secondary btn-sm">
                        Edit
                      </Link>
                      <form action={deleteProject}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="slug" value={p.slug} />
                        <ConfirmButton
                          message={`Delete "${p.title}"? This cannot be undone.`}
                        />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
