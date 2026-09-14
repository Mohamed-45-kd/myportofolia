import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./Icon";
import type { IconName, ProjectStatus } from "@/content/types";

/* ---------------- Button ---------------- */

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const btnClass = (variant: ButtonVariant, size: ButtonSize, className?: string) =>
  ["btn", `btn-${variant}`, size !== "md" ? `btn-${size}` : "", className]
    .filter(Boolean)
    .join(" ");

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...rest
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={btnClass(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  external,
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  external?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const cls = btnClass(variant, size, className);
  if (external || href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={cls}
        target={href.startsWith("mailto:") ? undefined : "_blank"}
        rel="noopener noreferrer"
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

/* ---------------- Card ---------------- */

export function Card({
  children,
  interactive,
  flush,
  className,
  id,
  as: Tag = "div",
}: {
  children: ReactNode;
  interactive?: boolean;
  flush?: boolean;
  className?: string;
  id?: string;
  as?: "div" | "article" | "li" | "section";
}) {
  return (
    <Tag
      id={id}
      className={[
        "card",
        interactive ? "card-interactive" : "",
        flush ? "card-flush" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}

/* ---------------- Badge / status ---------------- */

const statusTone: Record<ProjectStatus, string> = {
  Idea: "badge-neutral",
  Planning: "badge-neutral",
  "In Progress": "badge-info",
  "Near Completion": "badge-warning",
  Completed: "badge-success",
  Maintained: "badge-success",
  Archived: "badge-neutral",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className={`badge ${statusTone[status]}`}>
      <span className="badge-dot" aria-hidden="true" />
      {status}
    </span>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "info" | "success" | "warning" | "danger";
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="tag">{children}</span>;
}

export function TagList({ items }: { items: readonly string[] }) {
  return (
    <div className="tag-list">
      {items.map((t) => (
        <Tag key={t}>{t}</Tag>
      ))}
    </div>
  );
}

/* ---------------- Section heading ---------------- */

export function SectionHeading({
  eyebrow,
  title,
  lead,
  action,
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  action?: ReactNode;
  id?: string;
}) {
  return (
    <header className="section-head" id={id}>
      <p className="eyebrow">{eyebrow}</p>
      <div className="section-head-row">
        <h2 className="section-title">{title}</h2>
        {action}
      </div>
      {lead ? <p className="section-lead">{lead}</p> : null}
    </header>
  );
}

/* ---------------- Misc ---------------- */

export function Divider() {
  return <hr className="divider" />;
}

export function ArrowLink({
  href,
  children,
  external,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const content = (
    <>
      {children}
      <Icon name="arrow-up-right" size={14} />
    </>
  );
  if (external) {
    return (
      <a href={href} className="link-arrow" target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className="link-arrow">
      {content}
    </Link>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="stat-value">{value}</p>
      <p className="stat-label" style={{ marginTop: "var(--space-1)" }}>
        {label}
      </p>
    </div>
  );
}

export function IconBubble({ name }: { name: IconName }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "grid",
        placeItems: "center",
        width: 44,
        height: 44,
        borderRadius: "var(--radius-md)",
        background: "color-mix(in srgb, var(--text-accent) 14%, transparent)",
        border: "1px solid var(--border-brand)",
        color: "var(--text-accent)",
        flexShrink: 0,
      }}
    >
      <Icon name={name} size={20} />
    </span>
  );
}

export { Icon };
