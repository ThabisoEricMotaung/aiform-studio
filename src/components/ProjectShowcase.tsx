"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { projects, type Project } from "@/content/projects";

/**
 * Most projects now use a single complete, art-directed showcase image —
 * the artwork already contains its own device/environment/lighting, so the
 * stage only positions and sizes it. Mathabo is the one exception (its real
 * identity artwork isn't available yet), so it keeps a CSS-built stand-in.
 */
type StageVisual =
  | { kind: "showcase"; src: string; alt: string }
  | { kind: "publication"; src: string; alt: string }
  | { kind: "identity" }
  | { kind: "wordmark" };

const stageVisuals: Partial<Record<string, StageVisual>> = {
  "aiform-procure": { kind: "showcase", src: "/images/work/aiform-procure-showcase.png", alt: "AiForm Procure shown on a laptop in its real product environment" },
  wanotuts: { kind: "showcase", src: "/images/work/wanotuts-showcase.png", alt: "The WanoTuts website shown on a laptop in its brand environment" },
  "residential-construction": { kind: "showcase", src: "/images/work/residential-construction-showcase.png", alt: "The NYAUTSA SS Trading website shown on a laptop in a construction-themed setting" },
  "aiform-engine": { kind: "showcase", src: "/images/work/aiform-engine-showcase.png", alt: "A concept visual for the AiForm Engine internal operating system" },
  "aiform-health": { kind: "showcase", src: "/images/work/in-development-showcase.png", alt: "AiForm Studio — this project is in development" },
  "private-medical-practice": { kind: "showcase", src: "/images/work/private-medical-practice-showcase.png", alt: "The Dr Ugwu private medical practice website shown on a laptop in its own environment" },
  "aiform-cruise": { kind: "showcase", src: "/images/work/in-development-showcase.png", alt: "AiForm Studio — this project is in development" },
  "aiform-construct": { kind: "showcase", src: "/images/work/in-development-showcase.png", alt: "AiForm Studio — this project is in development" },
  "procurement-knowledge-base": { kind: "publication", src: "/images/work/verified-to-compete.png", alt: "Verified to Compete — the physical Procurement Knowledge Base reference guide" },
  "mathabo-crochet": { kind: "identity" },
};

function visualFor(project: Project): StageVisual {
  return stageVisuals[project.id] ?? { kind: "wordmark" };
}

/**
 * Each project's metadata accent colour, plus a shared quiet stage wash.
 * The complete showcase images already carry their own rich environments,
 * so the stage itself stays a restrained neutral — the accent only colours
 * the HTML metadata (title, case-study link) around the artwork.
 */
type ProjectTheme = { accent: string; wash: string };

const quietWash = "#f4f1ea";

const projectThemes: Partial<Record<string, ProjectTheme>> = {
  "aiform-procure": { accent: "#173b2c", wash: quietWash },
  wanotuts: { accent: "#48656f", wash: quietWash },
  "private-medical-practice": { accent: "#48656f", wash: quietWash },
  "residential-construction": { accent: "#59645d", wash: quietWash },
  "aiform-construct": { accent: "#59645d", wash: quietWash },
  "mathabo-crochet": { accent: "#6b4a3a", wash: "#f7ece7" },
  "aiform-health": { accent: "#6a596d", wash: quietWash },
  "aiform-cruise": { accent: "#3d6871", wash: quietWash },
  "aiform-engine": { accent: "#4e5861", wash: quietWash },
  "procurement-knowledge-base": { accent: "#4e5861", wash: quietWash },
};

const defaultTheme: ProjectTheme = { accent: "#173b2c", wash: quietWash };

function themeFor(project: Project): ProjectTheme {
  return projectThemes[project.id] ?? defaultTheme;
}

type StageStyle = React.CSSProperties & {
  "--stage-accent"?: string;
  "--stage-wash"?: string;
};

function stageStyleFor(theme: ProjectTheme): StageStyle {
  return { "--stage-accent": theme.accent, "--stage-wash": theme.wash };
}

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

