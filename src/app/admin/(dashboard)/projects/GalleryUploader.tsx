"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui";

/**
 * Gallery editor with a real file picker.
 *
 * Files upload as soon as they are chosen, so the editor shows a thumbnail
 * immediately and the form only ever carries the resulting URL. That also means
 * a failed upload is reported at the point of choosing rather than being
 * discovered when the whole project fails to save.
 *
 * Typing a path by hand still works — useful for images already in `public/`
 * or hosted elsewhere.
 */

interface Row {
  src: string;
  alt: string;
  /** Transient UI state, never submitted. */
  status?: "uploading" | "error";
  message?: string;
}

export function GalleryUploader({ initial }: { initial: { src: string; alt: string }[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const update = (index: number, patch: Partial<Row>) =>
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (list.length === 0) return;

    // Add a placeholder row per file so progress is visible immediately.
    const startIndex = rows.length;
    setRows((current) => [
      ...current,
      ...list.map((file) => ({
        src: "",
        alt: "",
        status: "uploading" as const,
        message: file.name,
      })),
    ]);

    await Promise.all(
      list.map(async (file, offset) => {
        const index = startIndex + offset;
        const body = new FormData();
        body.append("file", file);

        try {
          const response = await fetch("/api/admin/upload", { method: "POST", body });
          const result = await response.json();

          if (!response.ok) {
            update(index, { status: "error", message: result.error ?? "Upload failed." });
            return;
          }

          update(index, {
            src: result.url,
            // A sensible starting alt text from the filename; editable below.
            alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
            status: undefined,
            message: undefined,
          });
        } catch {
          update(index, { status: "error", message: "Upload failed — check your connection." });
        }
      }),
    );
  }

  function onDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files?.length) void uploadFiles(event.dataTransfer.files);
  }

  return (
    <div className="field">
      <label className="label">Gallery images</label>

      {/* Only completed rows are submitted. */}
      {rows
        .filter((row) => row.src)
        .map((row, index) => (
          <input key={`hidden-${index}`} type="hidden" name="galleryUrl" value={row.src} />
        ))}
      {rows
        .filter((row) => row.src)
        .map((row, index) => (
          <input key={`hidden-alt-${index}`} type="hidden" name="galleryAlt" value={row.alt} />
        ))}

      <div
        className={`dropzone${dragging ? " dropzone-active" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <Icon name="download" size={22} />
        <p style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>
          Choose images from your device
        </p>
        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-faint)" }}>
          or drag them here — JPEG, PNG, WebP, AVIF or GIF, up to 8 MB each
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) void uploadFiles(e.target.files);
            e.target.value = ""; // Allow re-picking the same file.
          }}
        />
      </div>

      {rows.length > 0 ? (
        <div className="gallery-rows">
          {rows.map((row, index) => (
            <div className="gallery-row" key={index}>
              <div className="gallery-thumb">
                {row.status === "uploading" ? (
                  <span className="thumb-note">Uploading…</span>
                ) : row.status === "error" ? (
                  <span className="thumb-note thumb-note-error">Failed</span>
                ) : row.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={row.src} alt="" />
                ) : (
                  <span className="thumb-note">No image</span>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                {row.status === "error" ? (
                  <p className="field-error">{row.message}</p>
                ) : (
                  <>
                    <input
                      className="input"
                      value={row.alt}
                      placeholder="Describe the image"
                      aria-label={`Description for image ${index + 1}`}
                      onChange={(e) => update(index, { alt: e.target.value })}
                    />
                    <input
                      className="input"
                      value={row.src}
                      placeholder="/projects/screenshot.png or paste a URL"
                      aria-label={`Path for image ${index + 1}`}
                      onChange={(e) => update(index, { src: e.target.value })}
                      style={{
                        marginTop: "var(--space-2)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "var(--text-xs)",
                      }}
                    />
                  </>
                )}
              </div>

              <button
                type="button"
                className="icon-btn"
                aria-label={`Remove image ${index + 1}`}
                onClick={() => setRows((r) => r.filter((_, i) => i !== index))}
              >
                <Icon name="close" size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <p className="hint">
        Uploads are stored in the site&apos;s database, not in the project folder, so
        they survive a redeploy. Leave this empty to show the grid placeholder.
      </p>
    </div>
  );
}
