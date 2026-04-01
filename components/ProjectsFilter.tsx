"use client";

import { useState } from "react";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import type { Project, ProjectCategory } from "@/sanity/types";

function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={`/projects/${project.slug.current}`}
      className="group block bg-surface rounded overflow-hidden border border-border hover:border-primary hover:bg-surface-hover transition-all"
      aria-label={`View project: ${project.title}`}
    >
      {project.image && (
        <div className="overflow-hidden aspect-video">
          <Image
            src={urlFor(project.image).width(480).height(270).url()}
            alt={project.title}
            width={480}
            height={270}
            className="w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-[family-name:var(--font-serif)] text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          {project.clientName && (
            <span className="text-[10px] bg-accent/15 text-accent px-2 py-0.5 rounded font-medium whitespace-nowrap flex-shrink-0 mt-0.5">
              {project.clientName}
            </span>
          )}
        </div>
        {project.summary && (
          <p className="text-muted text-sm line-clamp-3 mb-3">{project.summary}</p>
        )}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech._id}
                className="text-[10px] text-muted bg-bg px-2 py-0.5 rounded border border-border"
              >
                {tech.name}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="text-[10px] text-muted px-1">+{project.technologies.length - 4}</span>
            )}
          </div>
        )}
        <span className="text-sm text-primary font-medium">View →</span>
      </div>
    </a>
  );
}

type FilterKey = "all" | "personal" | "freelance" | string;

interface Props {
  projects: Project[];
  projectCategories: ProjectCategory[];
}

export default function ProjectsFilter({ projects, projectCategories }: Props) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const personalProjects = projects.filter(
    (p) => !p.projectType || p.projectType === "personal"
  );
  const freelanceProjects = projects.filter((p) => p.projectType === "freelance");

  // Count projects per category
  const categoryCounts: Record<string, number> = {};
  for (const project of projects) {
    if (project.categories) {
      for (const cat of project.categories) {
        categoryCounts[cat._id] = (categoryCounts[cat._id] || 0) + 1;
      }
    }
  }

  // Determine which projects to show
  let filteredProjects: Project[];
  let sectionTitle: string;

  if (activeFilter === "all") {
    filteredProjects = projects;
    sectionTitle = "All Projects";
  } else if (activeFilter === "personal") {
    filteredProjects = personalProjects;
    sectionTitle = "Personal Projects";
  } else if (activeFilter === "freelance") {
    filteredProjects = freelanceProjects;
    sectionTitle = "Freelance Work";
  } else {
    // Category filter
    filteredProjects = projects.filter(
      (p) => p.categories?.some((c) => c._id === activeFilter)
    );
    const cat = projectCategories.find((c) => c._id === activeFilter);
    sectionTitle = cat?.title || "Projects";
  }

  const hasBothTypes = personalProjects.length > 0 && freelanceProjects.length > 0;
  const hasCategories = projectCategories.length > 0;

  return (
    <div className="flex gap-12">
      {/* Sidebar */}
      {(hasBothTypes || hasCategories) && (
        <nav className="hidden lg:block w-52 flex-shrink-0">
          <div className="sticky top-28 space-y-6">
            {/* Type filter */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-muted mb-3">Type</h3>
              <ul className="space-y-0.5">
                {[
                  { key: "all" as FilterKey, label: "All", count: projects.length },
                  ...(personalProjects.length > 0
                    ? [{ key: "personal" as FilterKey, label: "Personal", count: personalProjects.length }]
                    : []),
                  ...(freelanceProjects.length > 0
                    ? [{ key: "freelance" as FilterKey, label: "Freelance", count: freelanceProjects.length }]
                    : []),
                ].map((item) => (
                  <li key={item.key}>
                    <button
                      onClick={() => setActiveFilter(item.key)}
                      className={`w-full flex items-center justify-between py-1.5 px-3 rounded text-sm transition-colors text-left ${
                        activeFilter === item.key
                          ? "text-foreground bg-surface-hover font-medium"
                          : "text-muted hover:text-foreground hover:bg-surface"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-xs text-muted/60">{item.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Category filter */}
            {hasCategories && (
              <div>
                <h3 className="text-xs uppercase tracking-wider text-muted mb-3">Categories</h3>
                <ul className="space-y-0.5">
                  {projectCategories.map((cat) => {
                    const count = categoryCounts[cat._id] || 0;
                    if (count === 0) return null;
                    return (
                      <li key={cat._id}>
                        <button
                          onClick={() => setActiveFilter(cat._id)}
                          className={`w-full flex items-center justify-between py-1.5 px-3 rounded text-sm transition-colors text-left ${
                            activeFilter === cat._id
                              ? "text-foreground bg-surface-hover font-medium"
                              : "text-muted hover:text-foreground hover:bg-surface"
                          }`}
                        >
                          <span>{cat.title}</span>
                          <span className="text-xs text-muted/60">{count}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </nav>
      )}

      {/* Project grid */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-3 mb-8">
          <h2 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl font-bold text-foreground">
            {sectionTitle}
          </h2>
          <span className="text-sm text-muted">{filteredProjects.length}</span>
        </div>

        {filteredProjects.length === 0 ? (
          <p className="text-muted text-base py-12">No projects in this category yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <ScrollReveal key={project._id}>
                <ProjectCard project={project} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
