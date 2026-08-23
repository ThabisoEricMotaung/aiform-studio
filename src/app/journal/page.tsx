import type { Metadata } from "next";
import Link from "next/link";
import { MothGeometryStudy } from "@/components/BrandLineArt";

export const metadata: Metadata = {
  title: "Journal | AiForm Studio",
  description: "Research, observations and ideas from AiForm Studio on technology, procurement, verification and building useful systems.",
};

export default function JournalPage() {
  return <>
    <section className="editorial-grid relative overflow-hidden py-24 md:py-36">
      <div className="col-span-12 md:col-span-2"><p className="chapter-label">AiForm / Journal</p></div>
      <div className="col-span-12 mt-10 md:col-start-3 md:col-span-7 md:mt-0"><h1 className="section-title">Notes from the work.</h1><p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">Research, observations and ideas from the problems we&apos;re studying, the systems we&apos;re building, and the things we&apos;re learning along the way.</p></div>
      <div aria-hidden="true" className="col-span-6 col-start-7 mt-14 max-h-64 overflow-hidden opacity-[.07] md:absolute md:-right-10 md:-top-8 md:mt-0 md:w-[360px]"><MothGeometryStudy /></div>
    </section>
    <section className="editorial-grid border-t border-line bg-bg-alt py-24 md:py-36">
      <div className="col-span-12 md:col-span-2"><p className="chapter-label">Issue 00</p><p className="mt-3 text-[10px] uppercase tracking-[.12em] text-muted">Ref. AFS/J/000</p></div>
      <div className="col-span-12 mt-12 border-t border-text pt-7 md:col-start-4 md:col-span-7 md:mt-0"><h2 className="secondary-title">Content coming soon.</h2><p className="mt-7 text-lg text-muted">We&apos;re working on the first pieces now.</p><p className="mt-4 max-w-xl leading-relaxed text-muted">Procurement, technology, verification, product building and the questions that emerge between them.</p><div className="mt-16 grid grid-cols-[auto_1fr_auto] items-center gap-4 text-[10px] uppercase tracking-[.12em] text-muted"><span>Observation</span><span className="h-px bg-line"/><span>Construction</span></div></div>
      <div className="col-span-12 mt-20 md:col-start-4 md:col-span-7"><Link href="/" className="link-arrow">Return to the studio →</Link></div>
    </section>
  </>;
}
