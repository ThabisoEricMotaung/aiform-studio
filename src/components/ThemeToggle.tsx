"use client";

import { useLayoutEffect, useState } from "react";

type Theme = "light" | "dark";

function readAppliedTheme(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark" || attr === "light") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle() {
  // Deterministic first render (matches SSR output, avoids a hydration
  // mismatch); useLayoutEffect corrects it to the real applied theme
  // synchronously before paint, so there's no visible flash of the wrong icon.
  const [theme, setTheme] = useState<Theme>("light");

  useLayoutEffect(() => {
    // Deliberate exception: the point of this effect is the SSR/CSR-safe
    // "render a fixed default, correct it once mounted" pattern (the same
    // one next-themes and similar libraries use) — there's no way to read
    // the real applied theme during the initial render without risking a
    // genuine hydration mismatch, since the server can't know it.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(readAppliedTheme());
  }, []);

  useLayoutEffect(() => {
    // Only follow the OS theme live if the visitor hasn't made an explicit
    // choice — once they pick one, that choice wins until they change it.
    let stored: string | null = null;
    try {
      stored = localStorage.getItem("theme");
    } catch {
      // ignore
    }
    if (stored === "light" || stored === "dark") return;

    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      const next: Theme = event.matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      setTheme(next);
    };
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be unavailable (private browsing, disabled storage) —
      // the toggle still works for the current page view either way.
    }
    setTheme(next);
  };

  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      className="theme-toggle"
      aria-label={label}
      title={label}
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 14.7A8.5 8.5 0 0 1 9.3 4a8.5 8.5 0 1 0 10.7 10.7Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v2.2M12 18.8V21M4.93 4.93l1.56 1.56M17.5 17.5l1.56 1.56M3 12h2.2M18.8 12H21M4.93 19.07l1.56-1.56M17.5 6.5l1.56-1.56" />
        </svg>
      )}
    </button>
  );
}
