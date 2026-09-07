"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { ThemeToggle } from "./ThemeToggle";

function Logo() {
  return (
    <Link href="/" className="logo" aria-label={`${site.name} — home`}>
      <span className="logo-mark" aria-hidden="true">
        {site.shortName}
      </span>
      <span className="logo-text">
        <span className="logo-name">{site.name}</span>
        <span className="logo-role">Software &amp; Web Developer</span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock the page behind the open mobile menu.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className={`navbar${scrolled || open ? " navbar-scrolled" : ""}`}>
        <div className="shell navbar-inner">
          <Logo />

          <nav className="nav-links" aria-label="Main">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link${isActive(item.href) ? " nav-link-active" : ""}`}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <ThemeToggle />
            {/* Points at /admin, not /admin/login: signed in it opens the
                dashboard, signed out the middleware sends it to the sign-in
                screen. Either way the public layout stays static. */}
            <Link
              href="/admin"
              className="icon-btn"
              aria-label="Admin sign in"
              title="Admin"
            >
              <Icon name="lock" size={18} />
            </Link>
            <Link
              href="/contact"
              className="btn btn-primary btn-sm cta-desktop"
            >
              Let&apos;s work together
            </Link>
            <button
              type="button"
              className="icon-btn menu-toggle"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <Icon name={open ? "close" : "menu"} />
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div className="nav-mobile" id="mobile-menu">
          <div className="shell">
            <nav aria-label="Mobile">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-mobile-link${
                    isActive(item.href) ? " nav-mobile-link-active" : ""
                  }`}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                  <Icon name="chevron-right" size={16} />
                </Link>
              ))}
            </nav>
            <Link
              href="/contact"
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "var(--space-6)" }}
            >
              Let&apos;s work together
            </Link>
            <Link
              href="/admin"
              className="btn btn-ghost"
              style={{ width: "100%", marginTop: "var(--space-3)" }}
            >
              <Icon name="lock" size={16} />
              Admin sign in
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
