import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s — Dashboard" },
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Bare wrapper for everything under /admin.
 *
 * The sign-in screen lives here and must NOT be behind the session guard, so
 * the guard and the dashboard shell sit one level down in `(dashboard)/`.
 * The route group does not appear in the URL.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
