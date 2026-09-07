import Link from "next/link";
import { getPosts } from "@/lib/repo";
import { formatPostDate } from "@/content/posts";
import { Badge, Icon } from "@/components/ui";
import { deletePost, togglePostPublished } from "../../actions";
import { ConfirmButton } from "../../ConfirmButton";
import { EmptyState, PageHead, timeAgo } from "../../ui";

export const metadata = { title: "Blog posts" };

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const [posts, params] = await Promise.all([getPosts(), searchParams]);
  const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <>
      <PageHead
        title="Blog posts"
        description="Development stories, case studies and notes."
        action={
          <Link href="/admin/blog/new" className="btn btn-primary">
            <Icon name="file-text" size={16} />
            New post
          </Link>
        }
      />

      {params.saved ? (
        <div className="alert alert-success" style={{ marginBottom: "var(--space-6)" }} role="status">
          <Icon name="check" size={18} />
          <p>Post saved.</p>
        </div>
      ) : null}
      {params.deleted ? (
        <div className="alert alert-info" style={{ marginBottom: "var(--space-6)" }} role="status">
          <Icon name="check" size={18} />
          <p>Post deleted.</p>
        </div>
      ) : null}

      {sorted.length === 0 ? (
        <EmptyState
          icon="file-text"
          title="No posts yet."
          action={
            <Link href="/admin/blog/new" className="btn btn-secondary">
              Write the first post
            </Link>
          }
        />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Post</th>
                <th>Tag</th>
                <th>Date</th>
                <th>Published</th>
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
                    <span className="table-mono">/blog/{p.slug}</span>
                  </td>
                  <td>
                    <Badge tone="info">{p.tag}</Badge>
                  </td>
                  <td className="table-mono">{formatPostDate(p.date)}</td>
                  <td>
                    <form action={togglePostPublished}>
                      <input type="hidden" name="id" value={p.id} />
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
                  <td className="table-mono">{timeAgo(p.updatedAt)}</td>
                  <td>
                    <div className="table-actions">
                      <Link href={`/admin/blog/${p.id}`} className="btn btn-secondary btn-sm">
                        Edit
                      </Link>
                      <form action={deletePost}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="slug" value={p.slug} />
                        <ConfirmButton message={`Delete "${p.title}"? This cannot be undone.`} />
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
