"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import "./HomeIntro.css";

type Phase = "idle" | "intro" | "exiting" | "done";

const AUTO_EXIT_MS = 3000;
const EXIT_DURATION_MS = 650;
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
      let shouldShow = document.documentElement.getAttribute("data-intro") === "show";
      document.documentElement.removeAttribute("data-intro");
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

  const showOverlay = phase === "intro" || phase === "exiting";
  const revealStyle: React.CSSProperties | undefined =
    phase === "exiting"
      ? { opacity: 1, transition: `opacity ${reducedMotion ? REDUCED_EXIT_DURATION_MS : EXIT_DURATION_MS}ms ease` }
      : phase === "intro"
        ? { opacity: 0.96 }
        : undefined;

  return (
    <>
      {showOverlay ? (
        <div
          className={[
            "home-intro",
            phase === "exiting" ? "home-intro-exiting" : "",
            reducedMotion ? "home-intro-reduced" : "",
          ].filter(Boolean).join(" ")}
          role="dialog"
          aria-modal="true"
          aria-label="Welcome to AiForm Studio"
        >
          <div className="home-intro-stage">
            <div className="home-intro-orbit" aria-hidden="true">
              <svg viewBox="0 0 400 400">
                <ellipse cx="200" cy="200" rx="180" ry="148" />
              </svg>
              <span className="home-intro-orbit-node" />
            </div>
            <div className="home-intro-mark">
              <div className="home-intro-mark-rotor">
                <Image src="/images/aiform-mark.png" alt="" aria-hidden="true" width={472} height={588} className="home-intro-mark-shadow" priority />
                <Image src="/images/aiform-mark.png" alt="" aria-hidden="true" width={472} height={588} className="home-intro-mark-main" priority />
                <span className="home-intro-mark-sheen" aria-hidden="true" />
              </div>
              <div className="home-intro-reflection" aria-hidden="true">
                <Image src="/images/aiform-mark.png" alt="" width={472} height={588} />
              </div>
            </div>
            <p className="home-intro-eyebrow">Ideas / Systems / Impact</p>
            <p className="home-intro-title">
              <span className="home-intro-title-lead">Welcome to</span>
              <span className="home-intro-title-strong">AiForm Studio</span>
            </p>
            <p className="home-intro-supporting">Designed for expensive assumptions.</p>
            <p className="home-intro-locale">Pretoria, ZA</p>
            <div className="home-intro-progress" aria-hidden="true"><span /></div>
          </div>
          <button type="button" ref={skipRef} className="home-intro-skip" onClick={beginExit}>
            Skip <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : null}
      <div className="home-reveal" style={revealStyle}>
        {children}
      </div>
    </>
  );
}
