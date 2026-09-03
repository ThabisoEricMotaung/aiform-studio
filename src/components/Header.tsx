"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AiFormLockup from "@/components/AiFormLockup";

const pretoriaTimeFormatter = new Intl.DateTimeFormat("en-ZA", {
  timeZone: "Africa/Johannesburg",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

const links = [
  { href: "/", label: "Home", section: "home" },
  { href: "/#services", label: "Services", section: "services" },
  { href: "/work", label: "Work", section: "work" },
  { href: "/journal", label: "Journal", section: "journal" },
  { href: "/#about", label: "About", section: "about" },
  { href: "/contact", label: "Contact", section: "contact" },
];

function PretoriaTime() {
  const [time, setTime] = useState("--:-- --");

  useEffect(() => {
    const updateTime = () => setTime(pretoriaTimeFormatter.format(new Date()).toUpperCase());
    updateTime();
    const interval = window.setInterval(updateTime, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <span className="header-time" aria-label={`Pretoria local time ${time}`}>
      <span>PTA</span>
      <time key={time}>{time}</time>
    </span>
  );
}

export default function Header() {
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
          <PretoriaTime />
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
