"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Magnetic hover: the wrapped element drifts toward the cursor once the cursor
 * is within `padding` pixels of its edge, then eases back when it leaves.
 *
 * Pointer-driven only. On touch devices there is no hover, so the listener is
 * never attached and the element simply sits still — which is also what happens
 * when the visitor prefers reduced motion.
 */
export function Magnet({
  children,
  padding = 150,
  strength = 3,
  className,
}: {
  children: ReactNode;
  /** How far outside the element the effect starts, in pixels. */
  padding?: number;
  /** Higher divides the pull down — 3 means it moves a third of the distance. */
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const fine = window.matchMedia("(pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;

    let frame = 0;

    const onPointerMove = (event: PointerEvent) => {
      if (frame) return; // Coalesce to one update per frame.
      frame = requestAnimationFrame(() => {
        frame = 0;
        const box = element.getBoundingClientRect();
        const centreX = box.left + box.width / 2;
        const centreY = box.top + box.height / 2;

        const withinX = Math.abs(event.clientX - centreX) < box.width / 2 + padding;
        const withinY = Math.abs(event.clientY - centreY) < box.height / 2 + padding;

        if (withinX && withinY) {
          setActive(true);
          setOffset({
            x: (event.clientX - centreX) / strength,
            y: (event.clientY - centreY) / strength,
          });
        } else if (active) {
          setActive(false);
          setOffset({ x: 0, y: 0 });
        }
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [padding, strength, active]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: active
          ? "transform var(--dur-slow) var(--ease-standard)"
          : "transform var(--dur-slower) var(--ease-out)",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
