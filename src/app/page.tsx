import Image from "next/image";
import Link from "next/link";
import DeskGraphic from "@/components/DeskGraphic";
import ProjectCard from "@/components/ProjectCard";

const projects = [
  ["AiForm Procure", "Product", "A procurement system built around fragmented information, compliance, and trust.", "Live · Pilot phase", "https://www.aiformprocure.co.za", "var(--color-green)"],
  ["Residential Construction Portfolio Site", "Website", "A clear, credible portfolio site for a residential construction business.", "Delivered", undefined, "var(--color-clay)"],
  ["Kutlwano Tutoring", "Website", "A focused site bringing two tutoring audiences and pricing models into one clear experience.", "Live", "https://kutlwanotutoring.co.za", "var(--color-sage)"],
  ["Mathabo Crochet", "Brand pack", "A visual brand foundation for a handmade crochet business.", "Delivered · No site", undefined, "var(--color-gold)"],
] as const;

const experiments = [
  ["AutoDesign Studio", "Exploring how AI can support faster, more deliberate design work."],
  ["Vibe Coders Hub", "Exploring a more accessible way into building with code."],
  ["AI Builder Collective", "Exploring what a community around practical AI building could become."],
  ["AiForm Construct", "Exploring tools for clearer construction information and decisions."],
] as const;

