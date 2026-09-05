import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/content/projects";

const canonicalUrl = "https://aiformstudio.co.za/work/aiform-engine";
const ogImage = { url: "https://aiformstudio.co.za/images/aiform-story.png", width: 1254, height: 1254, alt: "AiForm Studio logo and its moth-inspired design origins" };

export const metadata: Metadata = {
  title: "AiForm Engine | The operating system behind the work",
  description: "Explore the conceptual architecture behind AiForm Studio's approach to research, systems, automation and digital product development.",
  alternates: { canonical: "/work/aiform-engine" },
  openGraph: {
    type: "article",
    locale: "en_ZA",
    url: canonicalUrl,
    siteName: "AiForm Studio",
    title: "AiForm Engine — The operating system behind AiForm Studio",
    description: "Explore the conceptual architecture behind AiForm Studio's approach to research, systems, automation and digital product development.",
    images: [ogImage],
  },
  twitter: {
    card: "summary",
    title: "AiForm Engine | AiForm Studio",
    description: "Explore the conceptual architecture behind AiForm Studio's approach to research, systems, automation and digital product development.",
    images: [ogImage.url],
  },
};

const projectMeta = [
  ["Project", "AiForm Engine"],
  ["Type", "Experiment"],
  ["Sector", "AI Infrastructure"],
  ["Status", "Active"],
  ["Studio", "AiForm Studio"],
];

const architectureStages = [
  { name: "Understand", items: ["Problems", "Research", "Workflows", "Requirements"] },
  { name: "Structure", items: ["Knowledge", "Rules", "Data", "Patterns"] },
  { name: "Build", items: ["Interfaces", "Systems", "Automation", "Integrations"] },
  { name: "Operate", items: ["Deploy", "Observe", "Improve", "Reuse"] },
] as const;

const inputs = [
  ["Ideas", "What someone wants to make possible."],
  ["Research", "What we need to understand before deciding."],
  ["Workflows", "How the work actually happens today."],
  ["Requirements", "What the system genuinely needs to do."],
  ["Knowledge", "Domain information the system needs to understand."],
  ["Brand", "How the finished experience should feel and communicate."],
] as const;

const capabilities = [
  ["01", "Knowledge", "Organises relevant context so it can be reused rather than rediscovered."],
  ["02", "Intelligence", "Helps systems interpret information and assist with appropriate decisions."],
  ["03", "Automation", "Turns repeatable work into dependable workflows."],
  ["04", "Integration", "Connects products to the services and data they actually need."],
  ["05", "Patterns", "Carries proven approaches from one build into the next without turning every project into a template."],
  ["06", "Guardrails", "Defines where automation helps, where verification matters and where people remain in control."],
] as const;

const outputs = [
  ["Websites", "Public digital experiences built around a clear purpose."],
  ["Business Systems", "Tools that replace fragmented processes and manual administration."],
  ["Dashboards", "Useful operational information brought into one place."],
  ["Automation", "Repeatable work handled consistently."],
  ["Integrations", "Systems that exchange information instead of creating another silo."],
  ["Digital Products", "Purpose-built software where an off-the-shelf tool doesn't fit."],
] as const;

const boundaries = [
  ["Not a template library.", "Projects don't begin with a predetermined answer."],
  ["Not an AI wrapper.", "AI is one capability within the system, not the reason the system exists."],
  ["Not a black box.", "Decisions still need context, verification and human judgement."],
  ["Not finished.", "The Engine evolves as the Studio learns from real builds."],
] as const;

const principles = [
  ["01 / Context before code", "Understand the work before deciding what to build."],
  ["02 / Systems before features", "Solve the underlying workflow, not just the visible symptom."],
  ["03 / Automate with intent", "Use automation where it removes meaningful friction."],
  ["04 / Learn from every build", "Carry useful knowledge forward without forcing the next project into the last one's shape."],
] as const;

const proofIds = ["aiform-procure", "wanotuts", "residential-construction", "private-medical-practice"] as const;
const proofImages: Record<(typeof proofIds)[number], { src: string; alt: string }> = {
  "aiform-procure": { src: "/images/work/aiform-procure-showcase.png", alt: "AiForm Procure shown in its real product environment" },
  wanotuts: { src: "/images/work/wanotuts-showcase.png", alt: "The WanoTuts website shown in its brand environment" },
  "residential-construction": { src: "/images/work/residential-construction-showcase.png", alt: "The NYAUTSA SS Trading website shown in a construction-themed setting" },
  "private-medical-practice": { src: "/images/work/private-medical-practice-showcase.png", alt: "The Dr Ugwu private medical practice website shown in its own environment" },
};

