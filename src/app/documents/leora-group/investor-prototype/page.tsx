import type { Metadata } from "next";
import Link from "next/link";
import AiFormLockup from "@/components/AiFormLockup";
import { buildWhatsAppHref } from "@/lib/contact-links";
import documentStyles from "@/app/share/share.module.css";
import styles from "./page.module.css";

const title = "NeoSmart Investor Prototype | AiForm Studio × LeOra Group";
const description = "Commercial scope for a focused, investor-facing interactive prototype of the NeoSmart customer journey.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  robots: { index: false, follow: false, noarchive: true },
  alternates: { canonical: null },
  openGraph: { title, description, images: [], url: null },
  twitter: { card: "summary", title, description, images: [] },
};

const snapshot = [
  { value: "R5,500", label: "Fixed prototype fee" },
  { value: "3–5 working days", label: "Delivery window" },
  { value: "1", label: "Primary demonstration journey" },
  { value: "1", label: "Consolidated revision round" },
];

const journeySteps = [
  "Register", "Add Vehicle", "Fuel Delivery", "Location", "Delivery Time",
  "Simulated Payment", "Track", "Service Delivered", "Invoice & Rate", "Repeat",
];

const futureServices = ["Oil checks", "Tyre pressure", "Windscreen cleaning", "Car wash", "Other future vehicle-care services"];

const buildItems = [
  "Mobile-first interactive web prototype", "NeoSmart-branded customer experience",
  "Approximately 10–12 connected experience states/screens", "One controlled end-to-end customer journey",
  "One vehicle demonstration", "One primary Fuel Delivery service", "One simulated location",
  "One delivery-time selection", "Simulated payment interaction", "Simulated delivery/tracking progression",
  "Simulated service completion", "Invoice/rating state", "Repeat/order-again state",
  "Continuity of selected information throughout the journey", "Local demonstration capability",
  "Simple restart/reset capability for repeated investor demonstrations",
  "Responsive presentation suitable for laptop and mobile-sized views",
];

const simulated = [
  { label: "Payment", copy: "Simulated authorisation and successful transaction state." },
  { label: "Location", copy: "Controlled demonstration location rather than live GPS infrastructure." },
  { label: "Tracking", copy: "Simulated delivery progress rather than real-time fleet tracking." },
  { label: "Service completion", copy: "Controlled completion state with representative transaction details." },
  { label: "Invoice", copy: "Representative invoice/service-summary experience rather than production accounting integration." },
];

const exclusions = [
  "Live payment gateway", "Banking integrations", "Live GPS or mapping APIs",
  "Production authentication / OTP", "Production customer database", "SMS / WhatsApp integrations",
  "Dispatch engine", "Operator/driver application", "Operations/admin console",
  "Live inventory management", "Fuel-meter or hardware integrations",
  "Production invoicing/accounting integration", "Enterprise security infrastructure",
  "Native iOS or Android application", "App Store / Google Play deployment", "Production hosting infrastructure",
];

const timeline = [
  { day: "Day 1", name: "Structure & visual direction", copy: "Confirm the demonstration flow, NeoSmart visual treatment and connected experience states." },
  { day: "Days 2–3", name: "Prototype implementation", copy: "Build the interactive customer journey and simulated product behaviour." },
  { day: "Day 4", name: "Polish & testing", copy: "Refine transitions, responsive behaviour, continuity and demonstration reset." },
  { day: "Day 5", name: "Review & handover", copy: "Present the completed prototype, apply the agreed consolidated revision round and prepare the demonstration build." },
];

const progression = [
  { name: "Investor Prototype", value: "R5,500", copy: "Demonstrate the concept" },
  { name: "Operational Web Platform", value: "±R60,000 working budget boundary", copy: "Build the operational NeoSmart web platform" },
  { name: "Mobile & Expanded Ecosystem", value: "Future scope", copy: "Native/mobile expansion, live integrations and broader NeoSmart services" },
];

const whatsappNumber = process.env.NEXT_PUBLIC_STUDIO_WHATSAPP;
const approveHref = whatsappNumber
  ? buildWhatsAppHref(whatsappNumber, "Hi Thabiso, I'm happy with the NeoSmart Investor Prototype scope and would like to proceed.")
  : "/contact";

function Journey() {
  return (
    <ol className={styles.journey} aria-label="NeoSmart demonstration journey">
      {journeySteps.map((step, index) => (
        <li key={step} className={styles.journeyStep}>
          <span className={styles.journeyNode}>
            <span className={styles.journeyIndex} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.journeyLabel}>{step}</span>
          </span>
          {index < journeySteps.length - 1 ? <span className={styles.journeyArrow} aria-hidden="true">&#8594;</span> : null}
        </li>
      ))}
    </ol>
  );
}

