"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import type { IconName } from "@/content/types";

export interface NavItem {
  href: string;
  label: string;
  icon: IconName;
  count?: number;
  alert?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export function AdminShell({
  groups,
  email,
  writable,
  children,
  signOut,
}: {
  groups: NavGroup[];
  email: string;
  writable: boolean;
  children: ReactNode;
  signOut: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);

  // Remember the rail state between visits.
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem("mwj-admin-rail") === "1");
    } catch {
      /* storage unavailable — start expanded */
    }
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const toggleRail = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("mwj-admin-rail", next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const currentLabel =
    groups.flatMap((g) => g.items).find((i) => isActive(i.href))?.label ?? "Dashboard";

  return (
    <div className="admin" data-collapsed={collapsed ? "true" : "false"}>
      {open ? (
        <button
          type="button"
          className="admin-scrim"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside className="admin-sidebar" data-open={open ? "true" : "false"}>
        <div className="admin-brand">
          <span className="logo-mark" aria-hidden="true" style={{ width: 32, height: 32, fontSize: 11 }}>
            MWJ
          </span>
          <span className="admin-brand-text logo-text">
            <span className="logo-name">Dashboard</span>
            <span className="logo-role">Content manager</span>
          </span>
        </div>

        <nav className="admin-nav" aria-label="Dashboard">
          {groups.map((group) => (
            <div className="admin-group" key={group.label}>
              <p className="admin-group-label">{group.label}</p>
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-link${isActive(item.href) ? " admin-link-active" : ""}`}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon name={item.icon} size={18} />
                  <span className="admin-link-label">{item.label}</span>
                  {item.count !== undefined && item.count > 0 ? (
                    <span className={`admin-count${item.alert ? " admin-count-alert" : ""}`}>
                      {item.count}
                    </span>
                  ) : null}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-foot">
          <form action={signOut}>
            <button type="submit" className="admin-link" style={{ width: "100%", border: 0, background: "transparent", cursor: "pointer" }}>
              <Icon name="arrow-up-right" size={18} />
              <span className="admin-link-label admin-signout-label" style={{ textAlign: "left" }}>
                Sign out
              </span>
            </button>
          </form>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="icon-btn"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
            style={{ display: "inline-flex" }}
            data-mobile-only
          >
            <Icon name="menu" />
          </button>

          <button
            type="button"
            className="icon-btn"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={toggleRail}
            data-desktop-only
          >
            <Icon name={collapsed ? "chevron-right" : "menu"} />
          </button>

          <h1 className="admin-title" style={{ flex: 1 }}>
            {currentLabel}
          </h1>

          <ThemeToggle />

          <Link
            href="/"
            className="btn btn-secondary btn-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="external-link" size={14} />
            View site
          </Link>

          <span
            className="table-mono"
            style={{ display: "none" }}
            data-desktop-inline
            title={email}
          >
            {email}
          </span>
        </header>

        {!writable ? (
          <div style={{ padding: "var(--space-5) var(--space-6) 0" }}>
            <div className="alert alert-danger" role="alert">
              <Icon name="close" size={18} />
              <div>
                <p style={{ fontWeight: 600 }}>Changes cannot be saved on this host</p>
                <p style={{ marginTop: 4 }}>
                  The data directory is not writable, which is normal on a serverless
                  runtime. Connect a database before using the dashboard in production —
                  edits made now will be lost.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="admin-body">{children}</div>
      </div>
    </div>
  );
}
