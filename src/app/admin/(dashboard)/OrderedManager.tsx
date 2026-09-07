"use client";

import { useActionState, useState } from "react";
import { Icon } from "@/components/ui";
import { deleteOrdered, moveOrdered, saveOrdered, type ActionState } from "../actions";
import { ConfirmButton, IconSubmit, SubmitButton } from "../ConfirmButton";
import { Field, Select, Switch } from "../ui";

/**
 * Services, skills, experience, education and achievements are all the same
 * shape of problem: an ordered list of records with a handful of fields. One
 * manager drives all five, described by a field schema, rather than five
 * near-identical pages.
 */

export type FieldSpec =
  | { kind: "text" | "textarea"; name: string; label: string; placeholder?: string; hint?: string; required?: boolean }
  | { kind: "select"; name: string; label: string; options: readonly string[]; hint?: string }
  | { kind: "switch"; name: string; label: string }
  | { kind: "list"; name: string; label: string; placeholder: string; hint?: string }
  | {
      kind: "pairs";
      keyName: string;
      valueName: string;
      label: string;
      keyPlaceholder: string;
      valuePlaceholder: string;
      valueType?: "text" | "number";
      hint?: string;
    };

export interface Row {
  id: string;
  /** Values keyed by field name; lists are string[], pairs are [k,v][]. */
  values: Record<string, string | boolean | string[] | [string, string][]>;
  /** Short line shown under the title in the list. */
  title: string;
  meta?: string;
}

const initialState: ActionState = { status: "idle" };

