"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AiFormLockup from "@/components/AiFormLockup";

const links = [
  { href: "/work", label: "Work", section: "work" },
  { href: "/#services", label: "What we build", section: "services" },
  { href: "/#system", label: "How we work", section: "system" },
  { href: "/#studio", label: "Studio", section: "studio" },
  { href: "/contact", label: "Contact", section: "contact" },
];

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
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-sm">
      <div className="flex h-[76px] items-center justify-between px-6 md:h-20 md:px-14">
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
          className="hidden items-center gap-5 lg:flex xl:gap-8"
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
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="min-h-11 min-w-11 text-right text-xs font-medium uppercase tracking-[.1em] text-green lg:hidden"
        >
          {menuOpen ? "Close" : activeSection || "Menu"}
        </button>
      </div>
      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        className={`${menuOpen ? "grid" : "hidden"} grid-cols-2 border-t border-line bg-white px-6 py-5 lg:hidden`}
      >
        {links.map(({ href, label, section }) => (
          <Link
            key={section}
            href={href}
            onClick={() => setMenuOpen(false)}
            aria-current={activeSection === section ? "location" : undefined}
            className={`min-h-11 border-b border-line py-3 text-sm ${activeSection === section ? "font-semibold text-green underline decoration-gold decoration-2 underline-offset-8" : "text-muted"}`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
