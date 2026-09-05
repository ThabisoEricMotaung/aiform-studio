import type { Metadata } from "next";
import Link from "next/link";

const liveWebsite = "https://kutlwano-tutoring.vercel.app/";
const canonicalUrl = "https://aiformstudio.co.za/work/wanotuts";

export const metadata: Metadata = {
  title: "WanoTuts case study",
  description:
    "How Kutlwano Tutoring became WanoTuts: a naming, identity and tutoring website case study by AiForm Studio.",
  alternates: { canonical: "/work/wanotuts" },
  openGraph: {
    type: "article",
    locale: "en_ZA",
    url: canonicalUrl,
    siteName: "AiForm Studio",
    title: "WanoTuts — The name came before the mark",
    description: "A naming, identity and digital experience case study by AiForm Studio for Kutlwano Tutoring.",
    images: [{ url: "https://aiformstudio.co.za/images/aiform-story.png", width: 1254, height: 1254, alt: "AiForm Studio logo and its moth-inspired design origins" }],
  },
  twitter: {
    card: "summary",
    title: "WanoTuts case study | AiForm Studio",
    description: "A naming, identity and digital experience case study by AiForm Studio.",
    images: ["https://aiformstudio.co.za/images/aiform-story.png"],
  },
};

const projectMeta = [
  ["Project", "WanoTuts"],
  ["Context", "Kutlwano Tutoring"],
  ["Category", "Education"],
  ["Status", "Delivered"],
  ["Studio", "AiForm Studio"],
];

const delivered = [
  "Responsive tutoring website",
  "South African and international learner journeys",
  "Tutor profile and trust-building content",
  "Lesson-booking experience",
  "Festive campaign presentation",
  "Privacy-conscious handling of learner information",
  "WanoTuts visual identity",
];

