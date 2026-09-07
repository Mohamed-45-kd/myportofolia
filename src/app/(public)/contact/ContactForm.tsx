"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type ContactState } from "./actions";
import { Icon } from "@/components/ui";

const initialState: ContactState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary btn-lg" disabled={pending}>
      {pending ? "Sending…" : "Send message"}
      <Icon name="send" size={16} />
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState);
  const v = state.values;

  if (state.status === "success") {
    return (
      <div className="alert alert-success" role="status">
        <Icon name="check" size={20} />
        <div>
          <p style={{ fontWeight: 600 }}>Message sent</p>
          <p style={{ marginTop: 4, color: "var(--text-secondary)" }}>{state.message}</p>
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      noValidate
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}
    >
      {state.status === "error" && state.message ? (
        <div className="alert alert-danger" role="alert">
          <Icon name="close" size={20} />
          <p>{state.message}</p>
        </div>
      ) : null}

      <div className="grid-2" style={{ gap: "var(--space-5)" }}>
        <div className="field">
          <label className="label" htmlFor="name">
            Your name
          </label>
          <input
            id="name"
            name="name"
            className={`input${state.errors?.name ? " input-invalid" : ""}`}
            placeholder="Full name"
            defaultValue={v?.name}
            required
            aria-describedby={state.errors?.name ? "name-error" : undefined}
            aria-invalid={state.errors?.name ? true : undefined}
          />
          {state.errors?.name ? (
            <p className="field-error" id="name-error">
              {state.errors.name}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label className="label" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`input${state.errors?.email ? " input-invalid" : ""}`}
            placeholder="name@example.com"
            defaultValue={v?.email}
            required
            aria-describedby={state.errors?.email ? "email-error" : undefined}
            aria-invalid={state.errors?.email ? true : undefined}
          />
          {state.errors?.email ? (
            <p className="field-error" id="email-error">
              {state.errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="field">
        <label className="label" htmlFor="subject">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          className={`input${state.errors?.subject ? " input-invalid" : ""}`}
          placeholder="What is this about?"
          defaultValue={v?.subject}
          required
          aria-describedby={state.errors?.subject ? "subject-error" : undefined}
          aria-invalid={state.errors?.subject ? true : undefined}
        />
        {state.errors?.subject ? (
          <p className="field-error" id="subject-error">
            {state.errors.subject}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label className="label" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          className={`textarea${state.errors?.message ? " input-invalid" : ""}`}
          placeholder="Describe the process as it works today, and what you would like it to do instead."
          defaultValue={v?.message}
          required
          aria-describedby={state.errors?.message ? "message-error" : undefined}
          aria-invalid={state.errors?.message ? true : undefined}
        />
        {state.errors?.message ? (
          <p className="field-error" id="message-error">
            {state.errors.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot — hidden from people, filled by bots. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", flexWrap: "wrap" }}>
        <SubmitButton />
        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-faint)" }}>
          I reply within two working days.
        </p>
      </div>
    </form>
  );
}
