import type { Metadata } from "next";
import IntakeForm from "@/components/intake/IntakeForm";
import AlternativeContact from "@/components/contact/AlternativeContact";
import { STUDIO_ADDRESS_MAPS_URL } from "@/lib/studio-address";

export const metadata: Metadata = { title: "Start a project | AiForm Studio", description: "Tell AiForm Studio what you are trying to solve. No technical brief required.", alternates: { canonical: "/contact" } };

export default function Contact() {
  return (
    <section className="min-h-[70vh] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="chapter-label mb-7">Smart project intake</p>
        <h1 className="font-display max-w-3xl text-4xl leading-[1.05] md:text-6xl">
          Tell us what you&apos;re trying to solve.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          You don&apos;t need a technical brief. A few quick answers are enough.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-16 md:grid-cols-[0.8fr_1.2fr] md:gap-x-20">
          <div className="order-2 md:order-1 md:border-r md:border-line md:pr-12">
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
              <p className="text-muted">
                607 Fred Messenger Avenue
                <br />
                Andeon AH, Pretoria
                <br />
                0183, South Africa
              </p>
              <a
                href={STUDIO_ADDRESS_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block border-b border-line pb-0.5 text-xs text-muted transition-colors hover:border-green hover:text-green"
              >
                View on Google Maps ↗
              </a>
              <p className="mt-4 text-xs text-muted">
                AiForm Studio (Pty) Ltd · Registration no. 2026/692621/07
              </p>
            </div>
            <p className="font-display mt-12 text-xl text-muted">
              The best conversations begin with the problem, not the proposed technology.
            </p>
            <AlternativeContact />
          </div>

          <div className="order-1 md:order-2">
            <p className="chapter-label mb-5">Start a project</p>
            <IntakeForm />
          </div>
        </div>
      </div>
    </section>
  );
}