function ListInput({
  name,
  label,
  placeholder,
  initial,
  hint,
}: {
  name: string;
  label: string;
  placeholder: string;
  initial: string[];
  hint?: string;
}) {
  const [rows, setRows] = useState(initial.length ? initial : [""]);
  return (
    <div className="field">
      <label className="label">{label}</label>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        {rows.map((value, i) => (
          <div className="repeat-row" key={i}>
            <input
              name={name}
              className="input"
              defaultValue={value}
              placeholder={placeholder}
              aria-label={`${label} ${i + 1}`}
            />
            <button
              type="button"
              className="icon-btn"
              aria-label={`Remove ${label} ${i + 1}`}
              onClick={() => setRows((r) => r.filter((_, x) => x !== i))}
            >
              <Icon name="close" size={14} />
            </button>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", marginTop: "var(--space-2)" }}>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setRows((r) => [...r, ""])}>
          <Icon name="code" size={14} />
          Add row
        </button>
        {hint ? <span className="form-hint">{hint}</span> : null}
      </div>
    </div>
  );
}

function PairsInput({
  spec,
  initial,
}: {
  spec: Extract<FieldSpec, { kind: "pairs" }>;
  initial: [string, string][];
}) {
  const [rows, setRows] = useState(initial.length ? initial : ([["", ""]] as [string, string][]));
  return (
    <div className="field">
      <label className="label">{spec.label}</label>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        {rows.map(([k, v], i) => (
          <div className="repeat-row" key={i}>
            <input
              name={spec.keyName}
              className="input"
              defaultValue={k}
              placeholder={spec.keyPlaceholder}
              aria-label={`${spec.label} ${i + 1} name`}
            />
            <input
              name={spec.valueName}
              className="input"
              type={spec.valueType === "number" ? "number" : "text"}
              min={spec.valueType === "number" ? 0 : undefined}
              max={spec.valueType === "number" ? 100 : undefined}
              defaultValue={v}
              placeholder={spec.valuePlaceholder}
              style={{ maxWidth: spec.valueType === "number" ? 120 : undefined }}
              aria-label={`${spec.label} ${i + 1} value`}
            />
            <button
              type="button"
              className="icon-btn"
              aria-label={`Remove ${spec.label} ${i + 1}`}
              onClick={() => setRows((r) => r.filter((_, x) => x !== i))}
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
          onClick={() => setRows((r) => [...r, ["", ""] as [string, string]])}
        >
          <Icon name="code" size={14} />
          Add row
        </button>
        {spec.hint ? <span className="form-hint">{spec.hint}</span> : null}
      </div>
    </div>
  );
}

function EntryForm({
  collection,
  fields,
  row,
  onDone,
}: {
  collection: string;
  fields: FieldSpec[];
  row?: Row;
  onDone?: () => void;
}) {
  const [state, formAction] = useActionState(saveOrdered, initialState);
  const errors = state.fieldErrors ?? {};

  if (state.status === "success" && onDone) {
    // Editing finished — collapse the inline editor on the next paint.
    queueMicrotask(onDone);
  }

  const value = (name: string) => row?.values[name];

  return (
    <form action={formAction}>
      <input type="hidden" name="collection" value={collection} />
      {row ? <input type="hidden" name="id" value={row.id} /> : null}

      {state.status === "error" && state.message ? (
        <div className="alert alert-danger" style={{ marginBottom: "var(--space-5)" }} role="alert">
          <Icon name="close" size={18} />
          <p>{state.message}</p>
        </div>
      ) : null}
      {state.status === "success" && !row ? (
        <div className="alert alert-success" style={{ marginBottom: "var(--space-5)" }} role="status">
          <Icon name="check" size={18} />
          <p>{state.message}</p>
        </div>
      ) : null}

      <div className="form-grid">
        {fields.map((spec) => {
          switch (spec.kind) {
            case "list":
              return (
                <ListInput
                  key={spec.name}
                  name={spec.name}
                  label={spec.label}
                  placeholder={spec.placeholder}
                  hint={spec.hint}
                  initial={(value(spec.name) as string[]) ?? []}
                />
              );
            case "pairs":
              return (
                <PairsInput
                  key={spec.keyName}
                  spec={spec}
                  initial={(value(spec.keyName) as [string, string][]) ?? []}
                />
              );
            case "select":
              return (
                <Select
                  key={spec.name}
                  label={spec.label}
                  name={spec.name}
                  options={spec.options}
                  defaultValue={(value(spec.name) as string) ?? spec.options[0]}
                  hint={spec.hint}
                />
              );
            case "switch":
              return (
                <Switch
                  key={spec.name}
                  name={spec.name}
                  label={spec.label}
                  defaultChecked={Boolean(value(spec.name))}
                />
              );
            default:
              return (
                <Field
                  key={spec.name}
                  label={spec.label}
                  name={spec.name}
                  defaultValue={(value(spec.name) as string) ?? ""}
                  placeholder={spec.placeholder}
                  hint={spec.hint}
                  error={errors[spec.name]}
                  required={spec.required}
                  textarea={spec.kind === "textarea"}
                  rows={3}
                />
              );
          }
        })}
      </div>

      <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-6)", flexWrap: "wrap" }}>
        <SubmitButton label={row ? "Save changes" : "Add"} icon="check" />
        {row && onDone ? (
          <button type="button" className="btn btn-secondary" onClick={onDone}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

export function OrderedManager({
  collection,
  singular,
  fields,
  rows,
}: {
  collection: string;
  singular: string;
  fields: FieldSpec[];
  rows: Row[];
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Add */}
      <div className="card">
        {adding ? (
          <>
            <h2 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-5)" }}>
              Add {singular}
            </h2>
            <EntryForm collection={collection} fields={fields} />
            <div style={{ marginTop: "var(--space-4)" }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAdding(false)}>
                Close
              </button>
            </div>
          </>
        ) : (
          <button type="button" className="btn btn-primary" onClick={() => setAdding(true)}>
            <Icon name="code" size={16} />
            Add {singular}
          </button>
        )}
      </div>

      {/* List */}
      {rows.length === 0 ? (
        <div className="admin-empty">
          <Icon name="layers" size={28} />
          <p style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
            Nothing here yet.
          </p>
          <button type="button" className="btn btn-secondary" onClick={() => setAdding(true)}>
            Add the first {singular}
          </button>
        </div>
      ) : (
        rows.map((row, index) => (
          <div className="card" key={row.id}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "var(--space-4)",
                flexWrap: "wrap",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>{row.title}</p>
                {row.meta ? (
                  <p className="table-mono" style={{ marginTop: 4 }}>
                    {row.meta}
                  </p>
                ) : null}
              </div>

              <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
                <form action={moveOrdered}>
                  <input type="hidden" name="collection" value={collection} />
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="direction" value="up" />
                  <IconSubmit label="Move up" icon="chevron-up" />
                </form>
                <form action={moveOrdered}>
                  <input type="hidden" name="collection" value={collection} />
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="direction" value="down" />
                  <IconSubmit label="Move down" icon="chevron-down" />
                </form>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setEditing(editing === row.id ? null : row.id)}
                >
                  {editing === row.id ? "Close" : "Edit"}
                </button>
                <form action={deleteOrdered}>
                  <input type="hidden" name="collection" value={collection} />
                  <input type="hidden" name="id" value={row.id} />
                  <ConfirmButton message={`Delete "${row.title}"? This cannot be undone.`} />
                </form>
              </div>
            </div>

            {editing === row.id ? (
              <div
                style={{
                  marginTop: "var(--space-6)",
                  paddingTop: "var(--space-6)",
                  borderTop: "1px solid var(--border-subtle)",
                }}
              >
                <EntryForm
                  collection={collection}
                  fields={fields}
                  row={row}
                  onDone={() => setEditing(null)}
                />
              </div>
            ) : null}

            <span className="sr-only">Position {index + 1}</span>
          </div>
        ))
      )}
    </div>
  );
}
