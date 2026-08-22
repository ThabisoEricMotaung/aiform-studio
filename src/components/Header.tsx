import Link from "next/link";

const NAV_LINKS = [
  { href: "/#engine", label: "Engine" },
  { href: "/#work", label: "Work" },
  { href: "/#next", label: "Where We Look Next" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-panel-line bg-bg/95 backdrop-blur sticky top-0 z-50">
      <Link href="/" className="font-display font-bold text-lg tracking-tight text-text">
        AiForm<span className="text-cyan">Studio</span>
      </Link>
      <nav className="hidden md:flex gap-8">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-mono text-[11px] tracking-[0.1em] uppercase text-muted hover:text-cyan transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <Link
        href="/contact"
        className="font-mono text-[11px] tracking-[0.08em] uppercase border border-cyan text-cyan px-4 py-2.5 hover:bg-cyan hover:text-bg transition-colors"
      >
        Start a project
      </Link>
    </header>
  );
}
