import type { Metadata } from "next";
import IntakeForm from "@/components/intake/IntakeForm";

export const metadata: Metadata = { title: "Contact | AiForm Studio" };

export default function Contact() {
  return (
    <section className="min-h-[70vh] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="chapter-label mb-7">Start a conversation</p>
        <h1 className="font-display max-w-3xl text-4xl leading-[1.05] md:text-6xl">
          Tell me what isn&apos;t working.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          You don&apos;t need to know the solution yet. Describe the problem, the context and
          what you&apos;d like to change. I&apos;ll take it from there.
        </p>

        <div className="mt-16 grid gap-16 md:grid-cols-[0.8fr_1.2fr] md:gap-x-20">
          <div className="md:border-r md:border-line md:pr-12">
            <div className="rule-gold mb-8" />
            <p className="chapter-label mb-3">Email</p>
            <a
              href="mailto:aiformstudio@gmail.com"
              className="font-display break-all text-2xl transition-colors hover:text-green md:text-3xl"
            >
              aiformstudio@gmail.com
            </a>
            <div className="mt-9 border-t border-line pt-7">
              <p className="chapter-label mb-3">Based in</p>
              <p className="text-muted">Pretoria, South Africa</p>
            </div>
            <p className="font-display mt-12 text-xl text-muted">
              The best conversations begin with the problem, not the proposed technology.
            </p>
            <div className="mt-9 border-t border-line pt-7">
              <p className="chapter-label mb-3">Prefer email?</p>
              <p className="text-sm leading-relaxed text-muted">
                Not everyone wants to fill out a form — a short email works just as well.
              </p>
            </div>
          </div>

          <div>
            <IntakeForm />
          </div>
        </div>
      </div>
    </section>
  );
}