export default function AiFormEnginePage() {
  return (
    <article>
      <header className="editorial-grid py-14 md:py-20 lg:py-24">
        <p className="col-span-12 chapter-label md:col-span-2">AIFORM ENGINE // INTERNAL OPERATING SYSTEM</p>
        <div className="col-span-12 mt-10 md:col-start-3 md:col-span-9 md:mt-0">
          <h1 className="case-study-lead">
            The operating system
            <br />
            <span className="text-green">behind the work.</span>
          </h1>
          <p className="case-study-copy mt-9 text-lg md:text-xl">
            AiForm Engine is the internal architecture we use to move from an idea or operational problem to a working digital product.
          </p>
          <p className="case-study-copy">
            It brings research, requirements, knowledge, automation and reusable systems into one connected way of building.
          </p>
          <p className="mt-7 text-lg font-medium text-gold">Not a product we sell. The system we build with.</p>
        </div>

        <figure className="col-span-12 mt-16 md:mt-6 md:col-start-3 md:col-span-9">
          <div className="engine-hero-art">
            <Image
              src="/images/work/aiform-engine-showcase.png"
              alt="A conceptual visual for the AiForm Engine internal operating system"
              fill
              priority
              sizes="(min-width: 1024px) 75vw, 92vw"
              style={{ objectFit: "contain", objectPosition: "center" }}
            />
          </div>
          <figcaption className="sr-only">A concept visual representing the AiForm Engine internal operating system.</figcaption>
        </figure>

        <div className="case-study-meta col-span-12 mt-16 md:mt-20">
          {projectMeta.map(([label, value]) => (
            <div key={label}>
              <p className="text-[10px] uppercase tracking-[.1em] text-muted">{label}</p>
              <p className="mt-2 text-sm font-semibold text-green">{value}</p>
            </div>
          ))}
        </div>
      </header>

      <section className="case-study-section editorial-grid bg-bg-alt" aria-labelledby="engine-architecture-title">
        <p className="col-span-12 chapter-label md:col-span-2">Architecture / Conceptual view</p>
        <div className="col-span-12 mt-9 md:col-start-3 md:col-span-9 md:mt-0">
          <h2 id="engine-architecture-title" className="secondary-title">From context to working system.</h2>

          <figure className="engine-architecture mt-14">
            <svg className="engine-architecture-connector" viewBox="0 0 800 40" aria-hidden="true" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="100" y1="20" x2="700" y2="20" stroke="rgba(23,59,44,0.35)" strokeWidth="1.25" />
              <circle cx="100" cy="20" r="5" fill="none" stroke="rgba(23,59,44,0.5)" strokeWidth="1.5" />
              <circle cx="100" cy="20" r="2" fill="rgba(182,138,58,0.85)" />
              <circle cx="300" cy="20" r="4" fill="none" stroke="rgba(23,59,44,0.4)" strokeWidth="1.25" />
              <circle cx="500" cy="20" r="4" fill="none" stroke="rgba(23,59,44,0.4)" strokeWidth="1.25" />
              <circle cx="700" cy="20" r="5" fill="none" stroke="rgba(23,59,44,0.5)" strokeWidth="1.5" />
              <circle cx="700" cy="20" r="2" fill="rgba(182,138,58,0.85)" />
              <path d="M 195 20 L 205 16 L 205 24 Z" fill="rgba(23,59,44,0.4)" />
              <path d="M 395 20 L 405 16 L 405 24 Z" fill="rgba(23,59,44,0.4)" />
              <path d="M 595 20 L 605 16 L 605 24 Z" fill="rgba(23,59,44,0.4)" />
            </svg>
            <div className="engine-architecture-grid">
              {architectureStages.map((stage) => (
                <div className="engine-architecture-stage" key={stage.name}>
                  <h3>{stage.name}</h3>
                  <ul>
                    {stage.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <figcaption className="sr-only">A four-stage architecture: Understand, Structure, Build, Operate.</figcaption>
          </figure>
        </div>
      </section>

      <section className="case-study-section editorial-grid" aria-labelledby="engine-inputs-title">
        <p className="col-span-12 chapter-label md:col-span-2">Input / Context</p>
        <div className="col-span-12 mt-9 md:col-start-3 md:col-span-9 md:mt-0">
          <h2 id="engine-inputs-title" className="secondary-title">Every build starts with context.</h2>
          <span className="rule-gold mt-7 block" aria-hidden="true" />
          <div className="mt-7 grid sm:grid-cols-2">
            {inputs.map(([term, copy], index) => (
              <div key={term} className={`border-t border-line py-6 ${index % 2 ? "sm:pl-8" : "sm:pr-8"}`}>
                <h3 className="font-display text-lg text-green">{term}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{copy}</p>
              </div>
            ))}
          </div>
          <p className="case-study-copy mt-10 max-w-3xl border-t border-line pt-8">
            The Engine starts with the problem around the software, not the software itself.
          </p>
        </div>
      </section>

      <section className="case-study-section editorial-grid bg-bg-alt" aria-labelledby="engine-capability-title">
        <p className="col-span-12 chapter-label md:col-span-2">Engine / Capability layer</p>
        <div className="col-span-12 mt-9 md:col-start-3 md:col-span-9 md:mt-0">
          <h2 id="engine-capability-title" className="secondary-title">The useful part is what connects everything.</h2>
          <div className="mt-10 border-t border-line">
            {capabilities.map(([number, title, copy]) => (
              <article key={title} className="capability-row">
                <p className="capability-classification">[{number}]</p>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="case-study-section editorial-grid deep-green-panel" aria-labelledby="engine-boundary-title">
        <p className="col-span-12 chapter-label chapter-label-light md:col-span-2">Engine / Proprietary boundary</p>
        <div className="col-span-12 mt-9 md:col-start-3 md:col-span-8 md:mt-0">
          <h2 id="engine-boundary-title" className="principle-title text-[#e0c98f]">
            The architecture is visible.
            <br />
            The implementation stays inside the Engine.
          </h2>
          <div className="engine-boundary-line" aria-hidden="true"><span /><em /><span /></div>
          <p className="max-w-2xl text-lg leading-relaxed text-white/78">
            Internal orchestration, system rules, implementation patterns and operational playbooks are proprietary to AiForm Studio.
          </p>
        </div>
      </section>

      <section className="case-study-section editorial-grid" aria-labelledby="engine-outputs-title">
        <p className="col-span-12 chapter-label md:col-span-2">Output / Systems</p>
        <div className="col-span-12 mt-9 md:col-start-3 md:col-span-9 md:mt-0">
          <h2 id="engine-outputs-title" className="secondary-title">Different problems. Different outputs. One underlying system.</h2>
          <div className="mt-10 grid border-t border-line sm:grid-cols-2 md:grid-cols-3">
            {outputs.map(([title, copy], index) => (
              <div key={title} className={`border-b border-line py-7 ${index % 3 !== 0 ? "md:border-l md:pl-7" : ""}`}>
                <h3 className="font-display text-lg text-green">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="case-study-section editorial-grid bg-bg-alt" aria-labelledby="engine-proof-title">
        <p className="col-span-12 chapter-label md:col-span-2">Output / In practice</p>
        <div className="col-span-12 mt-9 md:col-start-3 md:col-span-9 md:mt-0">
          <h2 id="engine-proof-title" className="secondary-title">You&apos;ve already seen what it produces.</h2>
          <div className="engine-proof-grid mt-12">
            {proofIds.map((id) => {
              const project = projects.find((candidate) => candidate.id === id);
              if (!project) return null;
              const image = proofImages[id];
              const content = (
                <>
                  <div className="engine-proof-figure">
                    <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 45vw, 92vw" style={{ objectFit: "contain", objectPosition: "center" }} />
                  </div>
                  <div className="engine-proof-caption">
                    <p>{project.name}</p>
                    <p>{project.context}</p>
                  </div>
                </>
              );
              return project.caseStudyUrl ? (
                <Link key={id} href={project.caseStudyUrl} className="engine-proof-item">
                  {content}
                </Link>
              ) : (
                <div key={id} className="engine-proof-item">
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="case-study-section editorial-grid" aria-labelledby="engine-boundary-not-title">
        <p className="col-span-12 chapter-label md:col-span-2">Boundary / What it is not</p>
        <div className="col-span-12 mt-9 md:col-start-3 md:col-span-9 md:mt-0">
          <h2 id="engine-boundary-not-title" className="sr-only">What the Engine is not</h2>
          <div className="border-t border-line">
            {boundaries.map(([statement, detail]) => (
              <div key={statement} className="grid gap-2 border-b border-line py-7 sm:grid-cols-[1fr_2fr]">
                <p className="font-display text-2xl text-green">{statement}</p>
                <p className="text-sm leading-relaxed text-muted sm:pt-1">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="case-study-section editorial-grid bg-bg-alt" aria-labelledby="engine-principles-title">
        <p className="col-span-12 chapter-label md:col-span-2">Principles / Operating logic</p>
        <div className="col-span-12 mt-9 md:col-start-3 md:col-span-9 md:mt-0">
          <h2 id="engine-principles-title" className="principle-title">
            Reuse the intelligence.
            <br />
            <span className="text-green">Not the assumptions.</span>
          </h2>
          <div className="mt-12 grid gap-x-8 gap-y-10 border-t border-line pt-10 sm:grid-cols-2">
            {principles.map(([title, copy]) => (
              <div key={title}>
                <p className="chapter-label">{title}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-grid py-14 md:py-20 lg:py-24" aria-labelledby="engine-closing-title">
        <p className="col-span-12 chapter-label md:col-span-2">AiForm Engine / Active</p>
        <div className="col-span-12 mt-9 md:col-start-3 md:col-span-9 md:mt-0">
          <h2 id="engine-closing-title" className="case-study-statement max-w-4xl">
            The Engine isn&apos;t the thing we sell.
            <br />
            It&apos;s part of how we build better things.
          </h2>
          <p className="section-intro mt-7">Have something worth figuring out?</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="button-primary">Get in touch <span aria-hidden="true">→</span></Link>
            <Link href="/work" className="button-secondary">See what we&apos;ve built <span aria-hidden="true">→</span></Link>
          </div>
          <p className="mt-10 max-w-2xl text-xs leading-relaxed text-muted">
            Architecture represented conceptually. Internal implementation, orchestration and operational methods remain proprietary to AiForm Studio.
          </p>
        </div>
      </section>
    </article>
  );
}
