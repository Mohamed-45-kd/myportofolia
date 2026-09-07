"use client";

import { useActionState } from "react";
import { Icon } from "@/components/ui";
import { saveSettings, type ActionState } from "../../actions";
import { SubmitButton } from "../../ConfirmButton";
import { Field, Switch } from "../../ui";
import type { SettingsRecord } from "@/lib/types";

const initialState: ActionState = { status: "idle" };

export function SettingsForm({ settings }: { settings: SettingsRecord }) {
  const [state, formAction] = useActionState(saveSettings, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction}>
      {state.status === "success" ? (
        <div className="alert alert-success" style={{ marginBottom: "var(--space-6)" }} role="status">
          <Icon name="check" size={18} />
          <p>{state.message}</p>
        </div>
      ) : null}
      {state.status === "error" && state.message ? (
        <div className="alert alert-danger" style={{ marginBottom: "var(--space-6)" }} role="alert">
          <Icon name="close" size={18} />
          <p>{state.message}</p>
        </div>
      ) : null}

      <section className="form-section">
        <h2 style={{ fontSize: "var(--text-lg)" }}>Identity</h2>
        <div className="form-grid form-cols-2">
          <Field label="Name" name="name" defaultValue={settings.name} required />
          <Field label="Role" name="role" defaultValue={settings.role} />
          <Field label="Location" name="location" defaultValue={settings.location} />
        </div>

        <Field
          label="Mission"
          name="mission"
          defaultValue={settings.mission}
          error={errors.mission}
          hint="Always set in tracked uppercase on the site. Never paraphrased or translated."
          required
        />

        <Field
          label="Site description"
          name="description"
          defaultValue={settings.description}
          hint="Used as the meta description and social sharing text."
          textarea
          rows={3}
        />
      </section>

      <section className="form-section">
        <h2 style={{ fontSize: "var(--text-lg)" }}>Contact channels</h2>
        <div className="form-grid form-cols-2">
          <Field label="Email" name="email" type="email" defaultValue={settings.email} />
          <Field label="WhatsApp link" name="whatsapp" type="url" defaultValue={settings.whatsapp} placeholder="https://wa.me/…" />
          <Field label="GitHub" name="github" type="url" defaultValue={settings.github} />
          <Field label="LinkedIn" name="linkedin" type="url" defaultValue={settings.linkedin} />
        </div>
      </section>

      <section className="form-section">
        <h2 style={{ fontSize: "var(--text-lg)" }}>CV download</h2>
        <div className="form-grid form-cols-2">
          <Field
            label="CV file path"
            name="cvHref"
            defaultValue={settings.cvHref}
            hint="Put the PDF in public/ and reference it by path."
          />
        </div>
        <Switch name="cvEnabled" label="Show the CV download button" defaultChecked={settings.cvEnabled} />
      </section>

      <div className="form-sticky">
        <SubmitButton label="Save settings" icon="check" />
      </div>
    </form>
  );
}
