"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui";
import { saveProject, type ActionState } from "../../actions";
import { SubmitButton } from "../../ConfirmButton";
import { Field, Select, Switch } from "../../ui";
import { GalleryUploader } from "./GalleryUploader";
import type { ProjectRecord } from "@/lib/types";
import type { ProjectStatus } from "@/content/types";

const STATUSES: readonly ProjectStatus[] = [
  "Idea",
  "Planning",
  "In Progress",
  "Near Completion",
  "Completed",
  "Maintained",
  "Archived",
];

const initialState: ActionState = { status: "idle" };

/** Repeatable single-value rows (features, challenges, technologies). */
function Repeatable({
  name,
  label,
  hint,
  initial,
  placeholder,
  textarea,
}: {
  name: string;
  label: string;
  hint?: string;
  initial: string[];
  placeholder: string;
  textarea?: boolean;
}) {
  const [rows, setRows] = useState<string[]>(initial.length ? initial : [""]);

  return (
    <div className="field">
      <label className="label">{label}</label>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        {rows.map((value, index) => (
          <div className="repeat-row" key={index}>
            {textarea ? (
              <textarea
                name={name}
                className="textarea"
                defaultValue={value}
                placeholder={placeholder}
                rows={2}
                style={{ minHeight: 64 }}
                aria-label={`${label} ${index + 1}`}
              />
            ) : (
              <input
                name={name}
                className="input"
                defaultValue={value}
                placeholder={placeholder}
                aria-label={`${label} ${index + 1}`}
              />
            )}
            <button
              type="button"
              className="icon-btn"
              aria-label={`Remove ${label} ${index + 1}`}
              onClick={() => setRows((r) => r.filter((_, i) => i !== index))}
            >
              <Icon name="close" size={14} />
            </button>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", marginTop: "var(--space-2)" }}>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setRows((r) => [...r, ""])}
        >
          <Icon name="code" size={14} />
          Add {label.toLowerCase()}
        </button>
        {hint ? <span className="form-hint">{hint}</span> : null}
      </div>
    </div>
  );
}

/** Repeatable label/value pairs (results) or url/alt pairs (gallery). */
function RepeatablePairs({
  label,
  keyName,
  valueName,
  keyPlaceholder,
  valuePlaceholder,
  initial,
  hint,
}: {
  label: string;
  keyName: string;
  valueName: string;
  keyPlaceholder: string;
  valuePlaceholder: string;
  initial: { k: string; v: string }[];
  hint?: string;
}) {
  const [rows, setRows] = useState(initial.length ? initial : [{ k: "", v: "" }]);

  return (
    <div className="field">
      <label className="label">{label}</label>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        {rows.map((row, index) => (
          <div className="repeat-row" key={index}>
            <input
              name={keyName}
              className="input"
              defaultValue={row.k}
              placeholder={keyPlaceholder}
              aria-label={`${label} ${index + 1} label`}
            />
            <input
              name={valueName}
              className="input"
              defaultValue={row.v}
              placeholder={valuePlaceholder}
              aria-label={`${label} ${index + 1} value`}
            />
            <button
              type="button"
              className="icon-btn"
              aria-label={`Remove ${label} ${index + 1}`}
              onClick={() => setRows((r) => r.filter((_, i) => i !== index))}
            >
              <Icon name="close" size={14} />
            </button>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", marginTop: "var(--space-2)" }}>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setRows((r) => [...r, { k: "", v: "" }])}
        >
          <Icon name="code" size={14} />
          Add row
        </button>
        {hint ? <span className="form-hint">{hint}</span> : null}
      </div>
    </div>
  );
}

export function ProjectForm({
  project,
  technologyNames,
}: {
  project?: ProjectRecord;
  technologyNames: string[];
}) {
  const [state, formAction] = useActionState(saveProject, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction}>
      {project ? <input type="hidden" name="id" value={project.id} /> : null}

      {state.status === "error" && state.message ? (
        <div className="alert alert-danger" style={{ marginBottom: "var(--space-6)" }} role="alert">
          <Icon name="close" size={18} />
          <p>{state.message}</p>
        </div>
      ) : null}

      {/* ---------------- Basics ---------------- */}
      <section className="form-section">
        <h2 style={{ fontSize: "var(--text-lg)" }}>Basics</h2>
        <div className="form-grid form-cols-2">
          <Field
            label="Project name"
            name="title"
            defaultValue={project?.title}
            placeholder="Kaabe School Management System"
            error={errors.title}
            required
          />
          <Field
            label="Slug"
            name="slug"
            defaultValue={project?.slug}
            placeholder="kaabe-school-management-system"
            hint="The URL. Leave blank to generate it from the name."
            error={errors.slug}
          />
        </div>

        <Field
          label="Short description"
          name="summary"
          defaultValue={project?.summary}
          placeholder="One sentence. Shown on cards and in search results."
          error={errors.summary}
          textarea
          rows={2}
          required
        />

        <Field
          label="Overview"
          name="overview"
          defaultValue={project?.overview}
          placeholder="The opening paragraph of the case study."
          textarea
          rows={4}
        />

        <div className="form-grid form-cols-2">
          <Field
            label="Category"
            name="category"
            defaultValue={project?.category}
            placeholder="Management System"
          />
          <Select
            label="Status"
            name="status"
            options={STATUSES}
            defaultValue={project?.status ?? "In Progress"}
          />
          <Field
            label="Date"
            name="date"
            defaultValue={project?.date}
            placeholder="2025 — 2026"
            hint="Free text — a year, a range, or where the work happened."
          />
          <Field
            label="My role"
            name="role"
            defaultValue={project?.role}
            placeholder="Solo developer"
          />
        </div>

        <Field
          label="Team"
          name="team"
          defaultValue={project?.team ?? ""}
          placeholder="Leave blank for solo work"
        />

        <div style={{ display: "flex", gap: "var(--space-8)", flexWrap: "wrap" }}>
          <Switch name="published" label="Published on the site" defaultChecked={project?.published ?? false} />
          <Switch name="featured" label="Featured on the homepage" defaultChecked={project?.featured ?? false} />
        </div>
      </section>

      {/* ---------------- Case study ---------------- */}
      <section className="form-section">
        <h2 style={{ fontSize: "var(--text-lg)" }}>Case study</h2>

        <Field
          label="Problem"
          name="problem"
          defaultValue={project?.problem}
          placeholder="What was going wrong before this existed."
          textarea
          rows={4}
        />
        <Field
          label="Solution"
          name="solution"
          defaultValue={project?.solution}
          placeholder="What you built, and why that shape."
          textarea
          rows={4}
        />

        <Repeatable
          name="keyFeature"
          label="Key features"
          initial={project?.keyFeatures ?? []}
          placeholder="Daily attendance for students and staff"
        />

        <Repeatable
          name="challenge"
          label="Challenges"
          initial={project?.challenges ?? []}
          placeholder="What made this harder than it looked"
          textarea
        />

        <RepeatablePairs
          label="Results"
          keyName="resultLabel"
          valueName="resultValue"
          keyPlaceholder="Support calls"
          valuePlaceholder="-62%"
          initial={(project?.results ?? []).map((r) => ({ k: r.label, v: r.value }))}
          hint="Prefer facts you can point at over estimated percentages."
        />
      </section>

      {/* ---------------- Technology ---------------- */}
      <section className="form-section">
        <h2 style={{ fontSize: "var(--text-lg)" }}>Technology</h2>
        <Repeatable
          name="technology"
          label="Technologies"
          initial={project?.technologies ?? []}
          placeholder="Next.js"
          hint={
            technologyNames.length > 0
              ? `Reusable technologies: ${technologyNames.slice(0, 8).join(", ")}${technologyNames.length > 8 ? "…" : ""}`
              : undefined
          }
        />
        <datalist id="technology-options">
          {technologyNames.map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>
      </section>

      {/* ---------------- Links & media ---------------- */}
      <section className="form-section">
        <h2 style={{ fontSize: "var(--text-lg)" }}>Links &amp; media</h2>
        <div className="form-grid form-cols-2">
          <Field label="GitHub URL" name="github" defaultValue={project?.links?.github ?? ""} placeholder="https://github.com/…" type="url" />
          <Field label="Live demo URL" name="demo" defaultValue={project?.links?.demo ?? ""} placeholder="https://…" type="url" />
          <Field label="Documentation URL" name="docs" defaultValue={project?.links?.docs ?? ""} placeholder="https://…" type="url" />
          <Field label="Demo video URL" name="video" defaultValue={project?.links?.video ?? ""} placeholder="https://…" type="url" />
        </div>

        <GalleryUploader initial={project?.gallery ?? []} />
      </section>

      <div className="form-sticky">
        <SubmitButton label={project ? "Save changes" : "Create project"} icon="check" />
        <Link href="/admin/projects" className="btn btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
