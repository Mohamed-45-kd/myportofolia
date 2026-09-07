import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui";
import type { IconName } from "@/content/types";

/** Shared building blocks for the dashboard pages. */

export function PageHead({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="admin-head">
      <div>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function StatCard({
  label,
  value,
  icon,
  href,
  tone,
}: {
  label: string;
  value: number | string;
  icon: IconName;
  href?: string;
  tone?: "brand";
}) {
  const inner = (
    <div className="card" style={{ height: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-3)",
        }}
      >
        <p className="stat-label">{label}</p>
        <span style={{ color: tone === "brand" ? "var(--text-accent)" : "var(--text-faint)" }}>
          <Icon name={icon} size={18} />
        </span>
      </div>
      <p className="stat-value" style={{ marginTop: "var(--space-4)" }}>
        {value}
      </p>
    </div>
  );

  return href ? (
    <Link href={href} style={{ display: "block", height: "100%" }}>
      {inner}
    </Link>
  ) : (
    inner
  );
}

export function EmptyState({
  icon,
  title,
  action,
}: {
  icon: IconName;
  title: string;
  action: ReactNode;
}) {
  return (
    <div className="admin-empty">
      <Icon name={icon} size={28} />
      <p style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{title}</p>
      {action}
    </div>
  );
}

export function Switch({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="switch">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
      <span className="switch-track">
        <span className="switch-knob" />
      </span>
      <span className="switch-label">{label}</span>
    </label>
  );
}

export function Field({
  label,
  name,
  defaultValue,
  placeholder,
  hint,
  error,
  type = "text",
  required,
  textarea,
  rows,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  placeholder?: string;
  hint?: string;
  error?: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
}) {
  const id = `field-${name}`;
  return (
    <div className="field">
      <label className="label" htmlFor={id}>
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          className={`textarea${error ? " input-invalid" : ""}`}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          rows={rows}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={error ? true : undefined}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          className={`input${error ? " input-invalid" : ""}`}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={error ? true : undefined}
        />
      )}
      {error ? (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      ) : hint ? (
        <p className="form-hint">{hint}</p>
      ) : null}
    </div>
  );
}

export function Select({
  label,
  name,
  options,
  defaultValue,
  hint,
}: {
  label: string;
  name: string;
  options: readonly string[];
  defaultValue?: string;
  hint?: string;
}) {
  const id = `field-${name}`;
  return (
    <div className="field">
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <select id={id} name={name} className="select input" defaultValue={defaultValue}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {hint ? <p className="form-hint">{hint}</p> : null}
    </div>
  );
}

/** Relative up to a week, absolute after — the brand's timestamp rule. */
export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";

  const seconds = Math.floor((Date.now() - then) / 1000);
  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
