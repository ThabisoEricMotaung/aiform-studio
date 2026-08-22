import Link from "next/link";
import EngineStep from "@/components/EngineStep";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="blueprint-grid px-6 py-28 md:py-36 text-center border-b border-panel-line">
        <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-cyan mb-6">
          AiForm Studio
        </div>
        <h1 className="font-display font-bold text-[38px] md:text-[64px] leading-[1.08] mb-7">
          Noticed, not invented.
        </h1>
        <p className="text-muted text-lg max-w-xl mx-auto mb-4 leading-relaxed">
          We look for places where people are still expected to trust what
          hasn&apos;t been verified, then build systems that change that.
        </p>
        <p className="font-mono text-[13px] tracking-[0.04em] text-cyan/90 mb-11">
          Less assumption. More evidence. Better decisions.
        </p>
        <Link
          href="/contact"
          className="inline-block font-mono text-[12px] tracking-[0.08em] uppercase border border-cyan text-cyan px-7 py-3.5 hover:bg-cyan hover:text-bg transition-colors"
        >
          Start a project
        </Link>
      </section>

      {/* THE PROBLEM */}
      <section className="px-6 py-24 max-w-3xl mx-auto text-center">
        <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted mb-5">
          01 — The Problem
        </div>
        <h2 className="font-display font-bold text-2xl md:text-[34px] leading-tight">
          Too much of the world still runs on assumption.
        </h2>
      </section>

      {/* THE ENGINE */}
      <section id="engine" className="px-6 py-24 border-t border-panel-line bg-panel/30">
        <div className="max-w-3xl mx-auto">
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-cyan mb-5 text-center">
            02 — The AiForm Engine
          </div>
          <h2 className="font-display font-bold text-2xl md:text-[34px] leading-tight text-center mb-4">
            What are people currently being asked to assume?
          </h2>
          <p className="text-muted text-center max-w-lg mx-auto mb-16 leading-relaxed">
            Messy information becomes structured. Claims become evidence.
            Evidence becomes useful decisions. The technology changes from
            product to product. The principle doesn&apos;t.
          </p>
          <div className="max-w-md mx-auto">
            <EngineStep number="01" title="Parse" desc="Take unstructured, messy, real-world input and give it shape." />
            <EngineStep number="02" title="Verify" desc="Check the claim against evidence, not against what's convenient to believe." />
            <EngineStep number="03" title="Understand" desc="Turn verified evidence into something a person can actually act on." />
            <EngineStep number="04" title="Match" desc="Connect what belongs together — the right buyer, the right supplier, the right fit." last />
          </div>
        </div>
      </section>

      {/* PROOF: AIFORM PROCURE */}
      <section id="work" className="px-6 py-24 border-t border-panel-line">
        <div className="max-w-4xl mx-auto">
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted mb-5 text-center">
            03 — Proof
          </div>
          <h2 className="font-display font-bold text-2xl md:text-[34px] leading-tight text-center mb-14">
            The first proof.
          </h2>

          <div className="blueprint-panel p-8 md:p-10 mb-8">
            <div className="corner-tl" />
            <div className="corner-br" />
            <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-cyan mb-3">
              AiForm Procure
            </div>
            <p className="text-text leading-relaxed mb-6 max-w-2xl">
              AiForm Procure began with something ordinary: South African
              businesses searching across fragmented procurement sources
              while repeatedly proving the same compliance information.
              What looked like a tender-discovery problem was really a
              trust and information problem. So we built around that.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 font-mono text-[11px] text-muted border-t border-panel-line pt-6">
              <div>
                <div className="text-cyan mb-1">PROBLEM</div>
                Fragmented compliance verification across procurement
              </div>
              <div>
                <div className="text-cyan mb-1">ENGINE USED</div>
                Parse → Verify → Match
              </div>
              <div>
                <div className="text-cyan mb-1">STATUS</div>
                Live · Pilot phase
              </div>
            </div>
            <a
              href="https://www.aiformprocure.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-7 font-mono text-[11px] tracking-[0.08em] uppercase text-cyan hover:underline underline-offset-4"
            >
              Visit aiformprocure.co.za →
            </a>
          </div>

          <div className="blueprint-panel p-8 md:p-10">
            <div className="corner-tl" />
            <div className="corner-br" />
            <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-cyan mb-3">
              Kutlwano Tutoring
            </div>
            <p className="text-text leading-relaxed mb-6 max-w-2xl">
              A one-on-one tutoring business needed a clear way to present
              two very different offerings — international students and
              South African Grade 8–11 learners — without either audience
              feeling like an afterthought.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 font-mono text-[11px] text-muted border-t border-panel-line pt-6">
              <div>
                <div className="text-cyan mb-1">PROBLEM</div>
                Two audiences, two pricing models, one clear site
              </div>
              <div>
                <div className="text-cyan mb-1">ENGINE USED</div>
                Understand → Match
              </div>
              <div>
                <div className="text-cyan mb-1">STATUS</div>
                Live
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BUILT ON VERIFICATION */}
      <section className="px-6 py-24 border-t border-panel-line bg-panel/30">
        <div className="max-w-2xl mx-auto">
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-cyan mb-5 text-center">
            04 — What We&apos;ve Learned
          </div>
          <h2 className="font-display font-bold text-2xl md:text-[34px] leading-tight text-center mb-10">
            Built on verification.
          </h2>
          <p className="text-muted text-center mb-10 leading-relaxed">
            We learned this principle building our own products.
          </p>
          <ul className="space-y-5 mb-10">
            {[
              "A configuration that \u201cshould\u201d be correct isn't correct until it's tested.",
              "A security policy that looks scoped isn't safe until it's verified.",
              "A feature isn't fixed because the code changed. It's fixed when the behaviour changes.",
              "A product doesn't support something because the website says it does.",
            ].map((line) => (
              <li key={line} className="flex gap-4 text-[15px] text-text/90 leading-relaxed">
                <span className="text-cyan font-mono shrink-0">—</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="font-mono text-[13px] tracking-[0.04em] text-cyan text-center">
            Claims should survive contact with reality.
          </p>
        </div>
      </section>

      {/* WE DON'T START WITH AI */}
      <section className="px-6 py-24 border-t border-panel-line">
        <div className="max-w-2xl mx-auto text-center">
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted mb-5">
            05 — How We Work
          </div>
          <h2 className="font-display font-bold text-2xl md:text-[34px] leading-tight mb-6">
            We don&apos;t start with AI.
          </h2>
          <p className="text-lg text-text/90 mb-4">We start with the problem.</p>
          <p className="text-muted leading-relaxed max-w-lg mx-auto">
            Sometimes the answer needs AI. Sometimes it needs better data.
            Sometimes it needs automation. Sometimes it just needs software
            designed properly. The technology serves the problem, not the
            other way around.
          </p>
        </div>
      </section>

      {/* WHERE WE LOOK NEXT */}
      <section id="next" className="px-6 py-24 border-t border-panel-line bg-panel/30">
        <div className="max-w-2xl mx-auto text-center">
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-cyan mb-5">
            06 — Where We Look Next
          </div>
          <h2 className="font-display font-bold text-2xl md:text-[34px] leading-tight mb-8">
            No fixed industry. A very specific kind of problem.
          </h2>
          <div className="space-y-2 text-text/90 mb-8">
            <p>Documents everywhere.</p>
            <p>Important claims that are difficult to verify.</p>
            <p>Two parties trying to decide whether they can trust one another.</p>
            <p>People spending hours doing work that software should be doing in seconds.</p>
          </div>
          <p className="text-lg text-text mb-6">
            When we find that combination, we pay attention.
          </p>
          <p className="font-mono text-[13px] tracking-[0.04em] text-cyan">
            Procurement was one. There will be others.
          </p>
        </div>
      </section>

      {/* CLOSING */}
      <section className="blueprint-grid px-6 py-28 text-center border-t border-panel-line">
        <h2 className="font-display font-bold text-2xl md:text-[38px] leading-tight max-w-2xl mx-auto mb-10">
          If something important is being trusted on assumption, we&apos;re interested.
        </h2>
        <Link
          href="/contact"
          className="inline-block font-mono text-[12px] tracking-[0.08em] uppercase border border-cyan text-cyan px-7 py-3.5 hover:bg-cyan hover:text-bg transition-colors"
        >
          Start a project
        </Link>
      </section>
    </>
  );
}
