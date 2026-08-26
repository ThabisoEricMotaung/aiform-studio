"use client";

import Link from "next/link";
import { useState } from "react";
import {
  projectCategories,
  projects,
  type ProjectCategory,
} from "@/content/projects";

type Filter = "All Work" | ProjectCategory;

export default function BuildIndex() {
  const [filter, setFilter] = useState<Filter>("All Work");
  const visibleProjects = projects.filter(
    (project) => filter === "All Work" || project.category === filter,
  );

  return (
    <section className="build-index border-t border-line py-16 md:py-24" aria-labelledby="build-index-title">
      <div className="editorial-grid">
        <p className="col-span-12 chapter-label md:col-span-2">04 / The build index</p>
        <div className="col-span-12 mt-9 md:col-start-3 md:col-span-8 md:mt-0">
          <h2 id="build-index-title" className="section-title">The Build Index</h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            A growing archive of products, client systems and experiments built by AiForm.
          </p>
        </div>
        <div className="col-span-12 mt-12 flex flex-wrap gap-x-7 gap-y-3 border-b border-text" aria-label="Filter projects">
          {projectCategories.map((category) => {
            const active = filter === category;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(category)}
                className={`build-filter ${active ? "build-filter-active" : ""}`}
              >
                {category}
              </button>
            );
          })}
        </div>
        <div className="col-span-12" aria-live="polite">
          <div className="build-index-header" aria-hidden="true">
            <span>No.</span><span>Project</span><span>Type</span><span>Sector</span><span>Status</span><span>Action</span>
          </div>
          <ol className="build-list">
            {visibleProjects.map((project) => {
              const originalIndex = projects.findIndex(({ id }) => id === project.id) + 1;
              const number = String(originalIndex).padStart(2, "0");
              return (
                <li key={project.id} className="build-row">
                  <span className="build-number">{number}</span>
                  <div className="build-name">
                    <span>{project.name}</span>
                    {project.context ? <small>{project.context}</small> : null}
                  </div>
                  <span className="build-type">{project.category}</span>
                  <span className="build-sector">{project.sector}</span>
                  <span className="build-status">{project.status}</span>
                  <div className="build-action">
                    {project.caseStudyUrl ? (
                      <Link href={project.caseStudyUrl}>View case study <span aria-hidden="true">→</span></Link>
                    ) : project.liveUrl ? (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.name} (opens in a new tab)`}>Visit project <span aria-hidden="true">↗</span></a>
                    ) : (
                      <span aria-label="No public project link available">—</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
