import type { Metadata } from "next";
import Link from "next/link";

const canonicalUrl = "https://aiformstudio.co.za/ai";
const ogImage = { url: "https://aiformstudio.co.za/images/aiform-story.png", width: 1254, height: 1254, alt: "AiForm Studio logo and its moth-inspired design origins" };
const title = "How We Use AI — AiForm Studio";
const description = "How AiForm Studio uses AI as structured assistance within human-led design, strategy and system building — applying automation only where it genuinely improves the work.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/ai" },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: canonicalUrl,
    siteName: "AiForm Studio",
    title,
    description,
    images: [ogImage],
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: [ogImage.url],
  },
};

const frameworkCategories = [
  {
    tier: "judgment",
    label: "Requires judgment",
    items: ["Strategy", "Context", "Taste", "Trade-offs", "Relationships"],
    outcome: "Human-led",
  },
  {
    tier: "assisted",
    label: "Benefits from structure",
    items: ["Research synthesis", "Pattern detection", "Repetition", "Data processing", "Testing"],
    outcome: "AI-assisted",
  },
  {
    tier: "automated",
    label: "Can be reliably systematised",
    items: ["Defined workflows", "Validation", "Classification", "Routing", "Routine operations"],
    outcome: "Automated where appropriate",
  },
] as const;

const bridgeStages = [
  ["01", "Notice", "Mostly human — noticing starts with attention, not tooling."],
  ["02", "Understand", "AI may help synthesise research and surface patterns."],
  ["03", "Structure", "AI may help stress-test assumptions and expose edge cases."],
  ["04", "Build", "AI may support implementation, testing and documentation."],
  ["05", "Evolve", "AI may help surface recurring friction from real use."],
] as const;

const practiceItems = [
  "challenge assumptions",
  "stress-test architecture",
  "surface edge cases",
  "structure complex information",
  "accelerate repetitive analysis",
  "support implementation and testing",
  "automate defined, repeatable work",
];

