"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * A short rise on scroll — the only scroll-linked motion in the system.
 * No parallax, no scroll-jacking; `prefers-reduced-motion` is handled in CSS,
 * and the content is visible from the first paint if the observer never fires.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    observer.observe(el);

    // Safety net: if the observer never reports an intersection — a page that
    // is never painted, a background tab restored from cache — show the content
    // anyway. Content must never be permanently stuck at opacity 0.
    const fallback = window.setTimeout(() => {
      setVisible(true);
      observer.disconnect();
    }, 1500);

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={["reveal", visible ? "is-visible" : "", className]
        .filter(Boolean)
        .join(" ")}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
