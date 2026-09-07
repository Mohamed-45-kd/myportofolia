"use client";

import { useFormStatus } from "react-dom";
import { Icon } from "@/components/ui";
import type { IconName } from "@/content/types";

/**
 * Submit button that asks before doing something irreversible.
 *
 * The form still submits with scripting disabled — the confirmation is an
 * enhancement, not the gate. The gate is `requireAdmin()` in the action.
 */
export function ConfirmButton({
  message,
  label = "Delete",
  icon = "close",
  danger = true,
  size = "sm",
}: {
  message: string;
  label?: string;
  icon?: IconName;
  danger?: boolean;
  size?: "sm" | "md";
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={`btn btn-ghost${size === "sm" ? " btn-sm" : ""}`}
      style={danger ? { color: "var(--danger-500)" } : undefined}
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      <Icon name={icon} size={14} />
      {pending ? "Working…" : label}
    </button>
  );
}

/** Submit button that reflects pending state, for ordinary saves. */
export function SubmitButton({
  label,
  pendingLabel,
  icon,
  variant = "primary",
}: {
  label: string;
  pendingLabel?: string;
  icon?: IconName;
  variant?: "primary" | "secondary";
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`btn btn-${variant}`} disabled={pending}>
      {pending ? (pendingLabel ?? "Saving…") : label}
      {icon && !pending ? <Icon name={icon} size={16} /> : null}
    </button>
  );
}

/** Icon-only submit, used for the reorder arrows. */
export function IconSubmit({ label, icon }: { label: string; icon: IconName }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="icon-btn" aria-label={label} title={label} disabled={pending} style={{ width: 32, height: 32 }}>
      <Icon name={icon} size={14} />
    </button>
  );
}
