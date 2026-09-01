import Image from "next/image";
import Link from "next/link";
import PretoriaPhoto from "@/components/PretoriaPhoto";
import { projects, type Project } from "@/content/projects";

const capabilities = [
  ["01", "Strategy", "Clarify the problem, the people involved and the smallest useful way forward."],
  ["02", "Websites & systems", "Purpose-built websites, internal tools and operational software that fit the work."],
  ["03", "Automation", "Connect repetitive workflows and apply AI only where it creates practical value."],
  ["04", "Support", "Improve, maintain and extend what we build as your organisation learns."],
];
const process = [
  ["01", "Understand", "We start with your problem, not our solution."],
  ["02", "Build", "We design and develop what fits how you work."],
  ["03", "Support", "We stay with you to ensure it delivers results."],
];
const selectedIds = ["aiform-procure", "wanotuts", "residential-construction", "mathabo-crochet"];
const selectedWork = selectedIds.map((id) => projects.find((project) => project.id === id)).filter((project): project is Project => Boolean(project));

export default function Home() {
  return <>
    <section id="home" className="editorial-grid home-hero" aria-labelledby="home-title">
      <div className="relative z-10 col-span-12 lg:col-span-9 xl:col-span-8">
        <p className="hero-eyebrow">Websites <span>·</span> Systems <span>·</span> Digital tools</p>
        <h1 id="home-title" className="home-hero-title">We build what your business actually needs.</h1>
        <p className="home-hero-copy">Websites, systems and digital tools built around how your business works — not a template stretched to fit.</p>
        <div className="mt-7 flex flex-wrap gap-3"><Link href="/contact" className="button-primary">Start a project <span aria-hidden="true">→</span></Link><Link href="/work" className="button-secondary">See our work <span aria-hidden="true">→</span></Link></div>
        <p className="mt-8 text-sm text-muted">A founder-led digital product studio based in Pretoria, South Africa.</p>
      </div>
      <PretoriaPhoto />
    </section>

    <section id="services" className="editorial-grid home-section border-t border-line" aria-labelledby="services-title">
      <p className="col-span-12 chapter-label md:col-span-2">01 / What we build</p>
      <div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0"><h2 id="services-title" className="section-title">Digital tools built around real work.</h2><p className="section-intro">From the first useful website to a purpose-built business system, we create the right level of technology for the problem.</p></div>
      <div className="col-span-12 mt-14 border-t border-line md:col-start-4 md:col-span-9">
        {capabilities.map(([number, title, copy]) => <article key={title} className="capability-row"><p className="chapter-label">{number}</p><h3>{title}</h3><p>{copy}</p></article>)}
        <Link href="#how-we-work" className="text-link mt-8">See how we work <span aria-hidden="true">→</span></Link>
      </div>
    </section>

    <section id="work" className="home-section border-t border-line" aria-labelledby="work-title">
      <div className="editorial-grid"><p className="col-span-12 chapter-label md:col-span-2">02 / Selected work</p><div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0"><h2 id="work-title" className="section-title">Work you can point to.</h2><p className="section-intro">Websites, products and systems delivered for clients or developed by AiForm.</p></div></div>
      <div className="editorial-grid mt-14"><div className="col-span-12 border-t border-line md:col-start-4 md:col-span-9">
        {selectedWork.map((project, index) => <article key={project.id} className="work-row"><p className="work-number">0{index + 1}</p><div><p className="chapter-label">{project.type} / {project.status}</p><h3>{project.name}</h3><p className="mt-2 text-sm text-muted">{project.context}</p></div><div><p className="work-summary">{project.summary}</p><div className="mt-5 flex flex-wrap gap-5">{project.caseStudyUrl ? <Link href={project.caseStudyUrl} className="text-link">Case study <span aria-hidden="true">→</span></Link> : null}{project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-link" aria-label={`Visit ${project.name} (opens in a new tab)`}>Visit site <span aria-hidden="true">↗</span></a> : null}</div></div></article>)}
        <Link href="/work" className="button-secondary mt-10">View all work <span aria-hidden="true">→</span></Link>
      </div></div>
    </section>

    <section id="approach" className="infrastructure-section border-t border-line" aria-labelledby="infrastructure-title">
      <div className="editorial-grid relative z-10 home-section"><p className="col-span-12 chapter-label md:col-span-2">03 / Our approach</p><div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0"><h2 id="infrastructure-title" className="section-title">Useful digital infrastructure, shaped around the work.</h2><p className="section-intro text-text">We help organisations build what actually matters — from websites and internal tools to automation and purpose-built systems.</p><div className="philosophy-block"><p className="chapter-label">Noticed, not invented.</p><h3>We look for the problem people have learned to live with.</h3><p>Then we inspect the people, processes and constraints around it before deciding what should be built. The result is software grounded in the way the organisation actually works.</p></div></div></div>
    </section>

    <section id="how-we-work" className="editorial-grid home-section border-t border-line" aria-labelledby="process-title">
      <p className="col-span-12 chapter-label md:col-span-2">04 / How we work</p><div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0"><h2 id="process-title" className="section-title">Clear from first conversation to working product.</h2></div>
      <div className="col-span-12 mt-14 grid border-t border-line md:col-start-4 md:col-span-9 md:grid-cols-3">{process.map(([number, title, copy], index) => <article key={title} className={`process-step ${index ? "md:border-l md:border-line md:pl-7" : "md:pr-7"}`}><p className="chapter-label">{number}</p><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </section>

    <section id="about" className="editorial-grid home-section border-t border-line" aria-labelledby="founder-title">
      <p className="col-span-12 chapter-label md:col-span-2">05 / Founder-led</p>
      <div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0">
        <h2 id="founder-title" className="section-title">Built close to the problem.</h2>
        <div className="founder-row">
          <div>
            <Image src="/images/founder.jpg" alt="Dr Thabiso Eric Motaung, Founder of AiForm Studio" width={104} height={104} className="founder-portrait" />
            <p className="founder-name">Dr Thabiso Eric Motaung</p>
            <p className="founder-role">Founder &amp; Builder</p>
            <p className="founder-academic">Senior Lecturer, University of Pretoria</p>
          </div>
          <p className="section-intro">AiForm Studio is led by Dr Thabiso Eric Motaung, a builder and academic based in Pretoria. The Studio grew from a simple approach: understand how people actually work, notice where systems create unnecessary friction, and build something better around that reality.</p>
        </div>
      </div>
    </section>

    <section className="editorial-grid home-section border-t border-line" aria-labelledby="contact-title"><p className="col-span-12 chapter-label md:col-span-2">06 / Start a project</p><div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0"><h2 id="contact-title" className="section-title">Have something your business needs to work better?</h2><p className="section-intro">Tell us what you are trying to solve. You do not need a technical brief.</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/contact" className="button-primary">Start a project <span aria-hidden="true">→</span></Link><a href="mailto:aiformstudio@gmail.com" className="button-secondary">Email us</a></div></div></section>
  </>;
}