export default function NeoSmartInvestorPrototype() {
  return (
    <div className={styles.page}>
      <div className={documentStyles.shell}>
        <header className={documentStyles.header}>
          <Link href="/" aria-label="AiForm Studio home"><AiFormLockup product="Studio" variant="studio" markClassName="h-8" /></Link>
          <span className={documentStyles.label}>Documents</span>
        </header>

        <div className={documentStyles.content}>
          <article className={documentStyles.document} aria-labelledby="prototype-title">
            <p className={documentStyles.eyebrow}>Investor prototype scope</p>
            <h1 id="prototype-title" className={styles.title}>
              NeoSmart Fuelling
              <span className={styles.titleSuffix}>Investor Prototype</span>
            </h1>
            <p className={`${documentStyles.recipient} ${styles.relationship}`}>AiForm Studio <span>×</span> LeOra Group</p>
            <p className={`${documentStyles.description} ${styles.description}`}>A focused interactive demonstration of the NeoSmart customer journey, designed for investor and sponsorship presentations.</p>
            <dl className={`${documentStyles.metadata} ${styles.metadata}`}>
              <div><dt>Status</dt><dd className={documentStyles.status}>Prototype scope</dd></div>
              <div><dt>Prepared for</dt><dd>LeOra Group / Neo Makgoba</dd></div>
              <div><dt>Prepared by</dt><dd>AiForm Studio</dd></div>
              <div><dt>Date</dt><dd><time dateTime="2026-09-18">18 September 2026</time></dd></div>
            </dl>

            <div className={styles.snapshot} aria-label="Project snapshot">
              {snapshot.map((item) => (
                <div key={item.label} className={styles.snapshotItem}>
                  <p className={styles.snapshotValue}>{item.value}</p>
                  <p className={styles.snapshotLabel}>{item.label}</p>
                </div>
              ))}
            </div>

            <section className={styles.section} aria-labelledby="purpose-title">
              <p className={styles.sectionLabel}>01 / Purpose</p>
              <h2 id="purpose-title" className={styles.sectionTitle}>A prototype built to demonstrate the business</h2>
              <p className={styles.sectionIntro}>The prototype will provide a polished, interactive representation of the NeoSmart customer experience that can be demonstrated directly to prospective investors, sponsors and commercial stakeholders.</p>
              <p className={styles.sectionIntro}>It is intended to show how NeoSmart works from beginning to end without incurring the cost and complexity of production integrations at this stage.</p>
              <p className={styles.sectionIntro}>It should behave like a coherent product demonstration rather than a set of static mockups.</p>
            </section>

            <section className={styles.section} aria-labelledby="demonstration-title">
              <p className={styles.sectionLabel}>02 / The demonstration</p>
              <h2 id="demonstration-title" className={styles.sectionTitle}>One complete NeoSmart journey</h2>
              <Journey />
              <p className={styles.journeyNote}>Neo specifically proposed using one principal choice per step to reduce prototype development time and cost. The prototype will follow one controlled &#8220;golden path.&#8221; One principal working choice will be provided at each stage so the complete experience can be demonstrated without building unnecessary production complexity.</p>
              <p className={styles.sectionIntro}>Fuel Delivery is the primary working service. Other future NeoSmart services may be represented visually to communicate the broader product vision, including:</p>
              <ul className={styles.serviceTags}>
                {futureServices.map((service) => <li key={service}>{service}</li>)}
              </ul>
              <p className={styles.smallNote}>These additional services do not require complete working workflows in this prototype.</p>
            </section>

            <section className={styles.section} aria-labelledby="build-title">
              <p className={styles.sectionLabel}>03 / What AiForm Studio will build</p>
              <h2 id="build-title" className={styles.sectionTitle}>Interactive prototype deliverables</h2>
              <ul className={styles.buildList}>
                {buildItems.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <p className={styles.smallNote}>This scope does not promise production functionality.</p>
            </section>

            <section className={styles.section} aria-labelledby="simulated-title">
              <p className={styles.sectionLabel}>04 / Simulated by design</p>
              <h2 id="simulated-title" className={styles.sectionTitle}>Realistic experience. No unnecessary integrations.</h2>
              <p className={styles.sectionIntro}>The prototype deliberately simulates expensive or production-only services.</p>
              <div className={styles.simGrid}>
                {simulated.map((item) => (
                  <div key={item.label} className={styles.simItem}>
                    <p className={styles.simLabel}>{item.label}</p>
                    <p className={styles.simCopy}>{item.copy}</p>
                  </div>
                ))}
              </div>
              <p className={styles.smallNote}>The purpose is to demonstrate the product experience and operating concept, not production infrastructure.</p>
            </section>

            <section className={styles.section} aria-labelledby="boundary-title">
              <p className={styles.sectionLabel}>05 / Scope boundary</p>
              <h2 id="boundary-title" className={styles.sectionTitle}>What this prototype deliberately does not include</h2>
              <ul className={styles.exclusionList}>
                {exclusions.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <p className={styles.smallNote}>These capabilities belong to later NeoSmart implementation stages and are not included in the R5,500 prototype engagement.</p>
            </section>

            <section className={styles.section} aria-labelledby="delivery-title">
              <p className={styles.sectionLabel}>06 / Delivery</p>
              <h2 id="delivery-title" className={styles.sectionTitle}>A short, controlled build</h2>
              <ol className={styles.timeline}>
                {timeline.map((step) => (
                  <li key={step.day} className={styles.timelineItem}>
                    <p className={styles.timelineDay}>{step.day}</p>
                    <p className={styles.timelineName}>{step.name}</p>
                    <p className={styles.timelineCopy}>{step.copy}</p>
                  </li>
                ))}
              </ol>
              <p className={styles.smallNote}>Delivery target: 3&#8211;5 working days from commencement, subject to receipt of required NeoSmart assets/information and commencement payment.</p>
            </section>

            <section className={styles.section} aria-labelledby="commercials-title">
              <p className={styles.sectionLabel}>07 / Commercials</p>
              <h2 id="commercials-title" className="sr-only">Commercials</h2>
              <div className={styles.commercialBlock}>
                <p className={styles.feeLabel}>Prototype fee</p>
                <p className={styles.feeValue}>R5,500</p>
                <p className={styles.feeCopy}>Fixed fee for the scope described on this page.</p>
                <div className={styles.paymentSplit}>
                  <div>
                    <p className={styles.paymentValue}>R2,750</p>
                    <p className={styles.paymentLabel}>50% on approval and commencement</p>
                  </div>
                  <div>
                    <p className={styles.paymentValue}>R2,750</p>
                    <p className={styles.paymentLabel}>50% on completion and acceptance</p>
                  </div>
                </div>
              </div>
              <p className={styles.sectionIntro}>One consolidated revision round is included following presentation of the completed prototype.</p>
              <p className={styles.smallNote}>Material additions, additional functional journeys or changes outside the agreed prototype scope will be separately scoped before implementation.</p>
            </section>

            <section className={styles.section} aria-labelledby="next-steps-title">
              <p className={styles.sectionLabel}>08 / What comes next</p>
              <h2 id="next-steps-title" className={styles.sectionTitle}>Prototype first. Production follows separately.</h2>
              <ol className={styles.progression}>
                {progression.map((stage, index) => (
                  <li key={stage.name} className={styles.progressionItem}>
                    {index > 0 ? <span className={styles.progressionArrow} aria-hidden="true">&#8595;</span> : null}
                    <p className={styles.progressionName}>{stage.name}</p>
                    <p className={styles.progressionValue}>{stage.value}</p>
                    <p className={styles.progressionCopy}>{stage.copy}</p>
                  </li>
                ))}
              </ol>
              <p className={styles.sectionIntro}>The R5,500 prototype is a separate investor-demonstration engagement and does not replace the existing preliminary NeoSmart production-platform scope.</p>
              <p className={styles.sectionIntro}>The previously discussed approximately R60,000 implementation remains the working budget boundary for the initial operational web platform.</p>
              <p className={styles.smallNote}>Final production scope and commercial terms will be agreed separately before production development begins.</p>
            </section>

            <p className={styles.strategicNote}>Any future partnership, ownership, revenue-sharing or other strategic commercial arrangement between the parties will be discussed and documented separately and does not form part of this prototype engagement.</p>

            <section className={styles.section} aria-labelledby="approve-title">
              <h2 id="approve-title" className={styles.sectionTitle}>Next step</h2>
              <p className={styles.sectionIntro}>If this scope reflects what LeOra Group would like to demonstrate to investors, the next step is to confirm and proceed.</p>
              <div className={styles.finalActions}>
                <a href={approveHref} target={whatsappNumber ? "_blank" : undefined} rel={whatsappNumber ? "noopener noreferrer" : undefined} className={`button-primary ${styles.primary}`}>
                  Approve prototype <span aria-hidden="true">→</span>
                </a>
                <Link href="/documents/leora-group/preliminary-scope" className={`button-secondary ${styles.secondary}`}>
                  Review preliminary platform scope
                </Link>
              </div>
              <div className={styles.footnote}>
                <p>Formal commencement follows confirmation and the commencement payment.<br />This scope is not a quotation, contractual offer or development agreement.</p>
                <p>AiForm Studio × LeOra Group<br /><time dateTime="2026-09-18">18 September 2026</time></p>
              </div>
            </section>
          </article>
        </div>

        <footer className={documentStyles.footer}>
          <p>Prepared by AiForm Studio<span>Pretoria, South Africa</span></p>
          <p>© 2026 AiForm Studio (Pty) Ltd</p>
        </footer>
      </div>
    </div>
  );
}
