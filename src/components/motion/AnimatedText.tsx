"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-linked character reveal: each character lifts from dim to full as the
 * paragraph travels up the viewport.
 *
 * Accessibility notes, both deliberate:
 *  - The full sentence is rendered once as real text; the per-character spans
 *    are `aria-hidden`, so a screen reader reads a sentence rather than
 *    spelling it out letter by letter.
 *  - Under `prefers-reduced-motion` the text renders plainly at full opacity
 *    and no scroll listener is attached.
 */
export function AnimatedText({
  text,
  className,
  /** Dimmest a character gets before it is revealed. */
  from = 0.2,
}: {
  text: string;
  className?: string;
  from?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setEnabled(true);
    let frame = 0;

    const measure = () => {
      frame = 0;
      const box = element.getBoundingClientRect();
      const viewport = window.innerHeight;
      // 0 when the top edge reaches 80% down the viewport,
      // 1 by the time the bottom edge is 20% down it.
      const start = viewport * 0.8;
      const end = viewport * 0.2;
      const travelled = start - box.top;
      const distance = start - end + box.height;
      setProgress(Math.min(1, Math.max(0, travelled / distance)));
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
  }, []);

  const characters = Array.from(text);

  return (
    <p ref={ref} className={className}>
      {/* Read by assistive tech; the animated copy below is decorative. */}
      <span className="sr-only">{text}</span>

      <span aria-hidden="true">
        {characters.map((character, index) => {
          // Each character has its own slice of the scroll range, so the reveal
          // sweeps left to right instead of fading in as one block.
          const point = index / characters.length;
          const lit = enabled
            ? Math.min(1, Math.max(0, (progress - point) * characters.length * 0.6))
            : 1;
          return (
            <span
              key={index}
              style={{
                opacity: from + (1 - from) * lit,
                transition: "opacity 120ms linear",
              }}
            >
              {character}
            </span>
          );
        })}
      </span>
    </p>
  );
}
