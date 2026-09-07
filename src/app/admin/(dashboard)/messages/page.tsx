import Link from "next/link";
import { getMessages } from "@/lib/repo";
import { Badge, Icon } from "@/components/ui";
import { deleteMessage, markMessage } from "../../actions";
import { ConfirmButton } from "../../ConfirmButton";
import { EmptyState, PageHead, timeAgo } from "../../ui";

export const metadata = { title: "Messages" };

const toneFor = (status: string) =>
  status === "New" ? "info" : status === "Replied" ? "success" : "neutral";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const [messages, params] = await Promise.all([getMessages(), searchParams]);
  const selected = params.id
    ? messages.find((m) => m.id === params.id)
    : messages[0];

  const unread = messages.filter((m) => m.status === "New").length;

  if (messages.length === 0) {
    return (
      <>
        <PageHead title="Messages" description="Enquiries from the public contact form." />
        <EmptyState
          icon="mail"
          title="No messages yet."
          action={
            <Link href="/contact" className="btn btn-secondary" target="_blank">
              Open the contact form
            </Link>
          }
        />
      </>
    );
  }

  return (
    <>
      <PageHead
        title="Messages"
        description={
          unread > 0
            ? `${unread} unread of ${messages.length}.`
            : `${messages.length} message${messages.length === 1 ? "" : "s"}, all read.`
        }
      />

      <div className="inbox">
        {/* List */}
        <div className="inbox-list">
          {messages.map((m) => (
            <Link
              key={m.id}
              href={`/admin/messages?id=${m.id}`}
              className={`inbox-item${selected?.id === m.id ? " inbox-item-active" : ""}`}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "var(--space-3)",
                  alignItems: "baseline",
                }}
              >
                <span className={m.status === "New" ? "inbox-unread" : ""} style={{ fontSize: "var(--text-sm)" }}>
                  {m.name}
                </span>
                <span className="table-mono">{timeAgo(m.createdAt)}</span>
              </div>
              <p
                style={{
                  marginTop: 4,
                  fontSize: "var(--text-sm)",
                  color: "var(--text-secondary)",
                  fontWeight: m.status === "New" ? 600 : 400,
                }}
              >
                {m.subject}
              </p>
              <p
                style={{
                  marginTop: 4,
                  fontSize: "var(--text-xs)",
                  color: "var(--text-faint)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {m.message}
              </p>
              {m.status !== "Read" ? (
                <span style={{ display: "inline-block", marginTop: 8 }}>
                  <Badge tone={toneFor(m.status)}>{m.status}</Badge>
                </span>
              ) : null}
            </Link>
          ))}
        </div>

        {/* Reading pane */}
        {selected ? (
          <div className="card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "var(--space-4)",
                flexWrap: "wrap",
                alignItems: "flex-start",
              }}
            >
              <div>
                <h2 style={{ fontSize: "var(--text-xl)" }}>{selected.subject}</h2>
                <p style={{ marginTop: "var(--space-2)", color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>
                  {selected.name} —{" "}
                  <a href={`mailto:${selected.email}`} className="link-brand">
                    {selected.email}
                  </a>
                </p>
                <p className="table-mono" style={{ marginTop: 4 }}>
                  {timeAgo(selected.createdAt)}
                </p>
              </div>
              <Badge tone={toneFor(selected.status)}>{selected.status}</Badge>
            </div>

            <p
              style={{
                marginTop: "var(--space-6)",
                paddingTop: "var(--space-6)",
                borderTop: "1px solid var(--border-subtle)",
                whiteSpace: "pre-wrap",
                lineHeight: "var(--leading-relaxed)",
                color: "var(--text-secondary)",
              }}
            >
              {selected.message}
            </p>

            <div className="form-actions">
              <a
                href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}
                className="btn btn-primary"
              >
                <Icon name="send" size={16} />
                Reply by email
              </a>

              {selected.status !== "Replied" ? (
                <form action={markMessage}>
                  <input type="hidden" name="id" value={selected.id} />
                  <input type="hidden" name="status" value="Replied" />
                  <button type="submit" className="btn btn-secondary">
                    <Icon name="check" size={16} />
                    Mark replied
                  </button>
                </form>
              ) : null}

              {selected.status === "New" ? (
                <form action={markMessage}>
                  <input type="hidden" name="id" value={selected.id} />
                  <input type="hidden" name="status" value="Read" />
                  <button type="submit" className="btn btn-ghost">
                    Mark read
                  </button>
                </form>
              ) : (
                <form action={markMessage}>
                  <input type="hidden" name="id" value={selected.id} />
                  <input type="hidden" name="status" value="New" />
                  <button type="submit" className="btn btn-ghost">
                    Mark unread
                  </button>
                </form>
              )}

              <form action={deleteMessage} style={{ marginLeft: "auto" }}>
                <input type="hidden" name="id" value={selected.id} />
                <ConfirmButton
                  message={`Delete the message from ${selected.name}? This cannot be undone.`}
                />
              </form>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
