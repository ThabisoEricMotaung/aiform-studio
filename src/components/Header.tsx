import Image from "next/image";
import Link from "next/link";

const links = [["/#work", "Work"], ["/#work", "Products"], ["/#studio", "Studio"], ["/journal", "Journal"], ["/contact", "Contact"]];

export default function Header() {
  return (
    <header className="flex min-h-20 items-center justify-between border-b border-line bg-bg px-6 md:px-14">
      <Link href="/" aria-label="AiForm Studio home" className="group flex min-h-11 items-center gap-3 focus-visible:outline-offset-2">
        <Image src="/images/aiform-mark.png" alt="" width={472} height={588} sizes="30px" className="h-8 w-auto transition-opacity group-hover:opacity-80 md:h-9" />
        <span className="hidden text-[12px] font-semibold tracking-[.13em] text-text sm:block">AIFORM <span className="font-normal text-muted">/ STUDIO</span></span>
      </Link>
      <nav aria-label="Primary navigation" className="hidden gap-9 md:flex">{links.map(([href, label]) => <Link key={label} href={href} className="text-[13px] hover:text-green">{label}</Link>)}</nav>
      <Link href="/contact" className="text-[13px] font-medium text-green md:hidden">Start a project ↗</Link>
    </header>
  );
}
