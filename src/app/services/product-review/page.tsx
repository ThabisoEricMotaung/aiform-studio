import type { Metadata } from "next";
import Link from "next/link";

const title = "Product Testing & Review";
const description = "See your product from the outside. Independent product assessment across experience, function, product, market, intelligence and assumptions. Scoped per product.";
const reviewContact = "/contact?service=product-review";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/services/product-review" },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "/services/product-review",
    siteName: "AiForm Studio",
    title: `${title} | AiForm Studio`,
    description,
    images: [{ url: "/images/aiform-story.png", width: 1254, height: 1254, alt: "AiForm Studio" }],
  },
  twitter: { card: "summary", title: `${title} | AiForm Studio`, description, images: ["/images/aiform-story.png"] },
};

const lenses = [
  ["Experience", "Can people find their way?", "Journeys, clarity, friction and recovery: how the product feels to someone who does not already know how it works."],
  ["Function", "Does it do what it promises?", "Core flows, states and edge cases, including what happens when inputs, permissions or expectations change."],
  ["Product", "Is the right problem being solved?", "The value, scope and coherence of the product. What earns its place, what is missing and what adds unnecessary complexity."],
  ["Market", "How does it stand in context?", "Positioning, alternatives and competitive expectations, considered against the audience the product is intended to serve."],
  ["Intelligence", "Where does judgment belong?", "Where AI, automation or decision logic helps, where it falls short, and whether people can understand, verify or override its outputs."],
  ["Assumptions", "What are we taking for granted?", "Beliefs about users, behaviour and demand. Which have support, which need testing and what evidence would change the decision."],
] as const;

const evidence = [
  ["Observed", "Directly encountered during the review, within the access and conditions available."],
  ["Reproduced", "Repeated under documented conditions, with steps and supporting evidence."],
  ["Inferred", "An interpretation supported by the available evidence, with the reasoning made explicit."],
  ["Requires verification", "An open question that needs further access, data or testing before a conclusion can be drawn."],
] as const;

export default function ProductReviewPage() {
  return (
    <article>
      <header className="editorial-grid py-14 md:py-20 lg:py-24">
        <div className="col-span-12 md:col-span-3">
          <Link href="/#services" className="text-link"><span aria-hidden="true">←</span> Services</Link>
          <p className="chapter-label mt-8">Product Testing &amp; Review</p>
        </div>
        <div className="col-span-12 mt-8 md:col-start-4 md:col-span-9 md:mt-0">
          <h1 className="font-display max-w-4xl text-5xl leading-[1.02] tracking-tight md:text-7xl lg:text-8xl">See your product from the outside.</h1>
          <p className="section-intro">An independent assessment of what your product does, how people experience it and the assumptions it rests on. A clear basis for deciding what comes next.</p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link href={reviewContact} className="button-primary">Request a Product Review <span aria-hidden="true">→</span></Link>
            <p className="text-sm text-muted">Scoped per product.</p>
          </div>
        </div>
      </header>

      <section className="editorial-grid border-t border-line py-14 md:py-20" aria-labelledby="perspective-title">
        <p className="chapter-label col-span-12 md:col-span-3">01 // Perspective</p>
        <div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0">
          <h2 id="perspective-title" className="secondary-title">We also tell you what not to change.</h2>
          <p className="section-intro">Good judgment includes recognising what already works. We identify strengths worth preserving alongside friction, gaps and risks, so improvement does not become change for its own sake.</p>
          <p className="section-intro">This goes beyond generic QA or bug testing. A Product Review may combine journey and edge-case testing, UX and product analysis, assumption testing and competitive context. The scope follows the product and the decisions you need to make.</p>
        </div>
      </section>

      <section className="editorial-grid border-t border-line py-14 md:py-20" aria-labelledby="lenses-title">
        <p className="chapter-label col-span-12 md:col-span-3">02 // Six lenses</p>
        <div className="col-span-12 mt-8 md:col-start-4 md:col-span-9 md:mt-0">
          <h2 id="lenses-title" className="secondary-title">One product. More than one way to look.</h2>
          <p className="section-intro">We examine six connected lenses, with the depth of each agreed for your product.</p>
          <dl className="mt-10 border-t border-line">
            {lenses.map(([name, question, copy], index) => (
              <div key={name} className="grid gap-3 border-b border-line py-6 sm:grid-cols-[10rem_1fr] sm:gap-8">
                <dt className="font-display text-xl"><span className="mr-3 text-xs text-muted">0{index + 1}</span>{name}</dt>
                <dd><p className="font-medium">{question}</p><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{copy}</p></dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="editorial-grid border-t border-line py-14 md:py-20" aria-labelledby="document-title">
        <p className="chapter-label col-span-12 md:col-span-3">03 // The deliverable</p>
        <div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0">
          <h2 id="document-title" className="section-title">The Product Review</h2>
          <p className="section-intro">A decision document rather than a bug report. It connects evidence-backed findings to their implications, with prioritised recommendations and a clear account of what to preserve.</p>
          <ol className="mt-8 border-t border-line">
            {[
              ["Context & boundaries", "The product, intended audience, review questions, access and limits of the assessment."],
              ["Findings & evidence", "What we found, how we reached it, why it matters and how certain we can be."],
              ["Decisions & priorities", "What to keep, what to change, what to test next and what can wait, with the reasoning behind each recommendation."],
              ["Optional developer handover", "A walkthrough and actionable implementation notes to help your team carry agreed recommendations into the work."],
            ].map(([heading, copy]) => (
              <li key={heading} className="border-b border-line py-5"><h3 className="font-display text-xl">{heading}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{copy}</p></li>
            ))}
          </ol>
          <h3 className="font-display mt-12 text-2xl">The evidence has a label.</h3>
          <p className="mt-3 leading-relaxed text-muted">Findings distinguish what we know from what still needs checking. Uncertainty stays visible.</p>
          <dl className="mt-6">
            {evidence.map(([label, copy]) => (
              <div key={label} className="grid gap-2 border-t border-line py-4 sm:grid-cols-[11rem_1fr] sm:gap-6"><dt className="text-sm font-semibold">{label}</dt><dd className="text-sm leading-relaxed text-muted">{copy}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <section className="editorial-grid border-t border-line py-14 md:py-20" aria-labelledby="scope-title">
        <p className="chapter-label col-span-12 md:col-span-3">04 // Scope & fit</p>
        <div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0">
          <h2 id="scope-title" className="secondary-title">For products at a point of decision.</h2>
          <p className="section-intro">Before launch, after a first release or when deciding where to invest next. Suitable for web and mobile apps, SaaS, portals, internal systems, marketplaces and prototypes.</p>
          <p className="section-intro">We begin with the product, its audience and the questions you need answered. Together we agree the journeys, environments, access, review depth and timing before the assessment begins.</p>
          <div className="mt-8 border-l-2 border-line pl-6">
            <h3 className="text-sm font-semibold">Specialist work is separately scoped.</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">A Product Review does not include formal penetration testing, security or regulatory certification, exhaustive accessibility or load testing, or compliance auditing unless separately scoped.</p>
          </div>
        </div>
      </section>

      <footer className="editorial-grid border-t border-line py-14 md:py-20">
        <p className="chapter-label col-span-12 md:col-span-3">Start a conversation</p>
        <div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0">
          <h2 className="secondary-title">What would an outside perspective help you decide?</h2>
          <p className="section-intro">Tell us what you have built, who it is for and where you need clarity. Scoped per product.</p>
          <Link href={reviewContact} className="button-primary mt-8">Request a Product Review <span aria-hidden="true">→</span></Link>
        </div>
      </footer>
    </article>
  );
}
