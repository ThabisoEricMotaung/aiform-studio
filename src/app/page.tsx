import Image from "next/image";
import Link from "next/link";
import PretoriaPhoto from "@/components/PretoriaPhoto";
import { AiFormMark } from "@/components/AiFormLockup";
import { projects, type Project } from "@/content/projects";

const capabilities = [
  ["ENTRY POINT", "Websites", "Clear digital entry points built around what customers need to do."],
  ["CORE ENGINE", "Business Systems", "Replace fragmented spreadsheets, manual admin and disconnected workflows with purpose-built systems."],
  ["EFFICIENCY LAYER", "Automation & AI", "Use automation or AI where it removes real friction — not because it is fashionable."],
  ["METHOD", "How We Work", "Understand the problem first, then design around the actual workflow."],
];
const outcomes = [
  ["Less manual work", "Reduce repetitive admin and fragmented workflows."],
  ["Fewer expensive mistakes", "Build clearer checks, verification and process visibility."],
  ["Better operational visibility", "Bring scattered information into systems people can actually use."],
  ["Systems that can grow", "Build around the real workflow instead of forcing the business into a template."],
];
const process = [
  ["01", "Understand", "We start with your problem, not our solution."],
  ["02", "Build", "We design and develop what fits how you work."],
  ["03", "Support", "We stay with you to ensure it delivers results."],
];
const selectedIds = ["aiform-procure", "wanotuts", "residential-construction", "mathabo-crochet"];
const selectedWork = selectedIds.map((id) => projects.find((project) => project.id === id)).filter((project): project is Project => Boolean(project));

