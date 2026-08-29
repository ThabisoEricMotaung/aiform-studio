import Image from "next/image";
import Link from "next/link";
import PretoriaPhoto from "@/components/PretoriaPhoto";
import { MothGeometryStudy } from "@/components/BrandLineArt";
import OperatingSystemMap from "@/components/OperatingSystemMap";
import AiFormLockup, { AiFormMark } from "@/components/AiFormLockup";
import ProcureSocialLinks from "@/components/ProcureSocialLinks";
import SouthAfricaMap from "@/components/SouthAfricaMap";
import BuildIndex from "@/components/BuildIndex";
import { projects, type Project } from "@/content/projects";

const services = [
  ["01", "Websites", "Purpose-built websites for businesses, organisations and professional practices."],
  ["02", "Business systems", "Internal tools, booking systems, dashboards, workflows and operational software."],
  ["03", "Digital products", "Platforms and customer-facing products designed around a specific problem."],
  ["04", "Automation & AI", "AI and automation where they genuinely improve the workflow, not as decoration."],
];
const method = [
  ["01", "Observe", "Understand the real problem before proposing software."],
  ["02", "Understand", "Map the people, processes, constraints and existing tools."],
  ["03", "Verify", "Test assumptions against evidence and actual behaviour."],
  ["04", "Build", "Create the smallest useful system that solves the real problem."],
  ["05", "Test", "Check whether the behaviour changed, not merely whether the code works."],
];
const systemLayers = [
  ["01", "Knowledge", "Research, documentation, project context and accumulated learning."],
  ["02", "Intelligence", "AI-assisted analysis, specialised agents and focused workflows."],
  ["03", "Playbooks", "Reusable methods, standards and patterns."],
  ["04", "Systems", "Shared integrations, automation and infrastructure connecting the work."],
  ["05", "Operations", "Runtime checks, logs, state and feedback."],
];
const selectedIds = ["aiform-procure", "wanotuts", "residential-construction", "mathabo-crochet"];
const selectedWork = selectedIds.map((id) => projects.find((project) => project.id === id)).filter((project): project is Project => Boolean(project));
const clientWork = projects.filter((project) => project.type === "Client System");
const ownedWork = projects.filter((project) => project.type !== "Client System");

