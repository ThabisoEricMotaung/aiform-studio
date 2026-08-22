import Link from "next/link";

const NAV_LINKS = [
  { href: "/#engine", label: "The Engine" },
  { href: "/#work", label: "Built by AiForm" },
  { href: "/#founder", label: "Founder" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 md:px-14 py-6 border-b border-line bg-bg">
      <Link href="/" className="flex items-baseline gap-1"><span className="font-sans font-semibold text-[13px] tracking-[0.1em] text-green">AIFORM</span><span className="font-sans text-[13px] tracking-[0.1em] text-muted">/ STUDIO</span></Link>
      <nav className="hidden md:flex gap-9">{NAV_LINKS.map((link) => <Link key={link.href} href={link.href} className="font-sans text-[13px] text-text/80 hover:text-green transition-colors">{link.label}</Link>)}</nav>
      <Link href="/contact" className="font-sans text-[13px] text-green border-b border-green/40 hover:border-green transition-colors pb-0.5">Start a project →</Link>
    </header>
  );
}
