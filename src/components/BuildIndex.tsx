"use client";

import Link from "next/link";
import { useState } from "react";
import { projectCategories, projects, type Project, type ProjectCategory } from "@/content/projects";

type Filter = "All Work" | ProjectCategory;

const timeline = [
  ["2025", "AiForm Procure", "First internal product launched."],
  ["2026", "AiForm Studio established.", "Studio identity and operating system formalised."],
  ["2026", "AiForm Health", "Healthcare product enters pilot development."],
  ["Next", "AiForm Cruise · Construct · Legal", "The next generation of vertical products."],
];

const futureVentures = [
  ["AiForm Legal", "Compliance workflows for South African businesses."],
  ["AiForm Agriculture", "Plant pathology and biotechnology research tools."],
  ["AiForm Research", "Academic infrastructure for laboratories and research groups."],
];

function ProjectAction({ project }: { project: Project }) {
  if (!project.actionUrl) return <span className="build-action-muted">{project.actionLabel}</span>;
  const content = <>{project.actionLabel} <span aria-hidden="true">{project.externalAction ? "↗" : "→"}</span></>;
  return project.externalAction ? (
    <a href={project.actionUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.actionLabel} for ${project.name} (opens in a new tab)`}>{content}</a>
  ) : <Link href={project.actionUrl}>{content}</Link>;
}

export default function BuildIndex() {
  const [filter, setFilter] = useState<Filter>("All Work");
  const visibleProjects = projects.filter((project) => filter === "All Work" || project.category === filter);

  return (
    <section className="build-index border-t border-line py-16 md:py-24" aria-labelledby="build-index-title">
      <div className="editorial-grid">
        <p className="col-span-12 chapter-label md:col-span-2">04 / The build index</p>
        <div className="col-span-12 mt-9 md:col-start-3 md:col-span-8 md:mt-0">
          <h2 id="build-index-title" className="section-title">The Build Index</h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">A growing archive of products, client systems and experiments built by AiForm.</p>
        </div>

        <section className="build-timeline col-span-12 mt-14" aria-labelledby="timeline-title">
          <h3 id="timeline-title" className="chapter-label">Products &amp; Systems Timeline</h3>
          <div className="build-timeline-grid mt-5">
            {timeline.map(([year, title, copy]) => <div key={`${year}-${title}`} className="build-timeline-entry"><p>{year}</p><h4>{title}</h4><span>{copy}</span></div>)}
          </div>
        </section>

        <div className="col-span-12 mt-14 md:col-span-7">
          <p className="chapter-label">Current Build Index</p>
          <p className="mt-3 text-lg font-semibold text-green">{String(projects.length).padStart(2, "0")} active projects across products, client systems and experiments.</p>
          <p className="mt-2 text-sm text-muted">Updated from the AiForm Engine operating ledger.</p>
        </div>

        <div className="col-span-12 mt-9 flex flex-wrap gap-2 md:mt-12" aria-label="Filter projects">
          {projectCategories.map((category) => {
            const active = filter === category;
            return <button key={category} type="button" aria-pressed={active} onClick={() => setFilter(category)} className={`build-filter ${active ? "build-filter-active" : ""}`}>{category}</button>;
          })}
        </div>

        <div className="col-span-12 mt-4" aria-live="polite">
          <div className="build-index-header" aria-hidden="true"><span>No.</span><span>Project</span><span>Type</span><span>Sector</span><span>Status</span><span>Action</span></div>
          <ol className="build-list">
            {visibleProjects.map((project) => {
              const number = String(projects.findIndex(({ id }) => id === project.id) + 1).padStart(2, "0");
              const statusClass = project.status.toLowerCase().replaceAll(" ", "-").replace("&", "and");
              return (
                <li key={project.id} className="build-row">
                  <span className="build-number">{number}</span>
                  <div className="build-name"><span>{project.name}</span><small>{project.context}</small></div>
                  <span className="build-type">{project.type}</span>
                  <span className="build-sector">{project.sector}</span>
                  <span className={`build-status build-status-${statusClass}`}>{project.status}</span>
                  <div className="build-action"><ProjectAction project={project} /></div>
                </li>
              );
            })}
          </ol>

          <section className="drawing-board" aria-labelledby="drawing-board-title">
            <h3 id="drawing-board-title">Currently on the drawing board</h3>
            {futureVentures.map(([name, copy]) => <div key={name} className="future-row"><h4>{name}</h4><p>{copy}</p><span>Not announced</span></div>)}
          </section>
        </div>
      </div>
    </section>
  );
}
