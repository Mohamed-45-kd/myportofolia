"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/content/types";
import { ProjectCard } from "@/components/sections/shared";
import { Icon } from "@/components/ui";

/**
 * Filterable project gallery. Filtering to an empty set shows an empty state
 * that ends in an action, per the microcopy rules.
 */
export function ProjectGallery({ projects }: { projects: Project[] }) {
  const filters = useMemo(() => {
    const statuses = Array.from(new Set(projects.map((p) => p.status)));
    return ["All", ...statuses];
  }, [projects]);

  const [active, setActive] = useState("All");

  const visible =
    active === "All" ? projects : projects.filter((p) => p.status === active);

  return (
    <>
      <div
        className="filter-row"
        role="group"
        aria-label="Filter projects by status"
        style={{ marginBottom: "var(--space-8)" }}
      >
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            className={`filter-pill${active === f ? " filter-pill-active" : ""}`}
            aria-pressed={active === f}
            onClick={() => setActive(f)}
          >
            {f}
            {f !== "All" ? (
              <span style={{ marginLeft: 8, opacity: 0.6 }}>
                {projects.filter((p) => p.status === f).length}
              </span>
            ) : (
              <span style={{ marginLeft: 8, opacity: 0.6 }}>{projects.length}</span>
            )}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <div className="grid-cards">
          {visible.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <Icon name="search" size={28} />
          <p style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
            No projects with that status yet.
          </p>
          <button type="button" className="btn btn-secondary" onClick={() => setActive("All")}>
            Show all projects
          </button>
        </div>
      )}
    </>
  );
}
