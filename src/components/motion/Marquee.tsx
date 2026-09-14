"use client";

import { useEffect, useRef, useState } from "react";

export interface MarqueeTile {
  src: string;
  alt: string;
}

/**
 * Two rows of tiles that slide in opposite directions as the page scrolls.
 *
 * Sourced from real project screenshots uploaded through the dashboard, not
 * from hotlinked third-party assets. With fewer than four tiles the effect has
 * nothing to say, so the section renders nothing at all rather than showing a
 * sparse, stuttering row.
 */
export function Marquee({ tiles }: { tiles: MarqueeTile[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);

    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const top = section.getBoundingClientRect().top + window.scrollY;
      setOffset((window.scrollY - top + window.innerHeight) * 0.3);
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

  if (tiles.length < 4) return null;

  const half = Math.ceil(tiles.length / 2);
  const rowOne = tiles.slice(0, half);
  const rowTwo = tiles.slice(half);
  const shift = enabled ? offset - 200 : 0;

  return (
    <section ref={sectionRef} className="marquee" aria-label="Project screenshots">
      <Row tiles={rowOne} shift={shift} />
      <Row tiles={rowTwo} shift={-shift} />
    </section>
  );
}

function Row({ tiles, shift }: { tiles: MarqueeTile[]; shift: number }) {
  // Tripled so the strip still covers the viewport at either scroll extreme.
  const repeated = [...tiles, ...tiles, ...tiles];
  return (
    <div className="marquee-row">
      <div
        className="marquee-track"
        style={{ transform: `translate3d(${shift}px, 0, 0)`, willChange: "transform" }}
      >
        {repeated.map((tile, index) => (
          <div className="marquee-tile" key={`${tile.src}-${index}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tile.src}
              alt={index < tiles.length ? tile.alt : ""}
              aria-hidden={index >= tiles.length}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
