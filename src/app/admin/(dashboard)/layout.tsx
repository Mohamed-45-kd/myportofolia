import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { isWritable } from "@/lib/db";
import { getNavCounts } from "@/lib/repo";
import { AdminShell, type NavGroup } from "../AdminShell";
import { signOut } from "../actions";

/** Never cache a page rendered behind authentication. */
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The security boundary. Middleware only checks that a cookie is present;
  // this verifies its signature and expiry.
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [counts, writable] = await Promise.all([getNavCounts(), isWritable()]);

  const groups: NavGroup[] = [
    {
      label: "Overview",
      items: [{ href: "/admin", label: "Dashboard", icon: "layout-dashboard" }],
    },
    {
      label: "Content",
      items: [
        { href: "/admin/projects", label: "Projects", icon: "folder-git", count: counts.projects },
        { href: "/admin/technologies", label: "Technologies", icon: "layers", count: counts.technologies },
        { href: "/admin/services", label: "Services", icon: "briefcase", count: counts.services },
        { href: "/admin/skills", label: "Skills", icon: "code", count: counts.skillGroups },
        { href: "/admin/experience", label: "Experience", icon: "milestone", count: counts.experience },
        { href: "/admin/education", label: "Education", icon: "graduation-cap", count: counts.education },
        { href: "/admin/achievements", label: "Achievements", icon: "trophy", count: counts.achievements },
        { href: "/admin/blog", label: "Blog posts", icon: "file-text", count: counts.posts },
      ],
    },
    {
      label: "Inbox",
      items: [
        {
          href: "/admin/messages",
          label: "Messages",
          icon: "mail",
          count: counts.messages,
          alert: counts.messages > 0,
        },
      ],
    },
    {
      label: "System",
      items: [{ href: "/admin/settings", label: "Settings", icon: "settings" }],
    },
  ];

  return (
    <AdminShell
      groups={groups}
      email={session.email}
      writable={writable}
      signOut={signOut}
    >
      {children}
    </AdminShell>
  );
}
