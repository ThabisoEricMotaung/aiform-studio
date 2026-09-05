import Image from "next/image";
import Link from "next/link";
import PretoriaPhoto from "@/components/PretoriaPhoto";
import { AiFormMark } from "@/components/AiFormLockup";
import ProjectShowcase from "@/components/ProjectShowcase";
import CalendlyBooking from "@/components/contact/CalendlyBooking";
import WhatsAppLink from "@/components/contact/WhatsAppLink";

const capabilities = [
  ["Websites", "Clear digital entry points built around what customers need to do."],
  ["Business Systems", "Replace fragmented spreadsheets, manual admin and disconnected workflows with purpose-built systems."],
  ["Automation & AI", "Use automation or AI where it removes real friction — not because it is fashionable."],
  ["How We Work", "Understand the problem first, then design around the actual workflow."],
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
        <h1 id="home-title" className="home-hero-title">We build what your business actually needs.</h1>
        <p className="home-hero-copy">Websites, systems and digital tools built around how your business works — not a template stretched to fit.</p>
        <div className="mt-7 flex flex-wrap gap-3"><Link href="/contact" className="button-primary">Get in touch <span aria-hidden="true">→</span></Link><Link href="/work" className="button-secondary">See our work <span aria-hidden="true">→</span></Link></div>
        <p className="mt-8 text-sm text-muted">A founder-led digital product studio based in Pretoria, South Africa.</p>
      </div>
      <PretoriaPhoto />
    </section>

    <section id="services" className="services-section editorial-grid home-section border-t border-line" aria-labelledby="services-title">
      <p className="col-span-12 chapter-label md:col-span-2">SYS // Capabilities</p>
      <div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0"><h2 id="services-title" className="section-title">Digital tools built around real work.</h2><p className="section-intro">From the first useful website to a purpose-built business system, we create the right level of technology for the problem.</p></div>
      <div className="col-span-12 mt-10 border-t border-line md:col-start-4 md:col-span-9">
        {capabilities.map(([title, copy]) => <article key={title} className="service-row"><h3>{title}</h3><p>{copy}</p></article>)}
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

    <ProjectShowcase immersive />

    <section id="manifesto" className="manifesto-spread editorial-grid border-t border-line" aria-labelledby="manifesto-title">
      <svg className="manifesto-field" viewBox="0 0 1440 680" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="none">
        <path d="M-100 165H260C420 165 380 445 545 445H890" />
        <path d="M180 760V510C180 390 405 365 405 500C405 630 250 615 250 500V-80" />
        <path d="M1550 60H1170C1030 60 1100 445 920 445" />
        <path d="M1530 610H1150C995 610 1040 445 920 445" />
        <circle cx="912" cy="445" r="5" />
      </svg>
      <p className="chapter-label manifesto-eyebrow">Principle</p>
      <h2 id="manifesto-title" className="secondary-title">A studio for expensive assumptions.</h2>
      <div className="manifesto-observations">
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
      <div className="col-span-12 mt-10 grid border-t border-line md:col-start-4 md:col-span-9 md:grid-cols-3">{process.map(([number, title, copy], index) => <article key={title} className={`process-step ${index ? "md:border-l md:border-line md:pl-7" : "md:pr-7"}`}><p className="chapter-label">{number}</p><h3>{title}</h3><p>{copy}</p></article>)}</div>
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
            <Image src="/images/founder.jpg" alt="TE Motaung, Founder of AiForm Studio" width={116} height={116} className="founder-portrait" />
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
      <p className="col-span-12 chapter-label md:col-span-2">Contact</p>
      <div className="col-span-12 mt-8 md:col-start-4 md:col-span-8 md:mt-0">
        <h2 id="contact-title" className="section-title">Need to talk something through?</h2>
        <p className="section-intro">Tell us what you&apos;re trying to solve. You don&apos;t need a technical brief.</p>
        <div className="home-contact-actions">
          <Link href="/contact" className="button-primary">Get in touch <span aria-hidden="true">→</span></Link>
          <div className="home-contact-methods">
            <a href="mailto:aiformstudio@gmail.com" className="text-link">Email</a>
            <CalendlyBooking triggerLabel="Book a conversation" triggerSubtitle="" triggerClassName="text-link" />
            <WhatsAppLink title="WhatsApp" subtitle="" className="text-link" />
          </div>
        </div>
      </div>
    </section>
  </>;
}
