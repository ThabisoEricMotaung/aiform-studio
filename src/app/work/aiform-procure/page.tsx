import type { Metadata } from "next";
import Link from "next/link";

const liveProduct = "https://www.aiformprocure.co.za/";

export const metadata: Metadata = {
  title: "AiForm Procure case study | AiForm Studio",
  description:
    "How AiForm Studio is building a clearer way to discover procurement opportunities and inspect supplier readiness.",
};

const productLayers = [
  ["Discover", "A current feed of public tenders and RFQs, linked back to original sources."],
  ["Prepare", "Supplier profiles bring compliance evidence and readiness information into one place."],
  ["Assess", "SmartScore makes evidence-based supplier readiness easier to inspect."],
  ["Connect", "Buyer and supplier workflows support RFQs, matching and quote comparison."],
];

const technicalLayers = [
  ["Application", "Next.js"],
  ["Collection", "Automated public-source collectors"],
  ["Source trail", "Links back to original procurement listings"],
  ["Data quality", "Screening for cancelled and already-awarded notices"],
  ["Trust", "Supplier evidence review and verification workflows"],
];

const learnings = [
  ["Source fragmentation", "Opportunity data is spread across sources with different formats, rhythms and levels of detail."],
  ["Data quality", "A useful feed needs ongoing checks for stale, cancelled, awarded or duplicated notices."],
  ["Supplier readiness", "Finding an opportunity is only one step; suppliers also need their compliance evidence ready to inspect."],
  ["Collector reliability", "The work is operational as much as technical: sources change, so collection and review need continuous attention."],
];

export default function AiFormProcureCaseStudy() {
  return (
    <article>
      <header className="editorial-grid py-16 md:py-24 lg:py-32">
        <p className="col-span-12 chapter-label md:col-span-2">Case study 01 / AiForm Procure</p>
        <div className="col-span-12 mt-10 md:col-start-3 md:col-span-9 md:mt-0">
          <h1 className="case-study-lead">Public procurement,<br /><span className="text-green">made easier to inspect.</span></h1>
          <p className="mt-9 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
            A live South African procurement product for finding public opportunities and understanding supplier readiness.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a href={liveProduct} target="_blank" rel="noopener noreferrer" className="link-arrow" aria-label="Open AiForm Procure (opens in a new tab)">Open live product <span aria-hidden="true">↗</span></a>
            <Link href="/#work" className="text-sm font-semibold text-green">Back to selected work →</Link>
          </div>
        </div>
        <div className="case-study-meta col-span-12 mt-16 md:mt-20">
          {[["Project", "AiForm Procure"], ["Type", "Product"], ["Sector", "Procurement"], ["Status", "Live"], ["Built in", "Pretoria"]].map(([label, value]) => (
            <div key={label}><p className="text-[10px] uppercase tracking-[.1em] text-muted">{label}</p><p className="mt-2 text-sm font-semibold text-green">{value}</p></div>
          ))}
        </div>
      </header>

      <section className="case-study-section editorial-grid bg-bg-alt">
        <p className="col-span-12 chapter-label md:col-span-2">01 / The problem</p>
        <div className="col-span-12 mt-9 md:col-start-4 md:col-span-7 md:mt-0">
          <h2 className="secondary-title">The opportunity exists. The path to it is fragmented.</h2>
          <p className="case-study-copy mt-7">Public procurement notices live across different sources. Suppliers must find relevant work, check whether it is still current, prepare repeated documentation and show that their compliance evidence is ready. When those steps are disconnected, viable opportunities are easier to miss.</p>
        </div>
      </section>

      <section className="case-study-section editorial-grid">
        <p className="col-span-12 chapter-label md:col-span-2">02 / What we built</p>
        <div className="col-span-12 mt-9 md:col-start-3 md:col-span-9 md:mt-0">
          <h2 className="case-study-statement max-w-5xl">One place to discover opportunities, inspect evidence and move between supplier and buyer workflows.</h2>
          <div className="mt-14 grid border-t border-line md:grid-cols-4">
            {productLayers.map(([title, copy], index) => (
              <div key={title} className={`py-7 md:px-6 ${index ? "border-t border-line md:border-l md:border-t-0" : ""}`}><p className="chapter-label">0{index + 1} / {title}</p><p className="mt-4 text-sm leading-relaxed text-muted">{copy}</p></div>
            ))}
          </div>
          <a href={liveProduct} target="_blank" rel="noopener noreferrer" className="link-arrow mt-10">Inspect the live product <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section className="case-study-section editorial-grid bg-green text-white">
        <p className="col-span-12 chapter-label chapter-label-light md:col-span-2">03 / Under the hood</p>
        <div className="col-span-12 mt-9 md:col-start-4 md:col-span-8 md:mt-0">
          <h2 className="secondary-title text-[#e0c98f]">The machinery follows the product problem.</h2>
          <dl className="mt-10 border-t border-white/25">
            {technicalLayers.map(([term, detail]) => <div key={term} className="grid gap-2 border-b border-white/20 py-5 sm:grid-cols-[1fr_2fr]"><dt className="text-xs uppercase tracking-[.1em] text-white/60">{term}</dt><dd className="text-sm text-white/85">{detail}</dd></div>)}
          </dl>
        </div>
      </section>

      <section className="case-study-section editorial-grid">
        <p className="col-span-12 chapter-label md:col-span-2">04 / What we&apos;re learning</p>
        <div className="col-span-12 mt-9 md:col-start-3 md:col-span-9 md:mt-0">
          <h2 className="secondary-title">The product is live. The learning is ongoing.</h2>
          <div className="mt-12 grid md:grid-cols-2">
            {learnings.map(([title, copy], index) => <div key={title} className={`border-t border-line py-7 md:pr-8 ${index % 2 ? "md:border-l md:pl-8 md:pr-0" : ""}`}><h3 className="font-display text-2xl text-green">{title}</h3><p className="mt-4 text-sm leading-relaxed text-muted">{copy}</p></div>)}
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-line pt-7">
            <a href={liveProduct} target="_blank" rel="noopener noreferrer" className="link-arrow">Open live product <span aria-hidden="true">↗</span></a>
            <Link href="/#work" className="text-sm font-semibold text-green">Back to the work →</Link>
          </div>
        </div>
      </section>
    </article>
  );
}
