"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AiFormLockup from "@/components/AiFormLockup";
import ThemeToggle from "@/components/ThemeToggle";
import type { CityWeather } from "@/lib/weather";

const pretoriaTimeFormatter = new Intl.DateTimeFormat("en-ZA", {
  timeZone: "Africa/Johannesburg",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

// All four share Africa/Johannesburg — the rotation is about place and
// studio identity, not timezone differences, so the time itself won't change.
const cities = [
  { code: "PTA", label: "Pretoria" },
  { code: "JHB", label: "Johannesburg" },
  { code: "CPT", label: "Cape Town" },
  { code: "DBN", label: "Durban" },
];
const CITY_ROTATION_MS = 5_000;

const links = [
  { href: "/", label: "Home", section: "home" },
  { href: "/#services", label: "Services", section: "services" },
  { href: "/work", label: "Work", section: "work" },
  { href: "/journal", label: "Journal", section: "journal" },
  { href: "/#about", label: "About", section: "about" },
  { href: "/contact", label: "Contact", section: "contact" },
];

// A server-provided, cached observation populates this optional slot (see
// RootLayout). If a city's fetch failed, it's absent from the record and
// the utility falls back to plain "CITY · TIME" rather than a broken reading.
function PretoriaTime({ weather }: { weather?: CityWeather }) {
  const [time, setTime] = useState("");
  const [cityIndex, setCityIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const updateTime = () => setTime(pretoriaTimeFormatter.format(new Date()).toUpperCase());
    updateTime();
    const interval = window.setInterval(updateTime, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const interval = window.setInterval(() => {
      setCityIndex((index) => (index + 1) % cities.length);
    }, CITY_ROTATION_MS);
    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  const city = cities[reducedMotion ? 0 : cityIndex];
  const observation = weather?.[city.code as keyof CityWeather];
  const reading = observation && Number.isFinite(observation.temperature) ? observation : undefined;

  return (
    <span className="header-time" aria-label={`${city.label}${reading ? `, ${Math.round(reading.temperature)} degrees Celsius, ${reading.condition}` : ""}${time ? `, local time ${time}` : ""}`}>
      <span key={city.code} className="header-time-city">{city.code}</span>
      {reading ? <span className="header-weather" aria-hidden="true"><span>{Math.round(reading.temperature)}°</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">{reading.condition === "Clear" ? <><circle cx="12" cy="12" r="4" /><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" /></> : <><path d="M6 17a4 4 0 0 1-1-8 6 6 0 0 1 11-2 5 5 0 0 1 1 10H6Z" />{reading.condition === "Rain" ? <path d="m8 20-1 2m6-2-1 2m6-2-1 2" /> : null}</>}</svg></span> : time ? <span aria-hidden="true" className="header-time-separator">·</span> : null}
      {time ? <time key={time}>{time}</time> : null}
    </span>
  );
}

export default function Header({ weather }: { weather?: CityWeather }) {
  const pathname = usePathname();
  const [observedSection, setObservedSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection =
    pathname === "/"
      ? observedSection
      : pathname.startsWith("/work")
        ? "work"
        : pathname.startsWith("/journal")
          ? "journal"
          : pathname.startsWith("/contact")
            ? "contact"
            : "";

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const sections = links
      .map(({ section }) => document.getElementById(section))
      .filter((section): section is HTMLElement => Boolean(section));
    const visible = new Map<string, IntersectionObserverEntry>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) =>
          entry.isIntersecting
            ? visible.set(entry.target.id, entry)
            : visible.delete(entry.target.id),
        );
        const current = [...visible.values()].sort(
          (a, b) =>
            Math.abs(a.boundingClientRect.top - 96) -
            Math.abs(b.boundingClientRect.top - 96),
        )[0];
        if (current) setObservedSection(current.target.id);
      },
      { rootMargin: "-88px 0px -56% 0px", threshold: [0, 0.1, 0.25] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header className="site-header sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-sm">
      <div className="site-header-inner">
        <Link
          href="/"
          aria-label="AiForm Studio home"
          className="group flex min-h-11 items-center focus-visible:outline-offset-2"
        >
          <AiFormLockup
            product="Studio"
            variant="studio"
            compactOnMobile
            className="text-[14px] text-text transition-opacity duration-200 group-hover:opacity-80"
            markClassName="h-9 md:h-10"
          />
        </Link>
        <nav
          aria-label="Primary navigation"
          className="primary-navigation"
        >
          {links.map(({ href, label, section }) => (
            <Link
              key={section}
              href={href}
              aria-current={activeSection === section ? "location" : undefined}
              className={`nav-link ${activeSection === section ? "nav-link-active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-utilities">
          <PretoriaTime weather={weather} />
          <ThemeToggle />
          <Link href="/contact" className="header-mail" aria-label="Contact AiForm Studio">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.75 5.75h16.5v12.5H3.75zM4.5 6.5l7.5 6 7.5-6" /></svg>
          </Link>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="mobile-menu-trigger"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        className={`${menuOpen ? "grid" : "hidden"} mobile-navigation`}
      >
        {links.map(({ href, label, section }) => (
          <Link
            key={section}
            href={href}
            onClick={() => setMenuOpen(false)}
            aria-current={activeSection === section ? "location" : undefined}
            className={`mobile-nav-link ${activeSection === section ? "mobile-nav-link-active" : ""}`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
