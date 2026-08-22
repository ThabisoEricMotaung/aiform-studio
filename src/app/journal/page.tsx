import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Journal | AiForm Studio", description: "Notes from AiForm Studio on research, verification, products, and the problems worth noticing." };

export default function JournalPage() {
  return (
    <section className="min-h-[70vh] px-6 py-24 md:py-32"><div className="max-w-4xl mx-auto"><p className="chapter-label mb-7">Journal / Coming soon</p><h1 className="font-display text-5xl md:text-7xl leading-[0.98] max-w-3xl">Notes on what we notice, <em className="text-green">test, and learn.</em></h1><p className="text-muted text-lg leading-relaxed mt-8 max-w-xl">The journal will hold field notes from the studio: problems worth investigating, claims worth testing, and lessons from building in public.</p><div className="rule-gold mt-10" /><Link href="/" className="inline-block mt-10 text-sm text-green border-b border-green/40 pb-1 hover:border-green">Return to the studio →</Link></div></section>
  );
}