type SocialPlatform = "tiktok" | "facebook" | "linkedin" | "github" | "apple-music";

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  const paths: Record<SocialPlatform, React.ReactNode> = {
    tiktok: <path d="M14.2 4c.4 2.3 1.8 3.7 3.8 3.9v3.1a8 8 0 0 1-3.8-1.2v5.1a6 6 0 1 1-5.1-5.9v3.3a2.7 2.7 0 1 0 1.8 2.6V4h3.3Z" />,
    facebook: <path d="M13.6 20v-7h2.35l.35-2.73h-2.7V8.53c0-.79.22-1.33 1.35-1.33h1.44V4.77a19 19 0 0 0-2.1-.11c-2.08 0-3.5 1.27-3.5 3.6v2.01H8.44V13h2.35v7h2.81Z" />,
    linkedin: <><path d="M6.5 8.2A1.7 1.7 0 1 0 6.5 4.8a1.7 1.7 0 0 0 0 3.4ZM5 9.5h3V19H5z" /><path d="M10 9.5h2.9v1.3h.04c.4-.76 1.39-1.57 2.86-1.57 3.06 0 3.63 2.02 3.63 4.64V19h-3v-4.55c0-1.09-.02-2.48-1.51-2.48-1.52 0-1.75 1.18-1.75 2.4V19h-3V9.5Z" /></>,
    github: <path fillRule="evenodd" d="M12 3.7a8.5 8.5 0 0 0-2.69 16.56c.43.08.58-.18.58-.41v-1.65c-2.38.52-2.88-1.01-2.88-1.01-.39-.99-.95-1.25-.95-1.25-.78-.53.06-.52.06-.52.86.06 1.31.88 1.31.88.77 1.31 2.01.93 2.5.71.08-.55.3-.93.54-1.15-1.9-.22-3.9-.95-3.9-4.2 0-.93.33-1.69.88-2.29-.09-.22-.38-1.08.08-2.25 0 0 .72-.23 2.34.87A8.14 8.14 0 0 1 12 7.7c.72 0 1.44.1 2.13.29 1.62-1.1 2.34-.87 2.34-.87.46 1.17.17 2.03.08 2.25.55.6.88 1.36.88 2.29 0 3.27-2 3.98-3.91 4.19.31.27.58.79.58 1.6v2.4c0 .23.15.5.59.41A8.5 8.5 0 0 0 12 3.7Z" clipRule="evenodd" />,
    "apple-music": <><path d="M16.9 4.5v9.63a2.76 2.76 0 1 1-1.35-2.37V7.35L9.5 8.6v6.92a2.76 2.76 0 1 1-1.35-2.37V6.42l8.75-1.92Z" /></>,
  };
  return <svg className={`founder-social-icon founder-social-icon-${platform}`} viewBox="0 0 24 24" aria-hidden="true">{paths[platform]}</svg>;
}

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
      <p className="col-span-12 chapter-label md:col-span-2">SYS // Capabilities</p>
      <div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0"><h2 id="services-title" className="section-title">Digital tools built around real work.</h2><p className="section-intro">From the first useful website to a purpose-built business system, we create the right level of technology for the problem.</p></div>
      <div className="col-span-12 mt-14 border-t border-line md:col-start-4 md:col-span-9">
        {capabilities.map(([classification, title, copy]) => <article key={title} className="capability-row"><p className="capability-classification">[{classification}]</p><h3>{title}</h3><p>{copy}</p></article>)}
        <Link href="#how-we-work" className="text-link mt-8">See how we work <span aria-hidden="true">→</span></Link>
      </div>
    </section>

    <section id="outcomes" className="editorial-grid home-section border-t border-line" aria-labelledby="outcomes-title">
      <p className="col-span-12 chapter-label md:col-span-2">Output // Business effect</p>
      <div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0"><h2 id="outcomes-title" className="secondary-title">What the right system actually changes.</h2></div>
      <div className="col-span-12 mt-12 grid gap-x-8 gap-y-10 border-t border-line pt-10 md:col-start-4 md:col-span-9 md:grid-cols-2">
        {outcomes.map(([title, copy]) => <div key={title}><p className="outcomes-label">{title}</p><p className="mt-3 text-sm leading-relaxed text-muted">{copy}</p></div>)}
      </div>
    </section>

    <section id="work" className="home-section border-t border-line" aria-labelledby="work-title">
      <div className="editorial-grid"><p className="col-span-12 chapter-label md:col-span-2">Index // Selected systems</p><div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0"><h2 id="work-title" className="section-title">Work you can point to.</h2><p className="section-intro">Websites, products and systems delivered for clients or developed by AiForm.</p></div></div>
      <div className="editorial-grid mt-14"><div className="col-span-12 border-t border-line md:col-start-4 md:col-span-9">
        {selectedWork.map((project, index) => <article key={project.id} className="work-row"><p className="work-number">0{index + 1}</p><div><p className="chapter-label">{project.type} / {project.status}</p><h3>{project.name}</h3><p className="mt-2 text-sm text-muted">{project.context}</p></div><div><p className="work-summary">{project.summary}</p><div className="mt-5 flex flex-wrap gap-5">{project.caseStudyUrl ? <Link href={project.caseStudyUrl} className="text-link">Case study <span aria-hidden="true">→</span></Link> : null}{project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-link" aria-label={`Visit ${project.name} (opens in a new tab)`}>Visit site <span aria-hidden="true">↗</span></a> : null}</div></div></article>)}
        <Link href="/work" className="button-secondary mt-10">View all work <span aria-hidden="true">→</span></Link>
      </div></div>
    </section>

    <section id="manifesto" className="editorial-grid home-section border-t border-line" aria-labelledby="manifesto-title">
      <p className="col-span-12 chapter-label md:col-span-2">04 / A studio for expensive assumptions</p>
      <div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0">
        <h2 id="manifesto-title" className="secondary-title">A studio for expensive assumptions.</h2>
        <ul className="manifesto-list">
          <li>The spreadsheet everyone works around.</li>
          <li>The process nobody questions.</li>
          <li>The system that almost works.</li>
          <li>The manual task that somehow became permanent.</li>
        </ul>
        <p className="manifesto-close">We look closely before we build.</p>
      </div>
    </section>

    <section id="approach" className="infrastructure-section border-t border-line" aria-labelledby="infrastructure-title">
      <div className="editorial-grid relative z-10 home-section"><p className="col-span-12 chapter-label md:col-span-2">Principle // Our approach</p><div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0"><h2 id="infrastructure-title" className="section-title">Useful digital infrastructure, shaped around the work.</h2><p className="section-intro text-text">We help organisations build what actually matters — from websites and internal tools to automation and purpose-built systems.</p><div className="philosophy-block"><p className="chapter-label">Noticed, not invented.</p><h3>We look for the problem people have learned to live with.</h3><p>Then we inspect the people, processes and constraints around it before deciding what should be built. The result is software grounded in the way the organisation actually works.</p></div></div></div>
    </section>

    <section id="how-we-work" className="editorial-grid home-section border-t border-line" aria-labelledby="process-title">
      <p className="col-span-12 chapter-label md:col-span-2">Method // Delivery</p><div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0"><h2 id="process-title" className="section-title">Clear from first conversation to working product.</h2></div>
      <div className="col-span-12 mt-14 grid border-t border-line md:col-start-4 md:col-span-9 md:grid-cols-3">{process.map(([number, title, copy], index) => <article key={title} className={`process-step ${index ? "md:border-l md:border-line md:pl-7" : "md:pr-7"}`}><p className="chapter-label">{number}</p><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </section>

    <section id="about" className="founder-section editorial-grid home-section border-t border-line" aria-labelledby="founder-title">
      <div className="founder-system" aria-hidden="true">
        <AiFormMark variant="green" className="founder-system-mark" />
        <svg className="founder-system-orbits" viewBox="0 0 900 620" fill="none">
          <ellipse className="founder-orbit founder-orbit-1" cx="330" cy="310" rx="235" ry="190" />
          <ellipse className="founder-orbit founder-orbit-2" cx="330" cy="310" rx="330" ry="255" />
          <ellipse className="founder-orbit founder-orbit-3" cx="330" cy="310" rx="440" ry="325" />
          <circle className="founder-node founder-node-1" cx="545" cy="232" r="5" />
          <circle className="founder-node founder-node-2" cx="159" cy="446" r="4" />
          <circle className="founder-node founder-node-3" cx="671" cy="411" r="5" />
        </svg>
      </div>
      <p className="col-span-12 chapter-label md:col-span-2">Origin // Founder-led</p>
      <div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0">
        <h2 id="founder-title" className="section-title">Built close to the problem.</h2>
        <div className="founder-row">
          <div>
            <Image src="/images/founder.jpg" alt="TE Motaung, Founder of AiForm Studio" width={104} height={104} className="founder-portrait" />
            <p className="founder-name">TE Motaung</p>
            <p className="founder-role">Founder &amp; Builder</p>
          </div>
          <p className="section-intro">AiForm Studio is led by TE Motaung, a builder based in Pretoria. The Studio grew from a simple approach: understand how people actually work, notice where systems create unnecessary friction, and build something better around that reality.</p>
        </div>
        <nav className="founder-elsewhere" aria-label="TE Motaung elsewhere">
          <p>Elsewhere</p>
          <div>
            <a href="https://www.tiktok.com/@touch0107" target="_blank" rel="noopener noreferrer" aria-label="TE Motaung on TikTok"><SocialIcon platform="tiktok" />TikTok <span aria-hidden="true">↗</span></a>
            <a href="https://www.facebook.com/profile.php?id=61552439923167" target="_blank" rel="noopener noreferrer" aria-label="TE Motaung on Facebook"><SocialIcon platform="facebook" />Facebook <span aria-hidden="true">↗</span></a>
            <a href="https://www.linkedin.com/in/thabiso-eric-motaung/" target="_blank" rel="noopener noreferrer" aria-label="TE Motaung on LinkedIn"><SocialIcon platform="linkedin" />LinkedIn <span aria-hidden="true">↗</span></a>
            <a href="https://github.com/ThabisoEricMotaung" target="_blank" rel="noopener noreferrer" aria-label="TE Motaung on GitHub"><SocialIcon platform="github" />GitHub <span aria-hidden="true">↗</span></a>
            <a href="https://music.apple.com/profile/touch694" target="_blank" rel="noopener noreferrer" aria-label="TE Motaung on Apple Music"><SocialIcon platform="apple-music" />Apple Music <span aria-hidden="true">↗</span></a>
          </div>
        </nav>
        <div className="trust-strip">
          <span>Founder-led</span><span aria-hidden="true">·</span>
          <span>Pretoria, South Africa</span><span aria-hidden="true">·</span>
          <span>B-BBEE Level 1 Contributor</span><span aria-hidden="true">·</span>
          <span>AiForm Studio (Pty) Ltd</span>
        </div>
      </div>
    </section>

    <section className="editorial-grid home-section border-t border-line" aria-labelledby="contact-title"><p className="col-span-12 chapter-label md:col-span-2">Input // Start a project</p><div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0"><h2 id="contact-title" className="section-title">Have something your business needs to work better?</h2><p className="section-intro">Tell us what you are trying to solve. You do not need a technical brief.</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/contact" className="button-primary">Start a project <span aria-hidden="true">→</span></Link><a href="mailto:aiformstudio@gmail.com" className="button-secondary">Email us</a></div></div></section>
  </>;
}
