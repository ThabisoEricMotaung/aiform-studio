import Image from "next/image";
import Link from "next/link";
import PretoriaPhoto from "@/components/PretoriaPhoto";
import { MothGeometryStudy } from "@/components/BrandLineArt";
import OperatingSystemMap from "@/components/OperatingSystemMap";
import AiFormLockup, { AiFormMark } from "@/components/AiFormLockup";
import ProcureSocialLinks from "@/components/ProcureSocialLinks";
import SouthAfricaMap from "@/components/SouthAfricaMap";
import BuildIndex from "@/components/BuildIndex";
import { projects } from "@/content/projects";

const engine = [
  ["01", "Parse", "Give messy, real-world information a useful shape."],
  ["02", "Verify", "Check claims against evidence, not convenience."],
  ["03", "Understand", "Turn evidence into something people can act on."],
  ["04", "Match", "Connect the right buyer, supplier, answer, or fit."],
];
const selectedWork = projects.filter(
  (project) => project.featured && project.id !== "aiform-procure",
);
const systemLayers = [
  [
    "01",
    "Knowledge",
    "Research, documentation, project context and accumulated learning.",
  ],
  [
    "02",
    "Intelligence",
    "AI-assisted analysis, specialised agents and focused workflows.",
  ],
  ["03", "Playbooks", "Reusable methods, standards and patterns."],
  [
    "04",
    "Systems",
    "Shared integrations, automation and infrastructure connecting the work.",
  ],
  ["05", "Operations", "Runtime checks, logs, state and feedback."],
];

