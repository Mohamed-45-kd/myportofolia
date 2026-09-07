import Link from "next/link";
import { getOverviewStats } from "@/lib/repo";
import { Badge, Icon, StatusBadge } from "@/components/ui";
import { EmptyState, PageHead, StatCard, timeAgo } from "../ui";

export default async function DashboardPage() {
  const stats = await getOverviewStats();

  return (
    <>
      <PageHead
        title="Dashboard"
        description="Everything on the public site is managed from here."
        action={
          <Link href="/admin/projects/new" className="btn btn-primary">
            <Icon name="code" size={16} />
            New project
          </Link>
        }
      />

      {/* Overview counters — §22 */}
      <div className="stat-grid">
        <StatCard label="Total projects" value={stats.totalProjects} icon="folder-git" href="/admin/projects" />
        <StatCard label="Featured" value={stats.featuredProjects} icon="sparkles" href="/admin/projects" />
        <StatCard label="In progress" value={stats.inProgressProjects} icon="clock" href="/admin/projects" />
        <StatCard label="Completed" value={stats.completedProjects} icon="check" href="/admin/projects" />
        <StatCard label="Technologies" value={stats.totalTechnologies} icon="layers" href="/admin/technologies" />
        <StatCard
          label="New messages"
          value={stats.newMessages}
          icon="mail"
          href="/admin/messages"
          tone={stats.newMessages > 0 ? "brand" : undefined}
        />
      </div>

      {/* Recent projects */}
      <section style={{ marginTop: "var(--space-10)" }}>
        <div className="admin-head" style={{ marginBottom: "var(--space-5)" }}>
          <div>
            <h2 style={{ fontSize: "var(--text-lg)" }}>Recent projects</h2>
            <p>Most recently updated first.</p>
          </div>
          <Link href="/admin/projects" className="link-arrow">
            All projects
            <Icon name="arrow-up-right" size={14} />
          </Link>
        </div>

        {stats.recentProjects.length === 0 ? (
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
                  <th>Visibility</th>
                  <th>Updated</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {stats.recentProjects.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <span className="table-title">{p.title}</span>
                      <br />
                      <span className="table-mono">/{p.slug}</span>
                    </td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                    <td>
                      {p.published ? (
                        <Badge tone="success">Published</Badge>
                      ) : (
                        <Badge tone="neutral">Draft</Badge>
                      )}
                      {p.featured ? (
                        <span style={{ marginLeft: 8 }}>
                          <Badge tone="info">Featured</Badge>
                        </span>
                      ) : null}
                    </td>
                    <td className="table-mono">{timeAgo(p.updatedAt)}</td>
                    <td>
                      <div className="table-actions">
                        <Link href={`/admin/projects/${p.id}`} className="btn btn-ghost btn-sm">
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recent messages */}
      <section style={{ marginTop: "var(--space-10)" }}>
        <div className="admin-head" style={{ marginBottom: "var(--space-5)" }}>
          <div>
            <h2 style={{ fontSize: "var(--text-lg)" }}>Recent messages</h2>
            <p>
              {stats.newMessages > 0
                ? `${stats.newMessages} unread of ${stats.totalMessages}.`
                : "Nothing unread."}
            </p>
          </div>
          <Link href="/admin/messages" className="link-arrow">
            Inbox
            <Icon name="arrow-up-right" size={14} />
          </Link>
        </div>

        {stats.recentMessages.length === 0 ? (
          <EmptyState
            icon="mail"
            title="No messages yet."
            action={
              <Link href="/contact" className="btn btn-secondary" target="_blank">
                Open the contact form
              </Link>
            }
          />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentMessages.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <Link href={`/admin/messages?id=${m.id}`} className="table-title">
                        {m.name}
                      </Link>
                      <br />
                      <span className="table-mono">{m.email}</span>
                    </td>
                    <td>{m.subject}</td>
                    <td>
                      <Badge
                        tone={
                          m.status === "New" ? "info" : m.status === "Replied" ? "success" : "neutral"
                        }
                      >
                        {m.status}
                      </Badge>
                    </td>
                    <td className="table-mono">{timeAgo(m.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
