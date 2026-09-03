"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { projects, type Project } from "@/content/projects";

const visualLabels: Record<string, readonly [string, string, string]> = {
  "aiform-procure": ["Discover", "Evidence", "Readiness"],
  "aiform-health": ["Research", "Direction", "Care"],
  "private-medical-practice": ["Information", "Journey", "Contact"],
  "aiform-cruise": ["Explore", "Book", "Travel"],
  wanotuts: ["Learn", "Plan", "Book"],
  "residential-construction": ["Projects", "Craft", "Enquiries"],
  "mathabo-crochet": ["Identity", "Palette", "Templates"],
  "aiform-construct": ["Permits", "Verify", "Document"],
  "aiform-engine": ["Observe", "Structure", "Operate"],
  "procurement-knowledge-base": ["Research", "Reference", "Publish"],
};

function ProjectLink({ project }: { project: Project }) {
  if (!project.actionUrl) {
    return <span className="showcase-action showcase-action-muted">{project.actionLabel}</span>;
  }

  const content = (
    <>
      {project.actionLabel}
      <span aria-hidden="true">{project.externalAction ? "↗" : "→"}</span>
    </>
  );

  return project.externalAction ? (
    <a className="showcase-action" href={project.actionUrl} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <Link className="showcase-action" href={project.actionUrl}>{content}</Link>
  );
}

export default function ProjectShowcase() {
  const [activeId, setActiveId] = useState(projects[0].id);
  const activeProject = projects.find(({ id }) => id === activeId) ?? projects[0];
  const labels = visualLabels[activeProject.id] ?? [activeProject.type, activeProject.sector, activeProject.status];

  return (
    <section className="project-showcase border-t border-line" aria-labelledby="project-showcase-title">
      <div className="editorial-grid">
        <div className="project-showcase-heading">
          <p className="chapter-label">01 / Project index</p>
          <div>
            <h2 id="project-showcase-title" className="section-title">Move through the work.</h2>
            <p>Hover, focus or tap a project to bring its system into view.</p>
          </div>
        </div>

        <div className="project-showcase-layout">
          <ol className="project-selector" aria-label="Projects">
            {projects.map((project, index) => {
              const isActive = project.id === activeProject.id;
              return (
                <li key={project.id}>
                  <button
                    type="button"
                    className="project-selector-button"
                    aria-pressed={isActive}
                    aria-controls="active-project-stage"
                    onMouseEnter={() => setActiveId(project.id)}
                    onFocus={() => setActiveId(project.id)}
                    onClick={() => setActiveId(project.id)}
                  >
                    <span className="project-selector-number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="project-selector-copy">
                      <strong>{project.name}</strong>
                      <span>{project.category} · {project.status}</span>
                    </span>
                    <span className="project-selector-mark" aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ol>

          <div
            id="active-project-stage"
            className="project-stage"
            data-project={activeProject.id}
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="project-stage-visual" key={activeProject.id} aria-hidden="true">
              <div className="project-stage-topline">
                <span>AIFORM / {String(projects.findIndex(({ id }) => id === activeProject.id) + 1).padStart(2, "0")}</span>
                <Image src="/images/aiform-mark.png" alt="" width={42} height={42} priority={activeProject.id === projects[0].id} />
              </div>
              <div className="project-stage-orbit">
                <span className="project-stage-axis project-stage-axis-x" />
                <span className="project-stage-axis project-stage-axis-y" />
                <span className="project-stage-core">{activeProject.context}</span>
                {labels.map((label, index) => (
                  <span className={`project-stage-node project-stage-node-${index + 1}`} key={label}>{label}</span>
                ))}
              </div>
              <div className="project-stage-measure"><span>01</span><span>System view</span><span>{activeProject.sector}</span></div>
            </div>

            <div className="project-stage-content" key={activeProject.id}>
              <p className="project-stage-kicker">{activeProject.category} / {activeProject.status}</p>
              <h3>{activeProject.name}</h3>
              <p className="project-stage-context">{activeProject.context}</p>
              <p className="project-stage-summary">{activeProject.summary}</p>
              <ProjectLink project={activeProject} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