export default function Home() {
  return <>
    <section className="editorial-grid relative overflow-hidden py-16 md:py-20 lg:py-24">
      <div className="relative z-10 col-span-12 self-center lg:col-span-7">
        <p className="mb-8 flex items-center gap-4 text-xl font-medium text-green md:text-[22px]"><span aria-hidden="true" className="h-0.5 w-10 bg-gold" />A Pretoria studio for expensive assumptions</p>
        <h1 className="hero-title font-display">Noticed,<br /><span className="text-green">not invented.</span></h1>
        <p className="mt-9 max-w-2xl text-lg leading-relaxed md:text-xl">We notice the problems people have learned to live with, understand why they persist, and build systems that make them easier to solve.</p>
        <p className="mt-7 max-w-3xl border-l-2 border-gold pl-5 text-xl font-semibold leading-snug text-green md:text-2xl">Websites, business systems and digital products built around how your organisation actually works.</p>
        <div className="mt-10 flex flex-wrap items-center gap-8"><Link href="#work" className="link-arrow hero-cta">Explore our work <span aria-hidden="true">→</span></Link><Link href="/contact" className="text-lg font-semibold text-green">Start a project →</Link></div>
      </div>
      <div className="col-span-12 mt-12 self-center md:mt-14 lg:col-start-8 lg:col-span-5 lg:mt-0 lg:-ml-[14%] lg:w-[114%] xl:-ml-[24%] xl:w-[124%] 2xl:-ml-[28%] 2xl:w-[128%]">
        <SouthAfricaMap />
      </div>
    </section>
    <PretoriaPhoto />

    <section id="services" className="editorial-grid bg-green py-16 text-white md:py-24" aria-labelledby="services-title">
      <p className="col-span-12 chapter-label chapter-label-light md:col-span-2">01 / What we build</p>
      <div className="col-span-12 mt-10 md:col-start-3 md:col-span-9 md:mt-0"><h2 id="services-title" className="section-title">Useful digital infrastructure,<br />shaped around the work.</h2></div>
      <div className="col-span-12 mt-14 grid border-t border-white/25 md:grid-cols-4">{services.map(([number, title, copy], index) => <article key={title} className={`py-7 md:py-9 ${index ? "border-t border-white/20 md:border-l md:border-t-0 md:pl-7" : "md:pr-7"}`}><p className="chapter-label chapter-label-light">{number}</p><h3 className="mt-5 font-display text-3xl">{title}</h3><p className="mt-4 text-sm leading-relaxed text-white/75">{copy}</p></article>)}</div>
    </section>

    <section id="work" className="border-t border-line py-16 md:py-24" aria-labelledby="work-title">
      <div className="editorial-grid"><p className="col-span-12 chapter-label md:col-span-2">02 / Selected work</p><div className="col-span-12 mt-9 md:col-start-3 md:col-span-8 md:mt-0"><h2 id="work-title" className="section-title">Problems made tangible.</h2><p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">A small selection of commissioned work and products developed by AiForm.</p></div></div>
      <div className="editorial-grid mt-14">{selectedWork.map((project, index) => <article key={project.id} className={`col-span-12 border-t border-line py-9 ${index === 0 ? "bg-[#e9e1ca] px-6 md:px-8" : "md:col-span-4"}`}><p className="chapter-label">{project.type} / {project.sector} / {project.status}</p><h3 className={`mt-6 font-display ${index === 0 ? "text-5xl md:text-7xl" : "text-3xl"}`}>{project.name}</h3><p className="mt-3 text-sm text-muted">{project.context}</p><dl className={`mt-8 grid gap-6 ${index === 0 ? "md:grid-cols-3" : ""}`}><div><dt className="chapter-label">Problem</dt><dd className="mt-2 text-sm leading-relaxed text-muted">{project.summary}</dd></div><div><dt className="chapter-label">Built</dt><dd className="mt-2 text-sm leading-relaxed text-muted">{project.context}</dd></div><div><dt className="chapter-label">Outcome</dt><dd className="mt-2 text-sm leading-relaxed text-muted">A delivered capability represented by its current {project.status.toLowerCase()} status.</dd></div></dl><div className="mt-8 flex flex-wrap gap-5 text-sm font-semibold text-green">{project.caseStudyUrl ? <Link href={project.caseStudyUrl}>Read case study →</Link> : null}{project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.name} (opens in a new tab)`}>Visit website ↗</a> : null}</div></article>)}</div>
    </section>

    <section id="products" className="editorial-grid border-t border-line bg-bg-alt py-16 md:py-24" aria-labelledby="directions-title">
      <p className="col-span-12 chapter-label md:col-span-2">03 / Two directions</p><div className="col-span-12 mt-9 md:col-start-3 md:col-span-8 md:mt-0"><h2 id="directions-title" className="secondary-title">We build in two directions.</h2><p className="mt-6 max-w-2xl leading-relaxed text-muted">Systems commissioned by clients, and products we develop ourselves when we encounter problems worth solving.</p></div>

      <div className="col-span-12 mt-14 bg-[#e9e1ca] p-6 md:col-start-3 md:col-span-10 md:p-10">
        <p className="chapter-label">Built by AiForm / Procurement / Live</p>
        <div className="mt-7 grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-4">
            <AiFormLockup product="Procure" variant="gold" className="text-xs text-green" markClassName="h-9" />
            <h3 className="font-display text-4xl mt-6 md:text-5xl">AiForm<br /><span className="text-green">Procure.</span></h3>
            <p className="text-muted leading-relaxed mt-6">A procurement system for public opportunity discovery, supplier compliance evidence, and readiness signals.</p>
            <a href="https://www.aiformprocure.co.za" target="_blank" rel="noreferrer" className="link-arrow mt-7">View product ↗</a>
          </div>
          <div className="md:col-span-8 product-frame">
            <div className="product-bar">AIFORM PROCURE / SUPPLIER OVERVIEW</div>
            <div className="product-ui">
              <aside>
                <AiFormLockup product="Procure" variant="white" compactOnMobile className="text-[7px] text-white" markClassName="h-7" />
                <span>Opportunities</span>
                <span>Compliance</span>
                <span>SmartScore</span>
                <span>Buyers &amp; Suppliers</span>
              </aside>
              <main>
                <p>SUPPLIER OVERVIEW</p>
                <h4>Trust, made visible.</h4>
                <div className="product-ui-capabilities">
                  <span><b>Compliance</b>CSD · Tax · B-BBEE</span>
                  <span><b>Opportunities</b>Public procurement discovery</span>
                  <span><b>SmartScore</b>Evidence-based supplier readiness</span>
                </div>
                <ProcureSocialLinks />
              </main>
            </div>
          </div>
        </div>
      </div>

      {[{ title: "Built for clients", items: clientWork }, { title: "Built by AiForm", items: ownedWork }].map(({ title, items }, index) => <div key={title} className={`col-span-12 mt-14 border-t border-text pt-6 md:col-span-5 ${index ? "md:col-start-8" : "md:col-start-3"}`}><h3 className="font-display text-3xl text-green">{title}</h3><ul className="mt-6 divide-y divide-line">{items.map((project) => <li key={project.id} className="flex items-baseline justify-between gap-4 py-4"><span className="font-semibold">{project.name}</span><span className="text-right text-xs uppercase tracking-wider text-muted">{project.status}</span></li>)}</ul></div>)}
    </section>

    <section id="system" className="editorial-grid bg-clay py-16 text-white md:py-24" aria-labelledby="method-title">
      <p className="col-span-12 chapter-label chapter-label-light md:col-span-2">04 / How we work</p><div className="col-span-12 mt-9 md:col-start-3 md:col-span-9 md:mt-0"><h2 id="method-title" className="principle-title">Claims should survive contact with reality.</h2><p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/80">A feature isn&apos;t finished because the code changed. It&apos;s finished when the behaviour changes.</p></div>
      <div className="col-span-12 mt-14 grid border-t border-white/25 md:grid-cols-5">{method.map(([number, title, copy], index) => <article key={title} className={`py-7 ${index ? "border-t border-white/20 md:border-l md:border-t-0 md:pl-6" : "md:pr-6"}`}><p className="chapter-label chapter-label-light">{number}</p><h3 className="mt-5 font-display text-3xl">{title}</h3><p className="mt-4 text-sm leading-relaxed text-white/75">{copy}</p></article>)}</div>
    </section>

    <section id="operating-system" className="editorial-grid border-b border-line bg-bg-alt py-16 md:py-24" aria-labelledby="operating-system-title">
      <p className="col-span-12 md:col-span-2 chapter-label">05 / The system</p>
      <div className="col-span-12 mt-10 md:col-start-3 md:col-span-9 md:mt-0">
        <h2 id="operating-system-title" className="section-title">The operating system behind the work.</h2>
        <p className="mt-7 max-w-2xl text-xl font-semibold leading-snug text-green md:text-2xl">Different products. One evolving way of researching, building, verifying and operating them.</p>
        <p className="mt-8 max-w-2xl leading-relaxed text-muted"><strong className="font-semibold text-text">How We Work</strong> describes the method behind each engagement. <strong className="font-semibold text-text">The System</strong> describes how the Studio preserves context, coordinates work and improves across projects.</p>
      </div>
      <div className="col-span-12 mt-16 md:col-start-3 md:col-span-9">
        <OperatingSystemMap />
      </div>
      <div className="col-span-12 mt-14 border-t border-line grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
        {systemLayers.map(([number, title, copy]) => (
          <div key={number} className="pt-6">
            <p className="chapter-label">{number}</p>
            <h3 className="mt-4 font-display text-2xl">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{copy}</p>
          </div>
        ))}
      </div>
    </section>
    <BuildIndex compact chapterLabel="06 / The build index" />

    <section id="studio" className="editorial-grid border-t border-line py-16 md:py-24"><p className="col-span-12 chapter-label md:col-span-2">07 / Founder</p><div className="relative col-span-12 mt-10 aspect-[4/5] md:col-start-3 md:col-span-4 md:mt-0"><Image src="/images/founder.jpg" alt="Thabiso Eric Motaung, founder of AiForm Studio" fill sizes="(max-width:768px) 100vw, 34vw" className="object-cover grayscale" /></div><div className="col-span-12 mt-10 md:col-start-8 md:col-span-5 md:mt-0"><h2 className="section-title">Founder-led. <span className="text-green">Research-driven.</span></h2><p className="mt-8 leading-relaxed text-muted">Founder-led from discovery through delivery. The person understanding the problem stays involved in designing and building the solution.</p><p className="mt-6 leading-relaxed text-muted">AiForm Studio is led by Thabiso Eric Motaung—an academic, researcher and product builder. That combination keeps the work close to how people learn, reason and get stuck.</p><p className="font-display text-2xl text-green mt-8">Identify → inspect → test → build → observe → revise.</p></div></section>

    <section className="editorial-grid border-t border-line py-16 md:py-24">
      <p className="col-span-12 chapter-label md:col-span-2">08 / The mark</p>
      <div className="col-span-12 mt-10 md:col-start-3 md:col-span-9 md:mt-0">
        <h2 className="font-display text-3xl md:text-4xl">The mark was noticed before it was designed.</h2>
        <p className="mt-3 max-w-xl leading-relaxed text-muted">Its geometry began with a moth observed on a wall in Pretoria—the &ldquo;A&rdquo; was already there.</p>
      </div>
      <div className="col-span-12 mt-12 grid gap-10 sm:grid-cols-3 md:col-start-3 md:col-span-9">
        <figure className="border-t border-line pt-5">
          <figcaption>
            <span className="chapter-label">01 / Observed</span>
            <span className="mt-2 block text-sm text-muted">The original moth</span>
          </figcaption>
          <div className="relative mt-6 aspect-[4/5] overflow-hidden bg-bg-alt">
            <Image
              src="/images/IMG_0837.JPEG"
              alt="The original moth observed by AiForm's founder on a wall in Pretoria"
              fill
              sizes="(max-width: 768px) 100vw, 30vw"
              className="scale-[1.55] object-cover object-[50%_48%]"
            />
          </div>
        </figure>
        <figure className="border-t border-line pt-5">
          <figcaption>
            <span className="chapter-label">02 / Geometry</span>
            <span className="mt-2 block text-sm text-muted">The A was already there.</span>
          </figcaption>
          <div className="mt-6 flex aspect-[4/5] items-center justify-center bg-bg-alt px-6">
            <MothGeometryStudy />
          </div>
        </figure>
        <figure className="border-t border-line pt-5">
          <figcaption>
            <span className="chapter-label">03 / Mark</span>
            <span className="mt-2 block text-sm text-muted">AiForm</span>
          </figcaption>
          <div className="mt-6 flex aspect-[4/5] items-center justify-center bg-bg-alt px-10">
            <AiFormMark variant="studio" className="h-auto w-full max-w-[220px]" />
          </div>
        </figure>
      </div>
      <div className="col-span-12 mt-12 border-t border-line pt-6 md:col-start-3 md:col-span-9">
        <p className="chapter-label">One mark / distinct contexts</p>
        <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-12">
          <AiFormLockup product="Studio" variant="studio" className="text-[11px] text-text" markClassName="h-9" />
          <AiFormLockup product="Procure" variant="gold" className="text-[11px] text-green" markClassName="h-9" />
        </div>
      </div>
    </section>
  </>;
}
