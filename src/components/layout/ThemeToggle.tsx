"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

type Theme = "dark" | "light";

/**
 * Dark is the default theme. The toggle flips `data-theme` on <html>, matching
 * the design system's light scope, and remembers the choice.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = (document.documentElement.dataset.theme as Theme) || "dark";
    setTheme(current);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("mwj-theme", next);
    } catch {
      /* storage can be unavailable — the toggle still works for this visit */
    }
  };

  return (
    <button
      type="button"
      className="icon-btn"
      onClick={toggle}
      aria-label={
        mounted
          ? `Switch to ${theme === "dark" ? "light" : "dark"} theme`
          : "Switch theme"
      }
      title="Switch theme"
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} />
    </button>
  );
}

/**
 * Runs before first paint. It applies a stored theme so a light preference does
 * not flash dark, and marks the document as scripted so the scroll-reveal
 * styles only hide content when JavaScript is actually available to show it.
 */
export const themeScript = `
(function(){document.documentElement.classList.add('js');try{var t=localStorage.getItem('mwj-theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t}}catch(e){}})();
`.trim();
