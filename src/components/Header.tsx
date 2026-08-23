import Link from "next/link";
import AiFormLockup from "@/components/AiFormLockup";

const links = [["/#work", "Work"], ["/#work", "Products"], ["/#studio", "Studio"], ["/journal", "Journal"], ["/contact", "Contact"]];

export default function Header() {
  return (
    <header className="flex min-h-20 items-center justify-between border-b border-line bg-bg px-6 md:px-14">
      <Link href="/" aria-label="AiForm Studio home" className="group flex min-h-11 items-center gap-3 focus-visible:outline-offset-2">
        <AiFormLockup product="Studio" variant="gold" compactOnMobile className="text-[15px] text-text transition-opacity group-hover:opacity-80" markClassName="h-10 md:h-11" />
      </Link>
      <nav aria-label="Primary navigation" className="hidden gap-9 md:flex">{links.map(([href, label]) => <Link key={label} href={href} className="text-[13px] hover:text-green">{label}</Link>)}</nav>
      <Link href="/contact" className="text-[13px] font-medium text-green md:hidden">Start a project ↗</Link>
    </header>
  );
}