export default function WanoTutsCaseStudy() {
  return (
    <article>
      <header className="editorial-grid py-14 md:py-20 lg:py-24">
        <p className="col-span-12 chapter-label md:col-span-2">
          Selected work / 01
        </p>
        <div className="col-span-12 mt-10 md:col-start-3 md:col-span-9 md:mt-0">
          <p className="text-sm font-semibold text-green">WanoTuts</p>
          <h1 className="case-study-lead mt-5">
            The name came
            <br />
            <span className="text-green">before the mark.</span>
          </h1>
          <p className="mt-9 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
            A clearer name, visual identity and tutoring experience for South
            African and international learners.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href={liveWebsite}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit WanoTuts website (opens in a new tab)"
              className="link-arrow"
            >
              Visit WanoTuts <span aria-hidden="true">↗</span>
            </a>
            <Link href="/#work" className="text-sm font-semibold text-green">
              Back to selected work →
            </Link>
          </div>
        </div>
        <div className="case-study-meta col-span-12 mt-16 md:mt-20">
          {projectMeta.map(([label, value]) => (
            <div key={label}>
              <p className="text-[10px] uppercase tracking-[.1em] text-muted">
                {label}
              </p>
              <p className="mt-2 text-sm font-semibold text-green">{value}</p>
            </div>
          ))}
        </div>
      </header>

      <section className="case-study-section editorial-grid bg-bg-alt">
        <p className="col-span-12 chapter-label md:col-span-2">
          01 / The situation
        </p>
        <div className="col-span-12 mt-9 md:col-start-4 md:col-span-7 md:mt-0">
          <h2 className="secondary-title">
            One tutor. Two learner contexts.
          </h2>
          <p className="case-study-copy mt-7">
            Kutlwano Tutoring serves South African and international learners,
            with different subjects, needs and pricing across those audiences.
            The work needed a clearer digital identity and a booking journey
            that could help each learner find the right path without losing the
            meaning already held by the original name.
          </p>
        </div>
      </section>

      <section className="case-study-section editorial-grid">
        <p className="col-span-12 chapter-label md:col-span-2">
          02 / The observation
        </p>
        <div className="col-span-12 mt-9 md:col-start-3 md:col-span-9 md:mt-0">
          <h2 className="case-study-statement max-w-4xl">
            The original name carried meaning. It simply needed a form that
            could travel.
          </h2>
          <p className="case-study-copy mt-9 md:ml-[33.333%]">
            A shorter name could be remembered, spoken and shared more easily
            across audiences. It could also work naturally as a future domain,
            without dismissing what Kutlwano Tutoring already represented.
          </p>
        </div>
      </section>

      <section className="case-study-section editorial-grid deep-green-panel">
        <p className="col-span-12 chapter-label chapter-label-light md:col-span-2">
          03 / The naming moment
        </p>
        <div className="col-span-12 mt-9 md:col-start-4 md:col-span-7 md:mt-0">
          <h2 className="case-study-statement text-[#e0c98f]">
            The name came before the mark.
          </h2>
          <p className="mt-9 text-lg leading-relaxed text-white/78">
            The original tutoring name carried meaning, but it was long for a
            brand travelling across audiences and markets. WanoTuts emerged
            from what was already there: “Wano” from Kutlwano, and “Tuts” from
            tutoring or tutorials.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-white/78">
            The proposed name resonated immediately. Only then did the visual
            identity begin. The logo did not invent the brand. It gave form to
            something that had already been noticed.
          </p>
          <p className="mt-12 font-display text-2xl text-[#e0c98f]">
            Noticed, not invented.
          </p>
        </div>
      </section>

      <section className="case-study-section editorial-grid">
        <p className="col-span-12 chapter-label md:col-span-2">
          04 / From name to identity
        </p>
        <div className="col-span-12 mt-9 md:col-start-3 md:col-span-8 md:mt-0">
          <h2 className="secondary-title">A compact identity for small spaces.</h2>
          <p className="case-study-copy mt-7">
            WanoTuts became the primary brand. A WT monogram gave it a compact,
            memorable mark, while forest green retained the calm, credible
            character of the tutoring website. The identity was refined into a
            sharper, scalable form that could hold its own in a header, favicon
            and other small digital contexts.
          </p>
          <div className="case-study-process mt-12 border-t border-line pt-6">
            {[
              "Observe",
              "Name",
              "Validate",
              "Design",
              "Deliver",
            ].map((step, index) => (
              <span key={step}>
                {step} {index < 4 ? <span aria-hidden="true">→</span> : null}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="case-study-section editorial-grid bg-bg-alt">
        <p className="col-span-12 chapter-label md:col-span-2">
          05 / The delivered experience
        </p>
        <div className="col-span-12 mt-9 md:col-start-4 md:col-span-8 md:mt-0">
          <h2 className="secondary-title">One website, with distinct paths.</h2>
          <div className="mt-10 grid sm:grid-cols-2">
            {delivered.map((item, index) => (
              <p
                key={item}
                className={`border-t border-line py-5 text-sm leading-relaxed text-muted ${index % 2 ? "sm:border-l sm:pl-6" : "sm:pr-6"}`}
              >
                <span className="mr-4 text-gold">0{index + 1}</span>
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="case-study-section editorial-grid">
        <p className="col-span-12 chapter-label md:col-span-2">
          06 / The takeaway
        </p>
        <div className="col-span-12 mt-9 md:col-start-3 md:col-span-9 md:mt-0">
          <h2 className="case-study-statement max-w-5xl">
            Good identity work does not always begin by inventing something
            new. Sometimes it begins by noticing the name, language or
            behaviour that is already trying to emerge.
          </h2>
          <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-line pt-7">
            <Link href="/#work" className="link-arrow">
              Back to selected work →
            </Link>
            <a
              href={liveWebsite}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit WanoTuts website (opens in a new tab)"
              className="text-sm font-semibold text-green"
            >
              Visit WanoTuts ↗
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}