export default function AiPage() {
  return (
    <article>
      <header className="editorial-grid py-14 md:py-20 lg:py-24" aria-labelledby="ai-hero-title">
        <p className="col-span-12 chapter-label md:col-span-2">AI // Studio position</p>
        <div className="col-span-12 mt-8 md:col-start-4 md:col-span-6 md:mt-0">
          <h1 id="ai-hero-title" className="ai-hero-title">AI is part of the system. Judgment still leads it.</h1>
          <p className="case-study-copy mt-7">AI is useful when it helps us understand more, test more and remove unnecessary work. It is not a substitute for judgment.</p>
        </div>
        <div className="ai-hero-statement col-span-12 mt-10 md:col-start-10 md:col-span-3 md:mt-0">
          <p>We don&apos;t begin by asking where AI can be added.</p>
          <p>We begin by understanding the work.</p>
        </div>
        <div className="ai-hero-diagram-band col-span-12" aria-hidden="true">
          <svg className="ai-hero-diagram" viewBox="0 0 1200 140" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <g className="ai-hero-path" opacity="0.55">
              <path d="M10 25 Q 200 35 386 45 C 500 52 650 52 780 48 C 880 45 950 38 1000 28" strokeWidth="1.1" />
              <path d="M0 70 Q 200 70 386 70 C 520 70 660 70 780 70 C 870 70 940 70 995 68" stroke="var(--color-purple)" strokeWidth="1.1" />
              <path d="M15 118 Q 200 108 386 100 C 500 93 650 93 780 96 C 870 99 940 104 995 108" strokeWidth="1.1" />
              <path d="M20 50 Q 160 55 300 60" strokeWidth="0.9" opacity="0.7" />
              <path d="M10 95 Q 160 92 300 86" strokeWidth="0.9" opacity="0.7" />
            </g>
            <circle cx="322" cy="61" r="3" fill="currentColor" />
            <circle cx="322" cy="85" r="3" fill="currentColor" />
            <line x1="322" y1="52" x2="322" y2="70" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            <line x1="322" y1="78" x2="322" y2="94" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            <circle className="ai-hero-gate" cx="390" cy="70" r="6" fill="var(--color-bg)" strokeWidth="1.5" />
            <circle cx="1000" cy="28" r="4" fill="var(--color-gold)" />
            <circle cx="995" cy="68" r="4" fill="var(--color-gold)" />
            <circle cx="995" cy="108" r="4" fill="var(--color-gold)" />
          </svg>
        </div>
      </header>

      <section className="case-study-section editorial-grid bg-bg-alt" aria-labelledby="framework-title">
        <p className="col-span-12 chapter-label md:col-span-2">Framework // Where technology earns its place</p>
        <div className="col-span-12 mt-9 md:col-start-3 md:col-span-9 md:mt-0">
          <h2 id="framework-title" className="secondary-title">Not every problem needs the same kind of help.</h2>
          <svg className="engine-architecture-connector mt-12" viewBox="0 0 900 24" preserveAspectRatio="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
            <line x1="60" y1="12" x2="840" y2="12" stroke="var(--color-line)" strokeWidth="1" />
            <circle cx="150" cy="12" r="6" fill="var(--color-green)" />
            <circle cx="450" cy="12" r="6" fill="none" stroke="var(--color-purple)" strokeWidth="2" />
            <circle cx="750" cy="12" r="6" fill="var(--color-gold)" />
          </svg>
          <div className="ai-framework-grid">
            {frameworkCategories.map((category) => (
              <div key={category.label} className="ai-framework-category" data-tier={category.tier}>
                <span className="ai-framework-node" aria-hidden="true" />
                <h3>{category.label}</h3>
                <ul className="ai-framework-list">
                  {category.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <p className="ai-framework-outcome">{category.outcome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="case-study-section editorial-grid" aria-labelledby="rule-title">
        <p className="col-span-12 chapter-label md:col-span-2">Principle // The rule</p>
        <div className="col-span-12 mt-9 md:col-start-3 md:col-span-9 md:mt-0">
          <h2 id="rule-title" className="secondary-title">The rule is simple.</h2>
          <div className="mt-10 max-w-2xl space-y-5 text-lg leading-relaxed text-text/85">
            <p>If the problem needs judgment, we apply judgment.</p>
            <p>If structured processing can make the work faster or more reliable, AI can help.</p>
            <p>If a repeatable process can be safely automated, we build the system to handle it.</p>
          </div>
          <p className="case-study-statement mt-14 max-w-4xl border-t border-line pt-10">The technology follows the problem — not the other way around.</p>
        </div>
      </section>

      <section className="case-study-section editorial-grid bg-bg-alt" aria-labelledby="bridge-title">
        <p className="col-span-12 chapter-label md:col-span-2">System // Where AI enters the work</p>
        <div className="col-span-12 mt-9 md:col-start-3 md:col-span-9 md:mt-0">
          <h2 id="bridge-title" className="secondary-title">AI doesn&apos;t sit everywhere.</h2>
          <p className="section-intro">Its role changes depending on what the work actually needs.</p>

          <div className="ai-bridge-diagram-band mt-12" aria-hidden="true">
            <svg className="ai-bridge-diagram" viewBox="0 0 1200 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <line className="ai-bridge-spine" x1="70" y1="50" x2="1130" y2="50" strokeWidth="1.5" opacity="0.7" />
              <path className="ai-bridge-assist" d="M320 50 Q 360 30 400 50" strokeWidth="1.25" opacity="0.75" />
              <path className="ai-bridge-assist" d="M560 50 Q 600 30 640 50" strokeWidth="1.25" opacity="0.75" />
              <path className="ai-bridge-assist" d="M800 50 Q 840 30 880 50" strokeWidth="1.25" opacity="0.75" />
              <path className="ai-bridge-assist" d="M1040 50 Q 1080 30 1120 50" strokeWidth="1.25" opacity="0.6" />
              <circle className="ai-bridge-node" cx="120" cy="50" r="6" fill="var(--color-bg)" strokeWidth="1.5" />
              <circle className="ai-bridge-node" cx="360" cy="50" r="6" fill="var(--color-bg)" strokeWidth="1.5" />
              <circle className="ai-bridge-node" cx="600" cy="50" r="6" fill="var(--color-bg)" strokeWidth="1.5" />
              <circle className="ai-bridge-node" cx="840" cy="50" r="6" fill="var(--color-bg)" strokeWidth="1.5" />
              <circle cx="840" cy="50" r="11" fill="none" stroke="var(--color-gold)" strokeWidth="1" opacity="0.55" />
              <circle cx="840" cy="50" r="3" fill="var(--color-gold)" />
              <circle className="ai-bridge-node" cx="1080" cy="50" r="6" fill="var(--color-bg)" strokeWidth="1.5" />
              <g className="ai-bridge-signal-group">
                <circle className="ai-bridge-signal" r="3.5" fill="var(--color-gold)">
                  <animateMotion dur="18s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.05;0.95;1" keyPoints="0;0;1;1" path="M120 50 L1080 50" />
                  <animate attributeName="opacity" dur="18s" repeatCount="indefinite" keyTimes="0;0.05;0.95;1" values="0;1;1;0" />
                </circle>
                <circle className="ai-bridge-signal-static" cx="840" cy="50" r="3.5" fill="var(--color-gold)" />
              </g>
            </svg>
          </div>
          <p className="ai-bridge-legend">
            <span><em aria-hidden="true" style={{ background: "var(--color-green)" }} />Human judgment</span>
            <span><em aria-hidden="true" style={{ background: "var(--color-purple)" }} />AI-assisted</span>
            <span><em aria-hidden="true" style={{ background: "var(--color-gold)" }} />Automated where safe</span>
          </p>

          <div className="system-stages mt-8">
            {bridgeStages.map(([number, title, copy]) => (
              <div key={number} className="system-stage">
                <p className="chapter-label">{number}</p>
                <h3>{title}</h3>
                <p className="system-stage-copy">{copy}</p>
              </div>
            ))}
          </div>

          <Link href="/work/aiform-engine" className="text-link mt-10">See the system behind the work <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="case-study-section editorial-grid" aria-labelledby="practice-title">
        <p className="col-span-12 chapter-label md:col-span-2">Practice // What this means in the work</p>
        <div className="col-span-12 mt-9 md:col-start-3 md:col-span-8 md:mt-0">
          <h2 id="practice-title" className="secondary-title">What this looks like in the work.</h2>
          <p className="section-intro">We use configured AI systems to:</p>
          <ul className="manifesto-list mt-2">
            {practiceItems.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className="case-study-copy mt-10">We don&apos;t hand judgment to the model. The judgment remains ours — AI-assisted work stays subject to human review appropriate to the risk and context.</p>
        </div>
      </section>

      <section className="case-study-section editorial-grid deep-green-panel" aria-labelledby="closing-title">
        <p className="col-span-12 chapter-label chapter-label-light md:col-span-2">Position // Closing</p>
        <div className="col-span-12 mt-9 md:col-start-3 md:col-span-8 md:mt-0">
          <h2 id="closing-title" className="principle-title text-[#e0c98f]">We don&apos;t AI-enable broken processes.</h2>
          <div className="engine-boundary-line" aria-hidden="true"><span /><em /><span /></div>
          <p className="max-w-2xl text-lg leading-relaxed text-white/85">
            We understand the work first.<br />
            We question the assumptions underneath it.<br />
            We design the system around reality.<br />
            And then we decide where AI earns its place.
          </p>
          <p className="mt-10 text-2xl font-semibold text-[#e0c98f] md:text-3xl">Noticed, not invented.</p>
        </div>
      </section>
    </article>
  );
}
