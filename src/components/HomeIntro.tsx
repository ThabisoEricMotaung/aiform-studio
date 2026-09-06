"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { variantColors } from "@/components/AiFormLockup";
import "./HomeIntro.css";

type Phase = "idle" | "intro" | "exiting" | "done";

// ~6.5-6.7s total: gives the composition time to settle and the welcome
// text time to actually be read before exit. The Skip control means this
// is safe to let breathe — nobody who wants out has to wait for it.
const AUTO_EXIT_MS = 6000;
const EXIT_DURATION_MS = 650;
// Reduced motion stays short regardless of the normal-path duration above.
const REDUCED_AUTO_EXIT_MS = 1300;
const REDUCED_EXIT_DURATION_MS = 450;

export default function HomeIntro({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [reducedMotion, setReducedMotion] = useState(false);
  const exitTimerRef = useRef<number | null>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const decidedRef = useRef<boolean | null>(null);

  const beginExit = () => {
    if (exitTimerRef.current !== null) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
    document.body.style.overflow = "";
    // The pre-hydration attribute is what keeps the overlay visible (and the
    // homepage hidden) from first paint through the whole "intro" phase —
    // see the CSS. Clearing it here, right as the exit animation starts,
    // hands off cleanly to the phase-driven classes below with no gap.
    document.documentElement.removeAttribute("data-intro");
    setPhase((current) => (current === "intro" ? "exiting" : current));
  };

  useLayoutEffect(() => {
    // Deliberate exception, same pattern as ThemeToggle: on a genuine
    // full-page load of "/", the inline script in layout.tsx (same
    // pre-paint pattern as theme-init) has already decided this and marked
    // the session seen, before hydration — that's what avoids a first-time
    // flash of the bare homepage, and a repeat-visit flash of an intro
    // that's about to be hidden. useLayoutEffect (not useEffect) so this
    // resolves before the browser paints.
    //
    // A Next.js client-side navigation (e.g. clicking Work from Contact,
    // then Home) mounts this component without a new document load, so
    // that inline script never runs for it — fall back to the same
    // sessionStorage decision it would have made.
    //
    // The decision is captured in a ref (computed only once, on the first
    // invocation) rather than re-derived every time this effect runs: both
    // the attribute read/clear and the sessionStorage read/write are one-time
    // side effects, so re-deriving them on React's dev-only StrictMode
    // double-invoke (mount, cleanup, mount again) would see already-cleared
    // state and silently decide "don't show" the second time — leaving the
    // first pass's timer cancelled by its own cleanup and no replacement
    // scheduled.
    if (decidedRef.current === null) {
      // Deliberately NOT cleared here (only beginExit clears it) — the
      // attribute itself is what CSS uses to keep the overlay visible
      // pre-hydration, and it needs to stay in place for the CSS rule to
      // keep matching through the rest of the "intro" phase too.
      let shouldShow = document.documentElement.getAttribute("data-intro") === "show";
      if (!shouldShow) {
        try {
          if (!sessionStorage.getItem("aiform-intro-seen")) {
            sessionStorage.setItem("aiform-intro-seen", "1");
            shouldShow = true;
          }
        } catch {
          // Storage can be unavailable (private browsing, disabled storage) —
          // simplest safe fallback is to just skip the intro.
        }
      }
      decidedRef.current = shouldShow;
    }
    if (!decidedRef.current) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(reduced);
    setPhase("intro");
    document.body.style.overflow = "hidden";
    exitTimerRef.current = window.setTimeout(beginExit, reduced ? REDUCED_AUTO_EXIT_MS : AUTO_EXIT_MS);

    return () => {
      if (exitTimerRef.current !== null) window.clearTimeout(exitTimerRef.current);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (phase === "intro") skipRef.current?.focus();
  }, [phase]);

  useEffect(() => {
    if (phase !== "exiting") return;
    const t = window.setTimeout(() => setPhase("done"), reducedMotion ? REDUCED_EXIT_DURATION_MS : EXIT_DURATION_MS);
    return () => window.clearTimeout(t);
  }, [phase, reducedMotion]);

  useEffect(() => {
    if (phase !== "intro") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        beginExit();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase]);

  // The overlay is now always rendered (identical on server and first
  // client render, so there's no hydration mismatch on its own presence) —
  // visibility before hydration is handled entirely by CSS keyed off the
  // data-intro="show" attribute (see HomeIntro.css); "home-intro-live"
  // below only matters for the client-side-navigation fallback path, where
  // that attribute was never set because no fresh document load occurred.
  const introClassName = [
    "home-intro",
    phase === "intro" ? "home-intro-live" : "",
    phase === "exiting" ? "home-intro-exiting" : "",
    reducedMotion ? "home-intro-reduced" : "",
  ].filter(Boolean).join(" ");

  // Same principle for the homepage wrapper: "home-reveal-hidden" is what
  // the pre-hydration CSS rule also targets, so hydration can hand off to
  // it without changing the rendered opacity. Only the exit transition
  // needs an inline style, for its reduced-motion-dependent duration.
  const revealClassName = [
    "home-reveal",
    phase === "intro" ? "home-reveal-hidden" : "",
    phase === "exiting" ? "home-reveal-entering" : "",
  ].filter(Boolean).join(" ");
  const revealStyle: React.CSSProperties | undefined =
    phase === "exiting"
      ? { transition: `opacity ${reducedMotion ? REDUCED_EXIT_DURATION_MS : EXIT_DURATION_MS}ms ease` }
      : undefined;

  return (
    <>
      <div
        className={introClassName}
        role="dialog"
        aria-modal="true"
        aria-label="Welcome to AiForm Studio"
      >
        <div className="home-intro-stage">
          <div className="home-intro-emblem">
            <div className="home-intro-orbit" aria-hidden="true">
              <svg viewBox="0 0 320 400">
                <ellipse cx="160" cy="200" rx="132" ry="172" />
              </svg>
              <span className="home-intro-orbit-node" />
            </div>
            {/* The orbit now frames the complete Studio message, not just the
                mark — mark, eyebrow, welcome line and supporting line are one
                optically-centred group inside it. Only the locale line and
                progress mark sit outside, below. */}
            <div className="home-intro-emblem-content">
              {/* Studio identity, not Procure: the mark is the same masked-shape
                  technique AiFormMark uses for its "studio" variant, filled
                  with that exact plum (variantColors.studio) rather than the
                  raw gold artwork — gold stays reserved for the orbit node and
                  progress line below. */}
              <div className="home-intro-mark" style={{ "--intro-mark-color": variantColors.studio } as React.CSSProperties}>
                <div className="home-intro-mark-rotor">
                  <span className="home-intro-mark-shadow" aria-hidden="true" />
                  <span className="home-intro-mark-main" aria-hidden="true" />
                  <span className="home-intro-mark-sheen" aria-hidden="true" />
                </div>
                <div className="home-intro-reflection" aria-hidden="true">
                  <span className="home-intro-reflection-mark" />
                </div>
              </div>
              <p className="home-intro-eyebrow">Ideas / Systems / Impact</p>
              <p className="home-intro-title">
                <span className="home-intro-title-lead">Welcome to</span>
                <span className="home-intro-title-strong">AiForm Studio</span>
              </p>
              <p className="home-intro-supporting">Designed for expensive assumptions.</p>
            </div>
          </div>
          <p className="home-intro-locale">Pretoria, ZA</p>
          <div className="home-intro-progress" aria-hidden="true"><span /></div>
        </div>
        <button type="button" ref={skipRef} className="home-intro-skip" onClick={beginExit}>
          Skip <span aria-hidden="true">→</span>
        </button>
      </div>
      <div className={revealClassName} style={revealStyle}>
        {children}
      </div>
    </>
  );
}
