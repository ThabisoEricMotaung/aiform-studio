import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Journal",
  description: "Research, observations and ideas from AiForm Studio on technology, procurement, verification and building useful systems.",
  alternates: { canonical: "/journal" },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://aiformstudio.co.za/journal",
    siteName: "AiForm Studio",
    title: "Journal | AiForm Studio",
    description: "Research, observations and ideas from AiForm Studio on technology, procurement, verification and building useful systems.",
    images: [{ url: "https://aiformstudio.co.za/images/aiform-story.png", width: 1254, height: 1254, alt: "AiForm Studio logo and its moth-inspired design origins" }],
  },
  twitter: {
    card: "summary",
    title: "Journal | AiForm Studio",
    description: "Research, observations and ideas from AiForm Studio on technology, procurement, verification and building useful systems.",
    images: ["https://aiformstudio.co.za/images/aiform-story.png"],
  },
};

export default function JournalPage() {
  return <>
    <section className="editorial-grid py-14 md:py-16">
      <div className="col-span-12 md:col-span-2"><p className="chapter-label">AiForm / Journal</p></div>
      <div className="col-span-12 mt-10 md:col-start-3 md:col-span-7 md:mt-0"><h1 className="section-title">Notes from the work.</h1><p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">Research, observations and ideas from the problems we&apos;re studying, the systems we&apos;re building, and the things we&apos;re learning along the way.</p></div>
    </section>
    <section className="editorial-grid border-t border-line bg-bg-alt py-14 md:py-16">
      <div className="col-span-12 md:col-span-2"><p className="chapter-label">Issue 00</p><p className="mt-3 text-[10px] uppercase tracking-[.12em] text-muted">Ref. AFS/J/000</p></div>
      <div className="col-span-12 mt-10 border-t border-text pt-7 md:col-start-4 md:col-span-7 md:mt-0"><h2 className="secondary-title">Content coming soon.</h2><p className="mt-7 text-lg text-muted">We&apos;re working on the first pieces now.</p><p className="mt-4 max-w-xl leading-relaxed text-muted">Procurement, technology, verification, product building and the questions that emerge between them.</p><div className="mt-10 grid grid-cols-[auto_1fr_auto] items-center gap-4 text-[10px] uppercase tracking-[.12em] text-muted"><span>Observation</span><span className="h-px bg-line"/><span>Construction</span></div></div>
      <div className="col-span-12 mt-12 md:col-start-4 md:col-span-7"><Link href="/" className="link-arrow">Return to the studio →</Link></div>
    </section>
  </>;
}
