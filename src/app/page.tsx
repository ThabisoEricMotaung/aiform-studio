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
        <div className="mt-7 flex flex-wrap gap-3"><Link href="/contact" className="button-primary">Get in touch <span aria-hidden="true">→</span></Link><Link href="/work" className="button-secondary">See our work <span aria-hidden="true">→</span></Link></div>
        <p className="mt-8 text-sm text-muted">A founder-led digital product studio based in Pretoria, South Africa.</p>
      </div>
      <PretoriaPhoto />
    </section>

    <section id="services" className="services-section editorial-grid home-section border-t border-line relative" aria-labelledby="services-title">
      <svg className="services-system-diagram" viewBox="0 0 1200 700" preserveAspectRatio="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="layer-grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(23,59,44,0.04)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="1200" height="700" fill="url(#layer-grid)" opacity="0.6"/>
        <g className="services-capability-icons" opacity="0.4">
          <g className="services-icon services-icon-websites" transform="translate(120,266)">
            <rect x="0" y="0" width="170" height="62" rx="4" fill="none" stroke="rgba(23,59,44,0.55)" strokeWidth="1.5"/>
            <line x1="0" y1="16" x2="170" y2="16" stroke="rgba(23,59,44,0.4)" strokeWidth="1"/>
            <circle cx="10" cy="8" r="2" fill="rgba(182,138,58,0.8)"/>
            <circle cx="18" cy="8" r="2" fill="rgba(23,59,44,0.3)"/>
            <circle cx="26" cy="8" r="2" fill="rgba(23,59,44,0.3)"/>
            <line x1="14" y1="28" x2="120" y2="28" stroke="rgba(23,59,44,0.35)" strokeWidth="1.5"/>
            <line x1="14" y1="40" x2="150" y2="40" stroke="rgba(23,59,44,0.25)" strokeWidth="1"/>
            <line x1="14" y1="50" x2="90" y2="50" stroke="rgba(23,59,44,0.25)" strokeWidth="1"/>
          </g>
          <g className="services-icon services-icon-systems" transform="translate(120,334)">
            <rect x="0" y="0" width="150" height="18" rx="2" fill="none" stroke="rgba(23,59,44,0.5)" strokeWidth="1.5"/>
            <line x1="0" y1="9" x2="150" y2="9" stroke="rgba(23,59,44,0.25)" strokeWidth="0.75"/>
            <rect x="0" y="26" width="150" height="18" rx="2" fill="none" stroke="rgba(23,59,44,0.45)" strokeWidth="1.5"/>
            <line x1="0" y1="35" x2="150" y2="35" stroke="rgba(23,59,44,0.22)" strokeWidth="0.75"/>
            <rect x="0" y="52" width="150" height="18" rx="2" fill="none" stroke="rgba(23,59,44,0.4)" strokeWidth="1.5"/>
            <line x1="0" y1="61" x2="150" y2="61" stroke="rgba(23,59,44,0.2)" strokeWidth="0.75"/>
            <circle cx="158" cy="9" r="2.5" fill="rgba(182,138,58,0.7)"/>
            <circle cx="158" cy="35" r="2" fill="rgba(182,138,58,0.5)"/>
            <circle cx="158" cy="61" r="1.5" fill="rgba(182,138,58,0.4)"/>
            <line x1="158" y1="9" x2="158" y2="61" stroke="rgba(23,59,44,0.2)" strokeWidth="1"/>
          </g>
          <g className="services-icon services-icon-automation" transform="translate(120,415)">
            <line x1="20" y1="15" x2="75" y2="40" stroke="rgba(23,59,44,0.3)" strokeWidth="1"/>
            <line x1="130" y1="15" x2="75" y2="40" stroke="rgba(23,59,44,0.3)" strokeWidth="1"/>
            <line x1="20" y1="65" x2="75" y2="40" stroke="rgba(23,59,44,0.3)" strokeWidth="1"/>
            <line x1="130" y1="65" x2="75" y2="40" stroke="rgba(23,59,44,0.3)" strokeWidth="1"/>
            <circle cx="20" cy="15" r="4" fill="none" stroke="rgba(23,59,44,0.5)" strokeWidth="1.25"/>
            <circle cx="130" cy="15" r="4" fill="none" stroke="rgba(23,59,44,0.5)" strokeWidth="1.25"/>
            <circle cx="20" cy="65" r="4" fill="none" stroke="rgba(23,59,44,0.5)" strokeWidth="1.25"/>
            <circle cx="130" cy="65" r="4" fill="none" stroke="rgba(23,59,44,0.5)" strokeWidth="1.25"/>
            <circle cx="75" cy="40" r="6" fill="rgba(182,138,58,0.75)"/>
          </g>
          <g className="services-icon services-icon-method" transform="translate(115,501)">
            <line x1="0" y1="20" x2="160" y2="20" stroke="rgba(23,59,44,0.35)" strokeWidth="1.25"/>
            <circle cx="0" cy="20" r="4" fill="rgba(182,138,58,0.8)"/>
            <circle cx="53" cy="20" r="3.5" fill="none" stroke="rgba(23,59,44,0.5)" strokeWidth="1.25"/>
            <circle cx="106" cy="20" r="3.5" fill="none" stroke="rgba(23,59,44,0.5)" strokeWidth="1.25"/>
            <circle cx="160" cy="20" r="4" fill="none" stroke="rgba(23,59,44,0.5)" strokeWidth="1.25"/>
            <path d="M 152 12 L 160 20 L 152 28" fill="none" stroke="rgba(23,59,44,0.5)" strokeWidth="1.25"/>
          </g>
        </g>
        <g className="services-routing" opacity="0.24">
          <path d="M 600 100 Q 700 150 800 120" stroke="rgba(23,59,44,0.5)" strokeWidth="1.25" fill="none"/>
          <path d="M 600 250 Q 750 300 880 280" stroke="rgba(23,59,44,0.4)" strokeWidth="1.25" fill="none"/>
          <circle cx="600" cy="100" r="2.5" fill="rgba(182,138,58,0.7)"/>
          <circle cx="800" cy="120" r="2.5" fill="rgba(182,138,58,0.6)"/>
          <circle cx="880" cy="280" r="2" fill="rgba(182,138,58,0.5)"/>
        </g>
      </svg>
      <p className="col-span-12 chapter-label md:col-span-2">SYS // Capabilities</p>
      <div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0"><h2 id="services-title" className="section-title">Digital tools built around real work.</h2><p className="section-intro">From the first useful website to a purpose-built business system, we create the right level of technology for the problem.</p></div>
      <div className="col-span-12 mt-14 border-t border-line md:col-start-4 md:col-span-9">
        {capabilities.map(([classification, title, copy]) => <article key={title} className="capability-row"><p className="capability-classification">[{classification}]</p><h3>{title}</h3><p>{copy}</p></article>)}
        <Link href="#how-we-work" className="text-link mt-8">See how we work <span aria-hidden="true">→</span></Link>
      </div>
    </section>

    <section id="outcomes" className="outcomes-section editorial-grid home-section border-t border-line relative" aria-labelledby="outcomes-title">
      <svg className="outcomes-system-diagram" viewBox="0 0 1200 500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <g className="outcomes-incoming" opacity="0.28">
          <circle cx="140" cy="60" r="3" fill="rgba(182,138,58,0.8)"/>
          <path d="M 140 60 Q 300 150 480 280" stroke="rgba(23,59,44,0.3)" strokeWidth="1.25" fill="none"/>
          <circle cx="180" cy="100" r="2.5" fill="rgba(182,138,58,0.6)"/>
          <path d="M 180 100 Q 320 180 480 280" stroke="rgba(23,59,44,0.25)" strokeWidth="1" fill="none" strokeDasharray="2,3"/>
          <circle cx="120" cy="140" r="2" fill="rgba(182,138,58,0.5)"/>
          <path d="M 120 140 Q 280 200 480 280" stroke="rgba(23,59,44,0.2)" strokeWidth="1" fill="none"/>
          <circle cx="200" cy="180" r="2.5" fill="rgba(182,138,58,0.5)"/>
          <path d="M 200 180 Q 340 220 480 280" stroke="rgba(23,59,44,0.22)" strokeWidth="1" fill="none"/>
        </g>
        <g className="outcomes-convergence" opacity="0.28">
          <circle cx="480" cy="280" r="5" fill="none" stroke="rgba(182,138,58,0.7)" strokeWidth="1.5"/>
          <circle cx="480" cy="280" r="8" fill="none" stroke="rgba(23,59,44,0.2)" strokeWidth="1"/>
          <path d="M 480 280 L 720 320" stroke="rgba(23,59,44,0.35)" strokeWidth="1.25" fill="none"/>
          <path d="M 485 275 L 740 310" stroke="rgba(23,59,44,0.3)" strokeWidth="1" fill="none"/>
          <circle cx="740" cy="310" r="3" fill="rgba(182,138,58,0.6)"/>
          <line x1="720" y1="320" x2="1000" y2="320" stroke="rgba(23,59,44,0.15)" strokeWidth="1"/>
        </g>
      </svg>
      <p className="col-span-12 chapter-label md:col-span-2">Output // Business effect</p>
      <div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0"><h2 id="outcomes-title" className="secondary-title">What the right system actually changes.</h2></div>
      <div className="col-span-12 mt-12 grid gap-x-8 gap-y-10 border-t border-line pt-10 md:col-start-4 md:col-span-9 md:grid-cols-2">
        {outcomes.map(([title, copy]) => <div key={title}><p className="outcomes-label">{title}</p><p className="mt-3 text-sm leading-relaxed text-muted">{copy}</p></div>)}
      </div>
    </section>

    <section id="work" className="work-section home-section border-t border-line relative" aria-labelledby="work-title">
      <svg className="work-system-diagram" viewBox="0 0 1200 800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="work-grid" width="120" height="120" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="120" y2="0" stroke="rgba(23,59,44,0.04)" strokeWidth="0.5"/>
            <line x1="0" y1="0" x2="0" y2="120" stroke="rgba(23,59,44,0.04)" strokeWidth="0.5"/>
            <line x1="0" y1="60" x2="4" y2="60" stroke="rgba(23,59,44,0.06)" strokeWidth="0.5"/>
            <line x1="60" y1="0" x2="60" y2="4" stroke="rgba(23,59,44,0.06)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="1200" height="800" fill="url(#work-grid)" opacity="0.5"/>
        <g className="work-alignment" opacity="0.24">
          <line x1="50" y1="0" x2="50" y2="800" stroke="rgba(23,59,44,0.3)" strokeWidth="1" strokeDasharray="5,5"/>
          <line x1="350" y1="0" x2="350" y2="800" stroke="rgba(23,59,44,0.3)" strokeWidth="1" strokeDasharray="5,5"/>
          <line x1="950" y1="0" x2="950" y2="800" stroke="rgba(23,59,44,0.3)" strokeWidth="1" strokeDasharray="5,5"/>
          <line x1="0" y1="100" x2="1200" y2="100" stroke="rgba(23,59,44,0.2)" strokeWidth="0.75" strokeDasharray="4,4"/>
          <line x1="0" y1="300" x2="1200" y2="300" stroke="rgba(23,59,44,0.2)" strokeWidth="0.75" strokeDasharray="4,4"/>
          <circle cx="50" cy="100" r="2.5" fill="rgba(182,138,58,0.5)"/>
          <circle cx="350" cy="300" r="2" fill="rgba(182,138,58,0.4)"/>
          <circle cx="950" cy="200" r="2" fill="rgba(182,138,58,0.4)"/>
        </g>
      </svg>
      <div className="editorial-grid"><p className="col-span-12 chapter-label md:col-span-2">Index // Selected systems</p><div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0"><h2 id="work-title" className="section-title">Work you can point to.</h2><p className="section-intro">Websites, products and systems delivered for clients or developed by AiForm.</p></div></div>
      <div className="editorial-grid mt-14"><div className="col-span-12 border-t border-line md:col-start-4 md:col-span-9">
        {selectedWork.map((project, index) => <article key={project.id} className="work-row"><p className="work-number">0{index + 1}</p><div><p className="chapter-label">{project.type} / {project.status}</p><h3>{project.name}</h3><p className="mt-2 text-sm text-muted">{project.context}</p></div><div><p className="work-summary">{project.summary}</p><div className="mt-5 flex flex-wrap gap-5">{project.caseStudyUrl ? <Link href={project.caseStudyUrl} className="text-link">Case study <span aria-hidden="true">→</span></Link> : null}{project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-link" aria-label={`Visit ${project.name} (opens in a new tab)`}>Visit site <span aria-hidden="true">↗</span></a> : null}</div></div></article>)}
        <Link href="/work" className="button-secondary mt-10">View all work <span aria-hidden="true">→</span></Link>
      </div></div>
    </section>

    <section id="manifesto" className="manifesto-section editorial-grid home-section border-t border-line relative overflow-hidden" aria-labelledby="manifesto-title">
      <svg className="manifesto-system-diagram" viewBox="0 0 1200 700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <g className="manifesto-friction-primary">
          <path className="manifesto-path manifesto-path-arc" d="M 1300 50 C 1500 200 1500 450 1300 650" stroke="rgba(23,59,44,0.6)" strokeWidth="1.25" fill="none" opacity="0.09"/>
          <path className="manifesto-path manifesto-path-miss" d="M 1350 -60 C 1300 30 1260 110 1240 200 C 1232 240 1228 275 1225 305" stroke="rgba(23,59,44,0.6)" strokeWidth="1.5" fill="none" opacity="0.1"/>
          <path className="manifesto-path manifesto-path-loop" d="M -80 620 C 20 560 110 520 200 480 C 230 460 220 420 170 410 C 120 400 50 440 0 520" stroke="rgba(23,59,44,0.6)" strokeWidth="1.25" fill="none" opacity="0.07"/>
          <path className="manifesto-path manifesto-path-terminate" d="M 650 800 C 660 740 675 680 685 640 C 688 625 690 615 690 610" stroke="rgba(23,59,44,0.6)" strokeWidth="1" fill="none" strokeDasharray="4,4" opacity="0.06"/>

          <circle className="manifesto-node-primary-ring" cx="1260" cy="260" r="11" fill="none" stroke="rgba(182,138,58,0.7)" strokeWidth="1"/>
          <circle className="manifesto-node-primary" cx="1260" cy="260" r="5" fill="rgba(182,138,58,0.95)"/>
        </g>
        <g className="manifesto-friction-secondary">
          <circle cx="1225" cy="305" r="3" fill="rgba(182,138,58,0.9)" opacity="0.4"/>
          <circle cx="690" cy="610" r="2.5" fill="rgba(182,138,58,0.9)" opacity="0.35"/>
          <line x1="672" y1="610" x2="708" y2="610" stroke="rgba(23,59,44,0.6)" strokeWidth="1" opacity="0.18"/>

          <line x1="1340" y1="195" x2="1275" y2="265" stroke="rgba(23,59,44,0.6)" strokeWidth="0.75" opacity="0.06"/>
          <line x1="1347" y1="206" x2="1282" y2="276" stroke="rgba(23,59,44,0.6)" strokeWidth="0.75" opacity="0.06"/>

          <g className="manifesto-crosshair" transform="translate(70,105)"><line x1="-6" y1="0" x2="6" y2="0" stroke="rgba(23,59,44,0.6)" strokeWidth="1"/><line x1="0" y1="-6" x2="0" y2="6" stroke="rgba(23,59,44,0.6)" strokeWidth="1"/></g>
          <g className="manifesto-crosshair" transform="translate(1160,600)"><line x1="-6" y1="0" x2="6" y2="0" stroke="rgba(23,59,44,0.6)" strokeWidth="1"/><line x1="0" y1="-6" x2="0" y2="6" stroke="rgba(23,59,44,0.6)" strokeWidth="1"/></g>
          <g className="manifesto-crosshair" transform="translate(230,560)"><line x1="-6" y1="0" x2="6" y2="0" stroke="rgba(23,59,44,0.6)" strokeWidth="1"/><line x1="0" y1="-6" x2="0" y2="6" stroke="rgba(23,59,44,0.6)" strokeWidth="1"/></g>
        </g>
        <g className="manifesto-signal-group">
          <circle className="manifesto-signal" r="4" fill="var(--color-gold)">
            <animateMotion dur="16s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.05;0.68;0.78;1" keyPoints="0;0;1;1;1" path="M 1350 -60 C 1300 30 1260 110 1240 200 C 1232 240 1228 275 1225 305"/>
            <animate attributeName="opacity" dur="16s" repeatCount="indefinite" keyTimes="0;0.05;0.68;0.78;1" values="0;1;1;0;0"/>
          </circle>
          <circle className="manifesto-signal-static" cx="1225" cy="305" r="4" fill="var(--color-gold)"/>
        </g>
        <g className="manifesto-mobile-friction">
          <path d="M 280 990 Q 550 950 760 1020" stroke="rgba(23,59,44,0.6)" strokeWidth="1.5" fill="none" opacity="0.14"/>
          <circle cx="800" cy="1035" r="4" fill="rgba(182,138,58,0.95)"/>
        </g>
      </svg>
      <p className="col-span-12 chapter-label md:col-span-2">Principle // Expensive assumptions</p>
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

    <section id="approach" className="approach-section infrastructure-section border-t border-line relative" aria-labelledby="infrastructure-title">
      <svg className="approach-system-diagram" viewBox="0 0 1200 600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <g className="approach-construction" opacity="0.18">
          <path d="M 200 300 A 200 200 0 0 1 400 100" stroke="rgba(23,59,44,0.4)" strokeWidth="1.5" fill="none"/>
          <path d="M 300 150 A 150 150 0 0 1 450 200" stroke="rgba(23,59,44,0.3)" strokeWidth="1" fill="none"/>
          <line x1="200" y1="100" x2="200" y2="500" stroke="rgba(23,59,44,0.25)" strokeWidth="1" strokeDasharray="5,5"/>
          <line x1="400" y1="100" x2="400" y2="500" stroke="rgba(23,59,44,0.25)" strokeWidth="1" strokeDasharray="5,5"/>
          <line x1="600" y1="100" x2="600" y2="500" stroke="rgba(23,59,44,0.2)" strokeWidth="1" strokeDasharray="5,5"/>
          <line x1="100" y1="250" x2="1100" y2="250" stroke="rgba(23,59,44,0.2)" strokeWidth="1" strokeDasharray="4,4"/>
          <circle cx="400" cy="200" r="4" fill="rgba(182,138,58,0.6)"/>
          <circle cx="300" cy="350" r="3" fill="rgba(182,138,58,0.5)"/>
          <circle cx="550" cy="280" r="3" fill="rgba(182,138,58,0.4)"/>
          <path d="M 650 200 L 750 350 L 850 220" stroke="rgba(23,59,44,0.15)" strokeWidth="1" fill="none"/>
          <text x="750" y="295" fontSize="9" fill="rgba(23,59,44,0.15)" fontFamily="monospace" fontWeight="400">INTERSECT</text>
          <path d="M 200 450 Q 450 500 700 450" stroke="rgba(23,59,44,0.12)" strokeWidth="1.25" fill="none" strokeDasharray="3,2"/>
        </g>
      </svg>
      <div className="editorial-grid relative z-10 home-section"><p className="col-span-12 chapter-label md:col-span-2">Principle // Our approach</p><div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0"><h2 id="infrastructure-title" className="section-title">Useful digital infrastructure, shaped around the work.</h2><p className="section-intro text-text">We help organisations build what actually matters — from websites and internal tools to automation and purpose-built systems.</p><div className="philosophy-block"><p className="chapter-label">Noticed, not invented.</p><h3>We look for the problem people have learned to live with.</h3><p>Then we inspect the people, processes and constraints around it before deciding what should be built. The result is software grounded in the way the organisation actually works.</p></div></div></div>
    </section>

    <section id="how-we-work" className="method-section editorial-grid home-section border-t border-line relative" aria-labelledby="process-title">
      <svg className="method-system-diagram" viewBox="0 0 1200 500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <g className="method-pathway" opacity="0.24">
          <circle cx="150" cy="250" r="6" fill="none" stroke="rgba(23,59,44,0.4)" strokeWidth="1.5"/>
          <circle cx="150" cy="250" r="3" fill="rgba(182,138,58,0.7)"/>
          <path d="M 156 250 L 350 250" stroke="rgba(23,59,44,0.35)" strokeWidth="1.25"/>
          <circle cx="400" cy="250" r="5" fill="none" stroke="rgba(23,59,44,0.35)" strokeWidth="1.5"/>
          <path d="M 405 250 L 550 250" stroke="rgba(23,59,44,0.3)" strokeWidth="1.25"/>
          <circle cx="600" cy="250" r="5" fill="none" stroke="rgba(23,59,44,0.3)" strokeWidth="1.5"/>
          <path d="M 605 250 L 750 250" stroke="rgba(23,59,44,0.25)" strokeWidth="1.25" strokeDasharray="3,3"/>
          <circle cx="800" cy="250" r="4" fill="none" stroke="rgba(23,59,44,0.25)" strokeWidth="1"/>
          <path d="M 804 250 L 950 250" stroke="rgba(23,59,44,0.2)" strokeWidth="1"/>
          <circle cx="1000" cy="250" r="4" fill="rgba(182,138,58,0.5)"/>
          <circle cx="1000" cy="250" r="7" fill="none" stroke="rgba(23,59,44,0.2)" strokeWidth="1"/>

          <line x1="150" y1="230" x2="150" y2="180" stroke="rgba(23,59,44,0.2)" strokeWidth="1"/>
          <text x="155" y="175" fontSize="8" fill="rgba(23,59,44,0.2)" fontFamily="monospace" fontWeight="400">START</text>

          <line x1="400" y1="240" x2="400" y2="160" stroke="rgba(23,59,44,0.18)" strokeWidth="1"/>
          <text x="405" y="155" fontSize="8" fill="rgba(23,59,44,0.18)" fontFamily="monospace" fontWeight="400">SHAPE</text>

          <line x1="600" y1="235" x2="600" y2="140" stroke="rgba(23,59,44,0.16)" strokeWidth="1"/>
          <text x="605" y="135" fontSize="8" fill="rgba(23,59,44,0.16)" fontFamily="monospace" fontWeight="400">BUILD</text>

          <line x1="800" y1="240" x2="800" y2="160" stroke="rgba(23,59,44,0.15)" strokeWidth="1"/>
          <text x="805" y="155" fontSize="8" fill="rgba(23,59,44,0.15)" fontFamily="monospace" fontWeight="400">REFINE</text>

          <line x1="1000" y1="230" x2="1000" y2="180" stroke="rgba(23,59,44,0.15)" strokeWidth="1" strokeDasharray="2,2"/>
          <text x="1005" y="175" fontSize="8" fill="rgba(23,59,44,0.15)" fontFamily="monospace" fontWeight="400">SUPPORT</text>

          <path d="M 200 320 Q 600 420 1000 320" stroke="rgba(23,59,44,0.1)" strokeWidth="1" fill="none"/>
        </g>
      </svg>
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

    <section className="input-section editorial-grid home-section border-t border-line relative" aria-labelledby="contact-title">
      <svg className="input-system-diagram" viewBox="0 0 1200 600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="blueprint-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="60" y2="0" stroke="rgba(23,59,44,0.05)" strokeWidth="0.4"/>
            <line x1="0" y1="0" x2="0" y2="60" stroke="rgba(23,59,44,0.05)" strokeWidth="0.4"/>
            <line x1="0" y1="30" x2="4" y2="30" stroke="rgba(23,59,44,0.08)" strokeWidth="0.3"/>
            <line x1="30" y1="0" x2="30" y2="4" stroke="rgba(23,59,44,0.08)" strokeWidth="0.3"/>
          </pattern>
        </defs>
        <rect width="1200" height="600" fill="url(#blueprint-grid)" opacity="0.6"/>
        <g className="input-blueprint" opacity="0.20">
          <rect x="150" y="100" width="280" height="160" rx="2" stroke="rgba(23,59,44,0.35)" strokeWidth="1.5" fill="none"/>
          <line x1="150" y1="140" x2="430" y2="140" stroke="rgba(23,59,44,0.25)" strokeWidth="0.75"/>
          <line x1="150" y1="180" x2="430" y2="180" stroke="rgba(23,59,44,0.2)" strokeWidth="0.75"/>
          <line x1="250" y1="100" x2="250" y2="260" stroke="rgba(23,59,44,0.2)" strokeWidth="0.75"/>

          <rect x="500" y="100" width="280" height="160" rx="2" stroke="rgba(23,59,44,0.3)" strokeWidth="1.5" fill="none"/>
          <line x1="500" y1="140" x2="780" y2="140" stroke="rgba(23,59,44,0.22)" strokeWidth="0.75"/>
          <line x1="500" y1="180" x2="780" y2="180" stroke="rgba(23,59,44,0.18)" strokeWidth="0.75"/>
          <line x1="600" y1="100" x2="600" y2="260" stroke="rgba(23,59,44,0.18)" strokeWidth="0.75"/>

          <line x1="430" y1="130" x2="500" y2="130" stroke="rgba(23,59,44,0.2)" strokeWidth="1.25"/>
          <circle cx="465" cy="130" r="2.5" fill="rgba(182,138,58,0.6)"/>

          <line x1="100" y1="350" x2="1100" y2="350" stroke="rgba(23,59,44,0.15)" strokeWidth="1"/>
          <line x1="100" y1="365" x2="1100" y2="365" stroke="rgba(23,59,44,0.12)" strokeWidth="1"/>
          <line x1="100" y1="380" x2="1100" y2="380" stroke="rgba(23,59,44,0.12)" strokeWidth="1"/>
          <line x1="100" y1="395" x2="1100" y2="395" stroke="rgba(23,59,44,0.12)" strokeWidth="1"/>

          <line x1="350" y1="330" x2="350" y2="450" stroke="rgba(23,59,44,0.15)" strokeWidth="1"/>
          <line x1="550" y1="330" x2="550" y2="450" stroke="rgba(23,59,44,0.15)" strokeWidth="1"/>
          <line x1="750" y1="330" x2="750" y2="450" stroke="rgba(23,59,44,0.15)" strokeWidth="1"/>
          <line x1="950" y1="330" x2="950" y2="450" stroke="rgba(23,59,44,0.12)" strokeWidth="1"/>

          <circle cx="450" cy="372" r="2" fill="rgba(182,138,58,0.5)"/>
          <circle cx="850" cy="387" r="2" fill="rgba(182,138,58,0.4)"/>

          <path d="M 800 200 L 900 300 L 950 250 L 850 180 Z" stroke="rgba(23,59,44,0.1)" strokeWidth="1" fill="none" strokeDasharray="2,3"/>
        </g>
      </svg>
      <p className="col-span-12 chapter-label md:col-span-2">Input // Get in touch</p><div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0"><h2 id="contact-title" className="section-title">Have something your business needs to work better?</h2><p className="section-intro">Tell us what you are trying to solve. You do not need a technical brief.</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/contact" className="button-primary">Get in touch <span aria-hidden="true">→</span></Link><a href="mailto:aiformstudio@gmail.com" className="button-secondary">Email us</a></div></div>
    </section>
  </>;
}
