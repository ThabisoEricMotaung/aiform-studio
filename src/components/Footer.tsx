import Link from "next/link";
import AiFormLockup from "@/components/AiFormLockup";

const groups = [
  {
    title: "Explore",
    links: [
      ["/#work", "Work"],
      ["/#products", "Products"],
      ["/#system", "System"],
    ],
  },
  {
    title: "Studio",
    links: [
      ["/#studio", "About"],
      ["/journal", "Journal"],
      ["/contact", "Contact"],
    ],
  },
];

function FooterBotanical() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 460 420"
      className="pointer-events-none absolute -bottom-20 -right-20 w-[420px] text-green opacity-[.055] md:right-2 md:w-[500px]"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M430 12C344 104 293 192 262 286c-18 53-51 94-99 123" />
        <path d="M344 104c-50-12-94-3-132 29 54 11 98 1 132-29Z" />
        <path d="M293 192c46-2 86 14 119 48-51 3-91-14-119-48Z" />
        <path d="M262 286c-52-10-98 2-137 36 55 9 100-4 137-36Z" />
        <circle cx="293" cy="192" r="3" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer id="contact" className="scroll-mt-24 border-t border-line">
      <div className="editorial-grid relative overflow-hidden bg-[#F7F4EC] py-16 md:py-20">
        <FooterBotanical />
        <div className="relative z-10 col-span-12 border-b border-line pb-12 md:col-span-7 md:border-b-0 md:pb-0">
          <p className="chapter-label">Start a conversation</p>
          <h2 className="secondary-title mt-6 max-w-2xl">
            Have something worth figuring out?
          </h2>
          <p className="mt-6 max-w-xl leading-relaxed text-muted">
            We&apos;re interested in problems where information is messy,
            verification matters, and the obvious solution hasn&apos;t quite
            worked.
          </p>
          <div className="mt-8">
            <p className="chapter-label uppercase">Email</p>
            <div className="mt-4 flex flex-col items-start gap-2">
              <a href="mailto:hello@aiformstudio.co.za" className="link-arrow">
                hello@aiformstudio.co.za ↗
              </a>
              <a href="mailto:aiformstudio@gmail.com" className="link-arrow">
                aiformstudio@gmail.com ↗
              </a>
            </div>
          </div>
        </div>
        <div className="relative z-10 col-span-12 mt-10 grid grid-cols-2 gap-8 md:col-start-9 md:col-span-4 md:mt-0 md:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="chapter-label uppercase">{group.title}</p>
              <nav
                aria-label={`${group.title} links`}
                className="mt-5 flex flex-col gap-3"
              >
                {group.links.map(([href, label]) => (
                  <Link
                    key={label}
                    href={href}
                    className="text-sm text-muted transition-colors hover:text-green"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
          <div className="col-span-2 md:col-span-1">
            <p className="chapter-label uppercase">Based in</p>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              Pretoria
              <br />
              South Africa
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 bg-green px-6 py-7 text-white md:flex-row md:items-center md:justify-between md:px-14">
        <AiFormLockup
          product="Studio"
          variant="studio"
          className="text-[11px] text-white"
          markClassName="h-8"
        />
        <div className="text-xs text-white/70">
          <p>Pretoria, South Africa</p>
          <p className="mt-1 text-[10px] text-white/45">
            Union Buildings photograph: CC BY-SA / Wikimedia Commons
          </p>
        </div>
        <div className="text-xs text-white/65 md:text-right">
          <p>© {new Date().getFullYear()} AiForm Studio</p>
          <p className="mt-1 text-[#e0c98f]">Noticed, not invented.</p>
        </div>
      </div>
    </footer>
  );
}
