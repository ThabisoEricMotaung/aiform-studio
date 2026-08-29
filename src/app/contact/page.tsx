import type { Metadata } from "next";
import IntakeForm from "@/components/intake/IntakeForm";
import AlternativeContact from "@/components/contact/AlternativeContact";

export const metadata: Metadata = { title: "Start a project | AiForm Studio", description: "Tell AiForm Studio what you are trying to solve. No technical brief required.", alternates: { canonical: "/contact" } };

export default function Contact() {
  return (
    <section className="min-h-[70vh] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="chapter-label mb-7">Start a conversation</p>
        <h1 className="font-display max-w-3xl text-4xl leading-[1.05] md:text-6xl">
          Tell us what you&apos;re trying to solve.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          You don&apos;t need a technical brief. A few quick answers are enough.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-16 md:grid-cols-[0.8fr_1.2fr] md:gap-x-20">
          <div className="md:border-r md:border-line md:pr-12">
            <div className="rule-gold mb-8" />
            <p className="chapter-label mb-3">Email</p>
            <a
              href="mailto:hello@aiformstudio.co.za"
              className="font-display break-all text-2xl transition-colors hover:text-green md:text-3xl"
            >
              hello@aiformstudio.co.za
            </a>
            <div className="mt-9 border-t border-line pt-7">
              <p className="chapter-label mb-3">Based in</p>
              <p className="text-muted">
                Pretoria, Gauteng
                <br />South Africa
              </p>
            </div>
            <p className="font-display mt-12 text-xl text-muted">
              The best conversations begin with the problem, not the proposed technology.
            </p>
            <AlternativeContact />
          </div>

          <div>
            <IntakeForm />
          </div>
        </div>
      </div>
    </section>
  );
}
