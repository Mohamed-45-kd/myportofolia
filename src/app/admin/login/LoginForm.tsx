"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signIn, type LoginState } from "./actions";
import { Icon } from "@/components/ui";

const initialState: LoginState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="btn btn-primary btn-lg"
      disabled={pending}
      style={{ width: "100%" }}
    >
      {pending ? "Signing in…" : "Sign in"}
      <Icon name="arrow-right" size={16} />
    </button>
  );
}

export function LoginForm({ from }: { from: string }) {
  const [state, formAction] = useActionState(signIn, initialState);

  return (
    <form
      action={formAction}
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}
    >
      <input type="hidden" name="from" value={from} />

      {state.error ? (
        <div className="alert alert-danger" role="alert">
          <Icon name="close" size={18} />
          <p>{state.error}</p>
        </div>
      ) : null}

      <div className="field">
        <label className="label" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="input"
          placeholder="you@example.com"
          defaultValue={state.email}
          autoComplete="username"
          required
          autoFocus
        />
      </div>

      <div className="field">
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="input"
          placeholder="••••••••••••"
          autoComplete="current-password"
          required
        />
      </div>

      <SubmitButton />
    </form>
  );
}