export default function Home() {
  return (
    <>
      <section className="editorial-grid relative overflow-hidden py-16 md:py-20 lg:py-24">
        <div className="relative z-10 col-span-12 self-center lg:col-span-7">
          <p className="mb-8 flex items-center gap-4 text-xl font-medium tracking-[-.01em] text-green md:text-[22px]">
            <span aria-hidden="true" className="h-0.5 w-10 bg-gold" />A studio
            for expensive assumptions
          </p>
          <h1 className="font-display hero-title">
            Noticed,
            <br />
            <span className="text-green">not invented.</span>
          </h1>
          <p className="mt-10 max-w-xl text-lg leading-relaxed md:text-xl">
            We notice the problems people have learned to live with, understand
            why they persist, and build systems that make them easier to solve.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-8">
            <Link href="#work" className="link-arrow hero-cta">
              Explore our work <span aria-hidden="true">→</span>
            </Link>
            <Link href="/contact" className="text-lg font-semibold text-green">
              Start a project ↗
            </Link>
          </div>
        </div>
        <div className="col-span-12 mt-12 self-center md:mt-14 lg:col-start-8 lg:col-span-5 lg:mt-0 lg:-ml-[14%] lg:w-[114%] xl:-ml-[24%] xl:w-[124%] 2xl:-ml-[28%] 2xl:w-[128%]">
          <SouthAfricaMap />
        </div>
      </section>
      <PretoriaPhoto />
      <section className="editorial-grid bg-green py-16 text-white md:py-24">
        <p className="col-span-12 md:col-span-2 chapter-label chapter-label-light">
          01 / The studio
        </p>
        <div className="col-span-12 md:col-start-3 md:col-span-9 mt-12 md:mt-0">
          <h2 className="section-title">
            We don&apos;t start with technology.
          </h2>
          <p className="mt-7 text-xl font-semibold leading-snug text-[#e0c98f] md:text-2xl">
            We start with what isn&apos;t working.
          </p>
        </div>
        <p className="col-span-12 md:col-start-9 md:col-span-4 mt-20 text-sm leading-relaxed text-white/75">
          The fix isn&apos;t always AI, and it isn&apos;t always the same fix
          twice. We inspect the evidence, test the assumption, build what is
          useful, and revise when reality disagrees.
        </p>
      </section>
      <section id="engine" className="editorial-grid py-16 md:py-24">
        <p className="col-span-12 md:col-span-2 chapter-label">
          02 / The engine
        </p>
        <h2 className="col-span-12 md:col-start-3 md:col-span-7 secondary-title mt-10 md:mt-0">
          What are people currently being asked to assume?
        </h2>
        <p className="col-span-12 md:col-start-8 md:col-span-5 mt-10 text-muted leading-relaxed">
          A recurring AiForm approach when information, verification, and trust
          sit at the centre of a problem—not a claim that every project follows
          the same four stages.
        </p>
        <div className="col-span-12 mt-20 border-t border-line grid md:grid-cols-4">
          {engine.map(([n, t, c], i) => (
            <div
              key={n}
              className={`engine-step py-8 md:py-10 ${i ? "md:border-l md:border-line md:pl-7" : ""}`}
            >
              <p className="chapter-label">{n}</p>
              <h3 className="font-display text-4xl lg:text-5xl mt-7">{t}</h3>
              <p className="text-sm text-muted leading-relaxed mt-5 max-w-[15rem]">
                {c}
              </p>
            </div>
          ))}
        </div>
        <p className="col-span-12 font-display text-green text-2xl md:text-3xl border-t border-line pt-7">
          Parse → Verify → Understand → Match
        </p>
      </section>
      <section id="work" className="border-t border-line py-16 md:py-24">
        <div className="editorial-grid">
          <p className="col-span-12 md:col-span-2 chapter-label">
            03 / Selected work
          </p>
          <div className="col-span-12 md:col-start-3 md:col-span-9 mt-10 md:mt-0">
            <h2 className="section-title">Built by AiForm.</h2>
            <p className="mt-5 text-xl font-semibold text-green md:text-2xl">
              Different problems. Same instinct.
            </p>
          </div>
        </div>
        <article
          id="products"
          className="mt-16 scroll-mt-24 bg-[#e9e1ca] py-14 md:mt-20 md:py-20"
        >
          <div className="editorial-grid items-end">
            <div className="col-span-12 md:col-span-4 mb-12 md:mb-0 md:pr-8">
              <p className="chapter-label">Product / Procurement / Live</p>
              <div className="mt-7">
                <AiFormLockup
                  product="Procure"
                  variant="gold"
                  className="text-xs text-green"
                  markClassName="h-9"
                />
              </div>
              <h3 className="font-display text-5xl md:text-7xl mt-6">
                AiForm
                <br />
                <span className="text-green">Procure.</span>
              </h3>
              <p className="text-muted leading-relaxed mt-8">
                A procurement system for public opportunity discovery, supplier
                compliance evidence, and readiness signals.
              </p>
              <a
                href="https://www.aiformprocure.co.za"
                target="_blank"
                rel="noreferrer"
                className="link-arrow mt-9"
              >
                View product ↗
              </a>
            </div>
            <div className="col-span-12 md:col-start-5 md:col-span-8 product-frame">
              <div className="product-bar">
                AIFORM PROCURE / SUPPLIER OVERVIEW
              </div>
              <div className="product-ui">
                <aside>
                  <AiFormLockup
                    product="Procure"
                    variant="white"
                    compactOnMobile
                    className="text-[7px] text-white"
                    markClassName="h-7"
                  />
                  <span>Opportunities</span>
                  <span>Compliance</span>
                  <span>SmartScore</span>
                  <span>Buyers &amp; Suppliers</span>
                </aside>
                <main>
                  <p>SUPPLIER OVERVIEW</p>
                  <h4>Trust, made visible.</h4>
                  <div className="product-ui-capabilities">
                    <span>
                      <b>Compliance</b>CSD · Tax · B-BBEE
                    </span>
                    <span>
                      <b>Opportunities</b>Public procurement discovery
                    </span>
                    <span>
                      <b>SmartScore</b>Evidence-based supplier readiness
                    </span>
                  </div>
                  <ProcureSocialLinks />
                </main>
              </div>
            </div>
          </div>
        </article>
        <div className="editorial-grid mt-16 md:mt-24">
          <div className="col-span-12 md:col-span-4 work-type">
            <p className="chapter-label">Products</p>
            <h3>Problems we choose to pursue.</h3>
          </div>
          <div className="col-span-12 md:col-span-4 work-type">
            <p className="chapter-label">Studio projects</p>
            <h3>Problems brought to us.</h3>
          </div>
          <div className="col-span-12 md:col-span-4 work-type">
            <p className="chapter-label text-purple">Experiments</p>
            <h3>Things we&apos;re still figuring out.</h3>
          </div>
          <div className="col-span-12 mt-20 border-t border-line">
            {selectedWork.map((item) => (
              <article key={item.name} className="selected-row">
                <p className="selected-row-meta">{item.category} / {item.sector} / {item.status}</p>
                <div>
                  <h3>{item.name}</h3>
                  {item.context ? (
                    <p className="selected-row-context">{item.context}</p>
                  ) : null}
                </div>
                <div className="selected-row-detail">
                  <p>{item.summary}</p>
                  {item.caseStudyUrl || item.liveUrl ? (
                    <div className="selected-row-actions">
                      {item.caseStudyUrl ? (
                        <Link href={item.caseStudyUrl}>Read case study →</Link>
                      ) : null}
                      {item.liveUrl ? (
                        <a
                          href={item.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit ${item.name} website (opens in a new tab)`}
                        >
                          Visit website <span aria-hidden="true">↗</span>
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="editorial-grid border-t border-line bg-bg-alt py-16 md:py-24">
        <p className="col-span-12 chapter-label md:col-span-2">Case study 01 / AiForm Procure</p>
        <div className="col-span-12 mt-9 md:col-start-3 md:col-span-6 md:mt-0">
          <h2 className="secondary-title">Procurement information is abundant. Finding what is current, relevant and trustworthy is the harder part.</h2>
        </div>
        <div className="col-span-12 mt-10 md:col-start-9 md:col-span-4 md:mt-0">
          <p className="leading-relaxed text-muted">See the problem, the product decisions, the verified capabilities and what the build is teaching us.</p>
          <div className="mt-8 flex flex-wrap gap-6">
            <Link href="/work/aiform-procure" className="link-arrow">View case study →</Link>
            <a href="https://www.aiformprocure.co.za/" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-green">Open live product <span className="text-gold" aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>
      <BuildIndex />
      <section className="editorial-grid bg-clay py-16 text-white md:py-24">
        <p className="col-span-12 md:col-span-2 chapter-label chapter-label-light">
          05 / Principle
        </p>
        <h2 className="col-span-12 md:col-start-3 md:col-span-8 principle-title mt-10 md:mt-0">
          Claims should survive contact with reality.
        </h2>
        <p className="col-span-12 md:col-start-8 md:col-span-5 mt-16 leading-relaxed text-white/80">
          A configuration isn&apos;t correct until it&apos;s tested. A feature
          isn&apos;t fixed because the code changed. It&apos;s fixed when the
          behaviour changes.
        </p>
      </section>
      <section
        id="system"
        className="editorial-grid border-b border-line bg-bg-alt py-16 md:py-24"
      >
        <p className="col-span-12 md:col-span-2 chapter-label">
          06 / The system
        </p>
        <div className="col-span-12 mt-10 md:col-start-3 md:col-span-8 md:mt-0">
          <h2 className="section-title">
            The operating system behind the work.
          </h2>
          <p className="mt-7 max-w-2xl text-xl font-semibold leading-snug text-green md:text-2xl">
            Different products. One evolving way of researching, building,
            verifying and operating them.
          </p>
          <p className="mt-8 max-w-2xl leading-relaxed text-muted">
            <strong className="font-semibold text-text">The Engine</strong>{" "}
            describes how information-driven products make sense of complex
            inputs.{" "}
            <strong className="font-semibold text-text">The System</strong>{" "}
            describes how the Studio preserves context, coordinates work and
            improves across projects.
          </p>
        </div>
        <div className="col-span-12 mt-16 hidden border-y border-line bg-white md:block">
          <OperatingSystemMap />
        </div>
        <div className="col-span-12 mt-16 md:hidden">
          {systemLayers.map(([number, title, copy], index) => (
            <div
              key={number}
              className="relative border-t border-line py-7 pl-10"
            >
              <span className="absolute left-0 top-7 chapter-label">
                {number}
              </span>
              <h3 className="font-display text-2xl">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{copy}</p>
              {index < systemLayers.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute bottom-[-7px] left-[3px] text-gold"
                >
                  ↓
                </span>
              ) : null}
            </div>
          ))}
        </div>
        <div className="col-span-12 mt-16 hidden border-t border-line md:grid md:grid-cols-5">
          {systemLayers.map(([number, title, copy], index) => (
            <div
              key={number}
              className={`py-7 ${index ? "border-l border-line pl-6" : "pr-6"}`}
            >
              <p className="chapter-label">{number}</p>
              <h3 className="mt-5 font-display text-2xl">{title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">{copy}</p>
            </div>
          ))}
        </div>
        <p className="col-span-12 mt-16 max-w-3xl text-lg leading-relaxed text-text/85 md:col-start-3 md:col-span-8">
          The point isn&apos;t automation for its own sake. The system reduces
          repeated work, preserves context and makes it easier to test
          assumptions instead of carrying them from one project to the next.
        </p>
        <div className="col-span-12 mt-14 grid gap-8 border-t border-line md:grid-cols-3">
          {[
            [
              "Continuity",
              "Lessons from one build don't disappear when the project ends.",
            ],
            [
              "Consistency",
              "Research, development and verification follow repeatable standards.",
            ],
            [
              "Leverage",
              "Reusable systems let more effort go into the problem instead of rebuilding the machinery around it.",
            ],
          ].map(([title, copy]) => (
            <div key={title} className="pt-7">
              <h3 className="chapter-label">{title}</h3>
              <p className="mt-4 leading-relaxed text-muted">{copy}</p>
            </div>
          ))}
        </div>
        <p className="col-span-12 mt-14 border-t border-text pt-7 text-xl font-semibold text-green md:col-start-8 md:col-span-5">
          The products change. The system learns.
        </p>
      </section>
      <section id="studio" className="editorial-grid py-16 md:py-24">
        <p className="col-span-12 md:col-span-2 chapter-label">07 / Founder</p>
        <div className="col-span-12 md:col-start-3 md:col-span-4 mt-10 md:mt-0 relative aspect-[4/5]">
          <Image
            src="/images/founder.jpg"
            alt="Thabiso Eric Motaung, founder of AiForm Studio"
            fill
            sizes="(max-width:768px) 100vw, 34vw"
            className="object-cover grayscale"
          />
        </div>
        <div className="col-span-12 md:col-start-8 md:col-span-5 mt-12 md:mt-0">
          <h2 className="section-title">
            Founder-led. <span className="text-green">Research-driven.</span>
          </h2>
          <p className="text-muted leading-relaxed mt-9">
            AiForm Studio is led by Thabiso Eric Motaung—an academic, researcher
            and product builder who designs and builds each engagement from
            research through delivery. That combination keeps the work close to
            how people learn, reason and get stuck.
          </p>
          <p className="font-display text-2xl text-green mt-10">
            Identify → inspect → test → build → observe → revise.
          </p>
        </div>
      </section>
      <section className="editorial-grid border-t border-line py-16 md:py-24">
        <p className="col-span-12 chapter-label">08 / The mark</p>
        <div className="col-span-12 mt-12 grid gap-14 md:grid-cols-3 md:gap-7">
          <figure className="border-t border-line pt-5">
            <figcaption>
              <span className="chapter-label">01 / Observed</span>
              <span className="mt-2 block text-sm text-muted">
                The original moth
              </span>
            </figcaption>
            <div className="relative mt-7 aspect-[4/5] overflow-hidden bg-bg-alt">
              <Image
                src="/images/IMG_0837.JPEG"
                alt="The original moth observed by AiForm's founder on a wall in Pretoria"
                fill
                sizes="(max-width: 768px) 100vw, 32vw"
                className="scale-[1.55] object-cover object-[50%_48%]"
              />
            </div>
          </figure>
          <figure className="border-t border-line pt-5">
            <figcaption>
              <span className="chapter-label">02 / Geometry</span>
              <span className="mt-2 block text-sm text-muted">
                The A was already there.
              </span>
            </figcaption>
            <div className="mt-7 flex aspect-[4/5] items-center justify-center bg-bg-alt px-8">
              <MothGeometryStudy />
            </div>
          </figure>
          <figure className="border-t border-line pt-5">
            <figcaption>
              <span className="chapter-label">03 / Mark</span>
              <span className="mt-2 block text-sm text-muted">AiForm</span>
            </figcaption>
            <div className="mt-7 flex aspect-[4/5] items-center justify-center bg-bg-alt px-12">
              <AiFormMark
                variant="studio"
                className="h-auto w-full max-w-[250px]"
              />
            </div>
          </figure>
        </div>
        <p className="col-span-12 mt-14 border-t border-line pt-7 text-lg font-semibold text-green md:col-start-5 md:col-span-8 md:text-xl">
          The mark was noticed before it was designed.
        </p>
        <div className="col-span-12 mt-12 border-t border-line pt-6 md:col-start-5 md:col-span-8">
          <p className="chapter-label">One mark / distinct contexts</p>
          <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-12">
            <AiFormLockup
              product="Studio"
              variant="studio"
              className="text-[11px] text-text"
              markClassName="h-9"
            />
            <AiFormLockup
              product="Procure"
              variant="gold"
              className="text-[11px] text-green"
              markClassName="h-9"
            />
          </div>
        </div>
      </section>
      <section
        id="journal"
        className="editorial-grid border-t border-line bg-bg-alt py-16 md:py-24"
      >
        <p className="col-span-12 md:col-span-2 chapter-label">09 / Journal</p>
        <div className="col-span-12 mt-10 md:col-start-3 md:col-span-6 md:mt-0">
          <h2 className="section-title">From the Journal</h2>
          <p className="mt-7 text-xl font-semibold text-green">
            Content coming soon.
          </p>
          <p className="mt-5 max-w-xl leading-relaxed text-muted">
            Research, observations and lessons from what we&apos;re studying and
            building.
          </p>
          <Link href="/journal" className="link-arrow mt-9">
            Visit the Journal →
          </Link>
        </div>
        <div className="col-span-12 mt-14 border-t border-line pt-5 md:col-start-10 md:col-span-3 md:mt-0">
          <p className="chapter-label">Issue 00</p>
          <p className="mt-3 text-[10px] uppercase tracking-[.12em] text-muted">
            AFS / Field notes
          </p>
        </div>
      </section>
      <section className="editorial-grid py-16 md:py-24">
        <p className="col-span-12 md:col-span-2 chapter-label">
          10 / How we work
        </p>
        <h2 className="col-span-12 md:col-start-3 md:col-span-6 section-title mt-10 md:mt-0">
          We don&apos;t start with <span className="text-green">AI.</span>
        </h2>
        <div className="col-span-12 md:col-start-9 md:col-span-4 mt-16">
          <p className="text-muted leading-relaxed">
            Sometimes the answer needs AI. Sometimes it needs better data.
            Sometimes it needs automation. Sometimes it just needs software
            designed properly.
          </p>
          <p className="font-display text-2xl text-green mt-7">
            Technology serves the problem, not the other way around.
          </p>
        </div>
      </section>
      <section className="editorial-grid border-t border-line py-16 md:py-24">
        <p className="col-span-12 md:col-span-2 chapter-label">
          11 / Where next
        </p>
        <h2 className="col-span-12 md:col-start-3 md:col-span-7 section-title mt-10 md:mt-0">
          What haven&apos;t we <span className="text-green">noticed yet?</span>
        </h2>
        <p className="col-span-12 md:col-start-8 md:col-span-5 text-muted leading-relaxed mt-16">
          Documents everywhere. Important claims that are difficult to verify.
          Two parties deciding whether they can trust one another. Repetitive
          work that software could handle more clearly.
        </p>
      </section>
    </>
  );
}