function StageArt({ project }: { project: Project }) {
  const visual = visualFor(project);

  if (visual.kind === "wordmark") {
    return (
      <div className="project-stage-art project-stage-art-wordmark" aria-hidden="true">
        {project.category === "Experiments" ? <p className="project-stage-wordmark-flag">Experiment / in development</p> : null}
        <p className="project-stage-wordmark-name">{project.name}</p>
        <p className="project-stage-wordmark-context">{project.context}</p>
      </div>
    );
  }

  if (visual.kind === "identity") {
    return (
      <div className="project-stage-art project-stage-art-identity" aria-hidden="true">
        <div className="stage-identity-board stage-identity-board-dark">
          <p className="stage-identity-wordmark"><span className="stage-identity-matha">Matha</span><span className="stage-identity-bo">bo</span></p>
          <span className="stage-identity-rule" />
          <p className="stage-identity-tagline">Handcrafted crochet · Made to order</p>
        </div>
        <div className="stage-identity-board stage-identity-board-light">
          <p className="stage-identity-wordmark"><span className="stage-identity-matha">Matha</span><span className="stage-identity-bo">bo</span></p>
          <span className="stage-identity-rule" />
          <p className="stage-identity-tagline">Handcrafted crochet · Made to order</p>
        </div>
      </div>
    );
  }

  if (visual.kind === "publication") {
    return (
      <div className="project-stage-art project-stage-art-showcase project-stage-art-publication">
        <div className="project-showcase-image project-showcase-image-publication">
          <Image
            src={visual.src}
            alt={visual.alt}
            fill
            sizes="(min-width: 1024px) 32vw, 80vw"
            style={{ objectFit: "contain", objectPosition: "center" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="project-stage-art project-stage-art-showcase">
      <div className="project-showcase-image">
        <Image
          src={visual.src}
          alt={visual.alt}
          fill
          sizes="(min-width: 1024px) 55vw, 92vw"
          style={{ objectFit: "contain", objectPosition: "center" }}
        />
      </div>
    </div>
  );
}

/**
 * Replays a CSS enter animation (declared in the stylesheet on the element's
 * class) each time `dep` changes. We deliberately do NOT use a React `key` to
 * force a remount here — on this Next.js/React build, key-based remounts of
 * these stage elements leave the previous subtree mounted instead of
 * removing it (reproducible: old content accumulates in the DOM on every id
 * change). Restarting the declared CSS animation via a reflow avoids
 * remounting entirely. Used for the content panel and the accent wash, which
 * only ever need a single restart-and-play — the artwork itself uses
 * `useProjectVisualTransition` below, which needs a two-phase sequence.
 *
 * This must be a `useLayoutEffect`, not a `useEffect`, so the restart lands
 * before the browser's next paint rather than after it.
 */
function useReplayAnimation<T extends HTMLElement>(dep: string) {
  const ref = useRef<T>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "";
  }, [dep]);
  return ref;
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const VISUAL_LEAVE_MS = 180;
const VISUAL_ENTER_MS = 1200;

/**
 * Drives the artwork's crossfade: a brief soften of the CURRENT image, then
 * (once it's dimmed, never blank) the image swaps and the new artwork does
 * the slow editorial reveal. A flat single fade-in reads as an instant swap
 * with a barely-noticed tail — measured in-browser, the fade's easing puts
 * the image at ~94% opacity by well under half of its nominal duration, so
 * raising the duration alone doesn't buy a proportionally slower feel. The
 * dip-then-rise gives the eye an actual transition to track.
 *
 * `imageId` (what StageArt renders) intentionally lags `targetId` (what the
 * user is pointing at) by VISUAL_LEAVE_MS — the list itself and the content
 * panel react immediately; only the artwork holds back. A target change that
 * arrives mid-leave or mid-enter cancels the pending swap and restarts the
 * leave toward the newest target, so rapid hovering never queues up stale
 * transitions. Still exactly one `.project-stage-visual` / one `<img>` the
 * whole time — the leave dips the SAME node, it never duplicates it.
 */
function useProjectVisualTransition(targetId: string) {
  const [imageId, setImageId] = useState(targetId);
  const visualRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (targetId === imageId) return;
    const el = visualRef.current;
    if (!el) return;

    const reduced = prefersReducedMotion();
    if (!reduced) {
      el.style.animation = `project-stage-leave ${VISUAL_LEAVE_MS}ms ease-in both`;
    }
    // Reduced motion still routes through the timeout (0ms) rather than a
    // direct setState here, so the update stays async relative to the effect.
    const timeoutId = setTimeout(() => setImageId(targetId), reduced ? 0 : VISUAL_LEAVE_MS);
    return () => clearTimeout(timeoutId);
  }, [targetId, imageId]);

  useLayoutEffect(() => {
    const el = visualRef.current;
    if (!el) return;
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = prefersReducedMotion()
      ? ""
      : `project-stage-enter ${VISUAL_ENTER_MS}ms cubic-bezier(0.22, 1, 0.36, 1) both`;
  }, [imageId]);

  return { imageId, visualRef };
}

