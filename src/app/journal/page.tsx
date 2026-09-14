import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedEntries } from "@/content/journal";

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
  const entries = getPublishedEntries();
  return <>
    <section className="editorial-grid py-14 md:py-16">
      <div className="col-span-12 md:col-span-2"><p className="chapter-label">AiForm / Journal</p></div>
      <div className="col-span-12 mt-10 md:col-start-3 md:col-span-7 md:mt-0"><h1 className="section-title">Notes from the work.</h1><p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">Research, observations and ideas from the problems we&apos;re studying, the systems we&apos;re building, and the things we&apos;re learning along the way.</p></div>
    </section>
    <section className="editorial-grid border-t border-line bg-bg-alt py-14 md:py-16" aria-label="Journal articles">
      <div className="col-span-12 md:col-span-2"><p className="chapter-label">Field notes</p><p className="mt-3 text-[10px] uppercase tracking-[.12em] text-muted">AiForm / Journal</p></div>
      <div className="col-span-12 mt-10 md:col-start-4 md:col-span-7 md:mt-0">
        {entries.length ? entries.map((entry) => (
          <article key={entry.slug} className="border-t border-text py-7 first:pt-7">
            <p className="chapter-label">{entry.category} / {entry.publishedAt} / {entry.readingTime}</p>
            <h2 className="secondary-title mt-6"><Link href={`/journal/${entry.slug}`} className="transition-colors hover:text-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">{entry.title}</Link></h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{entry.excerpt}</p>
            <Link href={`/journal/${entry.slug}`} className="link-arrow mt-7" aria-label={`Read ${entry.title}`}>Read field note →</Link>
          </article>
        )) : <p className="border-t border-text pt-7 text-lg text-muted">New field notes are in progress.</p>}
      </div>
    </section>
  </>;
}
