"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/content/types";
import { Icon, StatusBadge, TagList } from "@/components/ui";

/**
 * Scroll-stacking project cards.
 *
 * Each card sticks below the navbar while the next one rides up over it, and
 * cards already passed shrink slightly so the stack reads as depth rather than
 * a pile. The scale is driven by how far the card has travelled past its stick
 * point, which needs a scroll listener — `position: sticky` alone cannot express it.
 *
 * Under `prefers-reduced-motion` the scaling is skipped and the cards render as
 * an ordinary vertical list.
 */
export function StackedProjects({ projects }: { projects: Project[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scales, setScales] = useState<number[]>(() => projects.map(() => 1));
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Stacking depends on sticky positioning and viewport height; on short
    // screens it fights the content, so keep it to comfortable viewports.
    if (window.innerHeight < 620) return;

    setEnabled(true);
    const container = containerRef.current;
    if (!container) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const slots = Array.from(
        container.querySelectorAll<HTMLElement>(".stack-slot"),
      );
      const viewport = window.innerHeight;

      setScales(
        slots.map((slot, index) => {
          const next = slots[index + 1];
          // The last card is never covered, so it never shrinks.
          if (!next) return 1;

          // Progress is how far the NEXT card has climbed from the bottom of
          // the viewport to this card's resting position. Measuring this card
          // instead does not work: once it sticks, its own top stops moving.
          const settled = slot.getBoundingClientRect().top;
          const approaching = next.getBoundingClientRect().top;
          const span = viewport - settled;
          if (span <= 0) return 1;

          const progress = Math.min(
            1,
            Math.max(0, (viewport - approaching) / span),
          );
          return 1 - progress * 0.08;
        }),
      );
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    // Layout is not final at hydration: fonts swap and images decode after.
    // Re-measure once those have landed so the first paint is not a guess.
    requestAnimationFrame(() => requestAnimationFrame(measure));
    document.fonts?.ready.then(measure).catch(() => undefined);
    const observer = new ResizeObserver(onScroll);
    observer.observe(document.body);
    window.addEventListener("load", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("load", onScroll);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [projects.length]);

  return (
    <div ref={containerRef} className="stack">
      {projects.map((project, index) => (
        <div
          key={project.slug}
          className="stack-slot"
          style={{ "--stack-index": index } as React.CSSProperties}
        >
          <article
            data-stack-card
            className="stack-card"
            style={{
              transform: enabled ? `scale(${scales[index] ?? 1})` : undefined,
              transformOrigin: "center top",
            }}
          >
            <div className="stack-card-head">
              <span className="stack-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="stack-meta">
                <div className="stack-meta-row">
                  <StatusBadge status={project.status} />
                  <span className="eyebrow">{project.category}</span>
                </div>
                <h3 className="stack-title">{project.title}</h3>
                <p className="stack-summary">{project.summary}</p>
                <TagList items={project.technologies.slice(0, 4)} />
              </div>

              <Link href={`/projects/${project.slug}`} className="btn btn-secondary stack-cta">
                Case study
                <Icon name="arrow-up-right" size={15} />
              </Link>
            </div>

            <div className="stack-gallery">
              {project.gallery && project.gallery.length > 0 ? (
                project.gallery.slice(0, 3).map((shot) => (
                  <div className="stack-shot" key={shot.src}>
                    {/* Uploaded images vary in size; plain img avoids layout jump. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={shot.src} alt={shot.alt} loading="lazy" />
                  </div>
                ))
              ) : (
                <div className="stack-shot stack-shot-empty">
                  <div className="grid-texture" aria-hidden="true" />
                  <span className="project-thumb-label">Screenshot</span>
                </div>
              )}
            </div>
          </article>
        </div>
      ))}
    </div>
  );
}