export default function Home() {
  return (
    <>
      <section className="px-6 md:px-14 py-20 md:py-28 border-b border-line">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1.35fr_0.65fr] items-center gap-12">
          <div><p className="chapter-label mb-7">A studio for expensive assumptions</p><h1 className="font-display text-[56px] sm:text-[72px] lg:text-[96px] leading-[0.92] tracking-[-0.03em] max-w-4xl">Noticed,<br /><em className="text-green">not invented.</em></h1><p className="font-sans text-lg text-muted max-w-xl mt-8 leading-relaxed">We look for places where people are still expected to trust what hasn&apos;t been verified, then build systems that change that.</p><div className="flex flex-wrap gap-8 items-center mt-10"><Link href="/contact" className="font-sans text-sm bg-green text-bg px-6 py-3.5 hover:bg-green/90 transition-colors">Start a project →</Link><p className="font-display italic text-lg text-clay">Less assumption. More evidence.</p></div></div>
          <div className="hidden md:flex justify-end"><DeskGraphic /></div>
        </div>
      </section>

      <section className="px-6 py-20 md:py-28"><div className="max-w-4xl mx-auto grid md:grid-cols-[180px_1fr] gap-8"><div><p className="chapter-label">01 / Our Principle</p><div className="rule-gold mt-4" /></div><div><h2 className="font-display text-4xl md:text-6xl leading-[1.04]">Don&apos;t assume.<br /><em>Observe, test, verify.</em></h2><p className="text-muted text-lg mt-7 max-w-xl">The fix isn&apos;t always AI, and it isn&apos;t always the same fix twice.</p></div></div></section>

      <section id="engine" className="px-6 py-20 md:py-28 bg-bg-alt border-y border-line"><div className="max-w-5xl mx-auto"><p className="chapter-label mb-6">02 / The AiForm Engine</p><h2 className="font-display text-4xl md:text-6xl max-w-3xl leading-tight">What are people currently being asked to assume?</h2><div className="font-display text-3xl md:text-5xl text-green mt-14 flex flex-wrap items-center gap-x-4 gap-y-2"><span>Parse</span><span className="text-gold">—</span><span>Verify</span><span className="text-gold">—</span><span>Understand</span><span className="text-gold">—</span><span>Match</span></div><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10 text-sm text-muted leading-relaxed"><p>Give messy, real-world input a useful shape.</p><p>Check a claim against evidence, not convenience.</p><p>Turn evidence into something a person can act on.</p><p>Connect the right buyer, supplier, answer, or fit.</p></div><p className="mt-12 max-w-2xl text-muted leading-relaxed">Sometimes the problem needs this sequence. Sometimes it needs something else. The tool follows the problem.</p></div></section>

      <section id="work" className="px-6 py-20 md:py-28"><div className="max-w-5xl mx-auto"><p className="chapter-label mb-6">03 / Built by AiForm</p><div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12"><h2 className="font-display text-4xl md:text-6xl">Products, studio work,<br /><em>and experiments.</em></h2><p className="text-sm text-muted max-w-xs">Different outputs, shaped by the same instinct: notice what is unclear, then make it useful.</p></div><div className="grid md:grid-cols-2 gap-5">{projects.map(([name, tag, desc, status, href, accent]) => <ProjectCard key={name} name={name} tag={tag} desc={desc} status={status} href={href} accent={accent} />)}</div><h3 className="chapter-label mt-14 mb-5">Unlaunched experiments</h3><div className="grid md:grid-cols-2 gap-5">{experiments.map(([name, desc]) => <ProjectCard key={name} name={name} tag="Experiment" desc={desc} status="Exploring" accent="var(--color-muted)" />)}</div></div></section>

      <section id="founder" className="px-6 py-20 md:py-28 bg-bg-alt border-y border-line"><div className="max-w-5xl mx-auto grid md:grid-cols-[0.8fr_1.2fr] gap-12 md:gap-20 items-center"><div><div className="relative aspect-[4/5] max-w-sm"><Image src="/images/founder.jpg" alt="Thabiso Eric Motaung, founder of AiForm Studio" fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover grayscale" /></div></div><div><p className="chapter-label mb-6">04 / The Founder</p><h2 className="font-display text-4xl md:text-6xl leading-tight">One person.<br /><em>One engine.</em></h2><p className="text-muted leading-relaxed mt-8">AiForm Studio is a one-person forge. I design, build, and ship every product myself — from the first line of code to the deployed system. Alongside the studio, I&apos;m a Senior Lecturer at the University of Pretoria. That keeps me close to how people learn, reason, and get stuck — the same instinct that shapes systems that verify rather than assume.</p><div className="grid sm:grid-cols-3 gap-6 mt-9 pt-6 border-t border-line text-xs text-muted"><div><span className="block text-green mb-2">ROLE</span>Founder &amp; Builder</div><div><span className="block text-green mb-2">ALSO</span>Senior Lecturer</div><div><span className="block text-green mb-2">BASED</span>Pretoria, South Africa</div></div></div></div></section>

      <section className="px-6 py-20 md:py-28"><div className="max-w-4xl mx-auto"><p className="chapter-label mb-6">05 / What We&apos;ve Learned</p><h2 className="font-display text-4xl md:text-6xl">Claims should survive<br /><em>contact with reality.</em></h2><div className="mt-12 border-t border-line">{["A configuration that ‘should’ be correct isn’t correct until it’s tested.", "A security policy that looks scoped isn’t safe until it’s verified.", "A feature isn’t fixed because the code changed. It’s fixed when the behaviour changes.", "A product doesn’t support something because the website says it does."].map((line, i) => <div key={line} className="grid grid-cols-[40px_1fr] gap-4 py-5 border-b border-line"><span className="font-display text-gold">0{i + 1}</span><p>{line}</p></div>)}</div></div></section>

      <section className="px-6 py-24 md:py-36 bg-bg-alt border-y border-line text-center"><p className="chapter-label mb-7">06 / How We Work</p><h2 className="font-display text-6xl md:text-8xl lg:text-[112px] leading-[0.9] tracking-[-0.03em]">We don&apos;t start<br />with <em className="text-green">AI.</em></h2><p className="font-display italic text-2xl mt-8">We start with the problem.</p><p className="text-muted max-w-xl mx-auto mt-6 leading-relaxed">Sometimes the answer needs AI. Sometimes it needs better data, automation, or simply software designed properly. The technology serves the problem.</p></section>

      <section className="px-6 py-24 md:py-32 text-center"><p className="chapter-label mb-7">07 / Where We Look Next</p><h2 className="font-display text-4xl md:text-6xl max-w-3xl mx-auto">No fixed industry.<br /><em>A very specific kind of problem.</em></h2><p className="text-muted mt-8 max-w-xl mx-auto leading-relaxed">Documents everywhere. Important claims that are difficult to verify. Two parties deciding whether they can trust one another. Hours of work that software should do in seconds.</p><p className="font-display text-2xl text-green mt-8">When we find that combination, we pay attention.</p><Link href="/contact" className="inline-block mt-10 text-sm border-b border-green pb-1 text-green">Tell us what you&apos;ve noticed →</Link></section>
    </>
  );
}
