"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Icon } from "@/components/ui";
import { savePost, type ActionState } from "../../actions";
import { SubmitButton } from "../../ConfirmButton";
import { Field, Switch } from "../../ui";
import type { PostRecord } from "@/lib/types";

const initialState: ActionState = { status: "idle" };

export function PostForm({ post }: { post?: PostRecord }) {
  const [state, formAction] = useActionState(savePost, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction}>
      {post ? <input type="hidden" name="id" value={post.id} /> : null}

      {state.status === "error" && state.message ? (
        <div className="alert alert-danger" style={{ marginBottom: "var(--space-6)" }} role="alert">
          <Icon name="close" size={18} />
          <p>{state.message}</p>
        </div>
      ) : null}

      <section className="form-section">
        <div className="form-grid form-cols-2">
          <Field
            label="Title"
            name="title"
            defaultValue={post?.title}
            placeholder="Map the process before you write the code"
            error={errors.title}
            required
          />
          <Field
            label="Slug"
            name="slug"
            defaultValue={post?.slug}
            placeholder="map-the-process-before-you-write-the-code"
            hint="Leave blank to generate from the title."
            error={errors.slug}
          />
          <Field
            label="Date"
            name="date"
            type="date"
            defaultValue={post?.date}
            error={errors.date}
            required
          />
          <Field
            label="Tag"
            name="tag"
            defaultValue={post?.tag}
            placeholder="Case study"
          />
          <Field
            label="Reading time"
            name="readingTime"
            defaultValue={post?.readingTime}
            placeholder="8 min"
            hint="Leave blank to estimate it from the length."
          />
        </div>

        <Field
          label="Excerpt"
          name="excerpt"
          defaultValue={post?.excerpt}
          placeholder="One or two sentences. Shown on the blog index and in search results."
          textarea
          rows={3}
        />

        <Field
          label="Body"
          name="body"
          defaultValue={post?.body.join("\n\n")}
          placeholder={"Separate paragraphs with a blank line.\n\n## A line starting with ## becomes a heading"}
          textarea
          rows={18}
          hint="Blank line between paragraphs. Start a line with ## for a heading."
        />

        <Switch name="published" label="Published on the site" defaultChecked={post?.published ?? false} />
      </section>

      <div className="form-sticky">
        <SubmitButton label={post ? "Save changes" : "Create post"} icon="check" />
        <Link href="/admin/blog" className="btn btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
