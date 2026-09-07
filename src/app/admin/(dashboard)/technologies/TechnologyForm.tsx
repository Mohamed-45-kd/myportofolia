"use client";

import { useActionState } from "react";
import { Icon } from "@/components/ui";
import { saveTechnology, type ActionState } from "../../actions";
import { SubmitButton } from "../../ConfirmButton";
import { Field, Select, Switch } from "../../ui";

const initialState: ActionState = { status: "idle" };

const CATEGORIES = [
  "Programming",
  "Web Development",
  "Backend & Database",
  "Development Tools",
  "Design & Media",
  "Other",
] as const;

const ICONS = [
  "layers",
  "code",
  "terminal",
  "database",
  "server",
  "folder-git",
  "palette",
  "workflow",
  "cpu",
  "globe",
] as const;

export function TechnologyForm() {
  const [state, formAction] = useActionState(saveTechnology, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <div className="card">
      <h2 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-5)" }}>
        Add a technology
      </h2>

      {state.status === "success" ? (
        <div className="alert alert-success" style={{ marginBottom: "var(--space-5)" }} role="status">
          <Icon name="check" size={18} />
          <p>{state.message}</p>
        </div>
      ) : null}
      {state.status === "error" && state.message ? (
        <div className="alert alert-danger" style={{ marginBottom: "var(--space-5)" }} role="alert">
          <Icon name="close" size={18} />
          <p>{state.message}</p>
        </div>
      ) : null}

      <form action={formAction} key={state.status === "success" ? Date.now() : "form"}>
        <div className="form-grid form-cols-2">
          <Field label="Name" name="name" placeholder="Next.js" error={errors.name} required />
          <Select label="Category" name="category" options={CATEGORIES} defaultValue="Web Development" />
          <Select label="Icon" name="icon" options={ICONS} defaultValue="layers" />
          <Field label="Website URL" name="websiteUrl" placeholder="https://nextjs.org" type="url" />
        </div>

        <div style={{ marginTop: "var(--space-5)" }}>
          <Field
            label="Description"
            name="description"
            placeholder="Optional — a short note on how you use it."
          />
        </div>

        <div style={{ marginTop: "var(--space-5)", display: "flex", gap: "var(--space-5)", alignItems: "center", flexWrap: "wrap" }}>
          <Switch name="featured" label="Featured technology" />
          <SubmitButton label="Add technology" icon="check" />
        </div>
      </form>
    </div>
  );
}