export default function ProjectShowcase() {
  const [selectedId, setSelectedId] = useState(projects[0].id);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const targetId = hoveredId ?? selectedId;
  const targetProject = projects.find(({ id }) => id === targetId) ?? projects[0];

  const clearHover = () => setHoveredId(null);

  // The artwork itself lags the target by a brief soften-then-swap (see
  // useProjectVisualTransition); the list highlight and the content panel
  // below react to targetId immediately.
  const { imageId, visualRef } = useProjectVisualTransition(targetId);
  const imageProject = projects.find(({ id }) => id === imageId) ?? projects[0];
  const imageIndex = projects.findIndex(({ id }) => id === imageProject.id);
  const stageStyle = stageStyleFor(themeFor(imageProject));

  const contentRef = useReplayAnimation<HTMLDivElement>(targetId);
  const washRef = useReplayAnimation<HTMLSpanElement>(imageId);

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
          <ol className="project-selector" aria-label="Projects" onMouseLeave={clearHover}>
            {projects.map((project, index) => {
              const isSelected = project.id === selectedId;
              const isDisplayed = project.id === targetProject.id;
              return (
                <li key={project.id}>
                  <button
                    type="button"
                    className="project-selector-button"
                    aria-pressed={isSelected}
                    aria-current={isDisplayed ? "true" : undefined}
                    aria-controls="active-project-stage"
                    onMouseEnter={() => setHoveredId(project.id)}
                    onFocus={() => setHoveredId(project.id)}
                    onBlur={clearHover}
                    onClick={() => {
                      setSelectedId(project.id);
                      setHoveredId(null);
                    }}
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
            data-project={targetProject.id}
            style={stageStyle}
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="project-stage-visual" ref={visualRef}>
              <div className="project-stage-topline" aria-hidden="true">
                <span>AIFORM / {String(imageIndex + 1).padStart(2, "0")}</span>
                <Image src="/images/aiform-mark.png" alt="" width={42} height={42} priority={imageProject.id === projects[0].id} />
              </div>
              <StageArt project={imageProject} />
              <span className="project-stage-wash" aria-hidden="true" ref={washRef} />
              <div className="project-stage-measure" aria-hidden="true"><span>{imageProject.status}</span><span>{imageProject.sector}</span></div>
            </div>

            <div className="project-stage-content" ref={contentRef}>
              {projects.map((project) => (
                <div key={project.id} hidden={project.id !== targetProject.id}>
                  <p className="project-stage-kicker">{project.category} / {project.status}</p>
                  <h3>{project.name}</h3>
                  <p className="project-stage-context">{project.context}</p>
                  <p className="project-stage-summary">{project.summary}</p>
                  <ProjectLink project={project} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
