import type { Metadata } from "next";
import Link from "next/link";
import AiFormLockup from "@/components/AiFormLockup";
import { buildWhatsAppHref } from "@/lib/contact-links";
import { requireLeoraAccess } from "@/lib/leora-access";
import documentStyles from "@/app/share/share.module.css";
import styles from "./page.module.css";

// Must never be statically prerendered: the guard result depends on a
// per-request session cookie, and a build-time redirect must not get baked
// into cached HTML that bypasses the check for later visitors.
export const dynamic = "force-dynamic";

const title = "NeoSmart Preliminary Scope & Budget | AiForm Studio × LeOra Group";
const description = "Preliminary project scope and working budget for the proposed NeoSmart Fuelling platform.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  robots: { index: false, follow: false, noarchive: true },
  alternates: { canonical: null },
  openGraph: { title, description, images: [], url: null },
  twitter: { card: "summary", title, description, images: [] },
};

const environments = [
  {
    tag: "Customer",
    name: "Customer Platform",
    copy: "A mobile-first experience through which customers can create an account, register vehicles, select a fuel or service requirement, provide their location, request immediate or scheduled service, receive pricing, place an order, follow its status and access service records or invoices.",
  },
  {
    tag: "Operations",
    name: "NeoSmart Operations",
    copy: "The internal control layer for receiving orders, coordinating fulfilment, assigning work, monitoring service status, managing customers and vehicles, handling exceptions and maintaining operational records.",
  },
  {
    tag: "Operator",
    name: "Field Operator",
    copy: "A focused mobile workflow through which an operator receives assigned work, views the required customer, vehicle and location information, progresses through the service process, records the service delivered and confirms completion.",
  },
];

const systemFlow = ["Customer", "Order", "NeoSmart Operations", "Operator", "Service", "Completion"];
const releaseFlow = [
  "Customer registers", "adds vehicle", "requests service", "provides location",
  "order reaches NeoSmart", "operator is assigned", "service is performed",
  "completion is recorded", "transaction and service history are retained",
];

const phases = [
  {
    number: "Phase 0", name: "Discovery & System Design", allocation: "±R5,000",
    scope: ["Detailed operating workflow", "Customer, operator and admin journeys", "Exception scenarios", "Dispatch requirements", "Payment requirements", "Core data model", "Technical architecture", "Final MVP boundary"],
    outcome: "An agreed implementation specification and a clearer boundary for the first release.",
  },
  {
    number: "Phase 1", name: "Customer & Ordering Core", allocation: "±R20,000",
    scope: ["Customer accounts", "Vehicle profiles", "Fuel/service selection", "Service location", "Immediate or scheduled requests", "Pricing and order creation", "Order status", "Core customer journey"],
    outcome: "Customers can create and submit structured NeoSmart service requests.",
  },
  {
    number: "Phase 2", name: "Operator & Operations Platform", allocation: "±R20,000",
    scope: ["Operations console", "Incoming-order management", "Operator workflow", "Job assignment", "Service status", "Customer and vehicle context", "Field completion", "Operational records"],
    outcome: "NeoSmart can receive, assign, fulfil and manage customer orders through the platform.",
  },
  {
    number: "Phase 3", name: "Transaction & Launch Readiness", allocation: "±R15,000",
    scope: ["Agreed payment integration", "Appropriate MVP reconciliation logic", "Invoices and receipts", "Notifications", "Testing", "Deployment", "Launch preparation"],
    outcome: "The initial platform is prepared for controlled operational use.",
  },
];

const growthCapabilities = [
  "Sophisticated real-time operator tracking", "Automated nearest-operator dispatch", "Route optimisation",
  "Advanced fuel inventory and reconciliation", "Fuel-meter or hardware integrations",
  "Payment pre-authorisation and complex reconciliation", "Native iOS and Android applications",
  "Corporate and fleet accounts", "Consolidated fleet billing and reporting",
  "Car wash, tyre and roadside-service partner workflows", "Advanced analytics and CRM automation",
  "Additional third-party integrations",
];

const discoveryTopics = [
  "Service area and operating radius", "Fuel sourcing and handling model", "Fuel grades and inventory model",
  "Operator and service-vehicle structure", "Dispatch rules", "Metering and quantity confirmation",
  "Customer absence or vehicle-access procedure", "Cancellations and refunds", "Pricing and delivery-fee rules",
  "Payment provider and payment flow", "Regulatory and safety requirements", "Operational exception handling",
];

const principles = [
  { label: "Defined scope", copy: "Each implementation phase begins with agreed deliverables, boundaries and responsibilities." },
  { label: "Visible progress", copy: "Working software is reviewed during development rather than being revealed only at the end." },
  { label: "Acceptance", copy: "Key functionality and acceptance criteria are agreed before a phase is considered complete." },
  { label: "Ownership & handover", copy: "Source-code access, deployment, documentation, project ownership and handover arrangements are defined in the formal development agreement." },
];

const whatsappNumber = process.env.NEXT_PUBLIC_STUDIO_WHATSAPP;
const discussHref = whatsappNumber
  ? buildWhatsAppHref(whatsappNumber, "Hi AiForm Studio, I'd like to discuss the NeoSmart preliminary scope.")
  : "/contact";

function Flow({ steps }: { steps: string[] }) {
  return <p className={styles.flowChain}>
    {steps.map((step, index) => <span key={step}>
      <span className={styles.flowStep}>{step}</span>
      {index < steps.length - 1 ? <span className={styles.flowArrow} aria-hidden="true"> → </span> : null}
    </span>)}
  </p>;
}

export default async function NeoSmartPreliminaryScope() {
  await requireLeoraAccess("/documents/leora-group/preliminary-scope");
  return (
    <div className={styles.page}>
      <div className={documentStyles.shell}>
        <header className={documentStyles.header}>
          <Link href="/" aria-label="AiForm Studio home"><AiFormLockup product="Studio" variant="studio" markClassName="h-8" /></Link>
          <span className={documentStyles.label}>Documents</span>
        </header>

        <div className={documentStyles.content}>
          <article className={documentStyles.document} aria-labelledby="scope-title">
            <p className={documentStyles.eyebrow}>Preliminary project scope</p>
            <h1 id="scope-title" className={styles.title}>NeoSmart Fuelling Platform</h1>
            <p className={`${documentStyles.recipient} ${styles.relationship}`}>AiForm Studio <span>×</span> LeOra Group</p>
            <p className={`${documentStyles.description} ${styles.description} ${styles.leadIntro}`}>NeoSmart is envisioned as a mobile-first platform through which customers can request fuel delivery to their vehicles, while NeoSmart manages orders, operators, dispatch, service completion and transaction records through a connected operating system.</p>
            <p className={`${documentStyles.description} ${styles.description} ${styles.secondaryIntro}`}>This preliminary scope reflects AiForm Studio&rsquo;s current understanding of the concept and provides an indicative approach to the first implementation. It is intended for planning and discussion and is not yet a final quotation, development agreement or technical specification.</p>
            <dl className={`${documentStyles.metadata} ${styles.metadata}`}>
              <div><dt>Document</dt><dd>Preliminary Scope &amp; Budget</dd></div>
              <div><dt>Project</dt><dd>NeoSmart Fuelling</dd></div>
              <div><dt>Status</dt><dd className={documentStyles.status}>For discussion</dd></div>
              <div><dt>Date</dt><dd><time dateTime="2026-09-16">16 September 2026</time></dd></div>
            </dl>

            <section className={`${styles.section} ${styles.firstSection}`} aria-labelledby="system-title">
              <p className={styles.sectionLabel}>01</p>
              <h2 id="system-title" className={styles.sectionTitle}>More than a customer app</h2>
              <p className={styles.sectionIntro}>The customer experience is only one part of NeoSmart. For the service to operate effectively, the first platform needs to connect the person requesting fuel with the NeoSmart team coordinating the order and the operator completing the service in the field.</p>
              <div className={styles.systemGrid}>
                {environments.map((environment) => (
                  <div key={environment.tag} className={styles.systemCol}>
                    <p className={styles.systemTag}>{environment.tag}</p>
                    <h3>{environment.name}</h3>
                    <p>{environment.copy}</p>
                  </div>
                ))}
              </div>
              <Flow steps={systemFlow} />
            </section>

            <section className={styles.section} aria-labelledby="release-title">
              <p className={styles.sectionLabel}>02</p>
              <h2 id="release-title" className={styles.sectionTitle}>Build the operating core first</h2>
              <p className={styles.sectionIntro}>Rather than attempting to implement every part of the long-term NeoSmart vision at once, AiForm Studio proposes starting with the operating core: the smallest complete system that allows a customer request to move through NeoSmart&rsquo;s operation and reach a recorded service completion.</p>
              <Flow steps={releaseFlow} />
              <p className={styles.emphasisLine}>The target is an operational system, not merely a clickable prototype or collection of interface screens.</p>
            </section>

            <section className={styles.section} aria-labelledby="phases-title">
              <p className={styles.sectionLabel}>03</p>
              <h2 id="phases-title" className={styles.sectionTitle}>A controlled path to the first operational release</h2>
              <div className={styles.phaseList}>
                {phases.map((phase) => (
                  <div key={phase.number} className={styles.phase}>
                    <div className={styles.phaseHead}>
                      <div>
                        <p className={styles.phaseNumber}>{phase.number}</p>
                        <p className={styles.phaseName}>{phase.name}</p>
                      </div>
                      <div className={styles.phaseAllocation}>
                        <p>Indicative allocation</p>
                        <p>{phase.allocation}</p>
                      </div>
                    </div>
                    <ul className={styles.phaseScope}>
                      {phase.scope.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                    <div className={styles.phaseOutcome}>
                      <p>Outcome</p>
                      <p>{phase.outcome}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className={styles.phaseNote}>These allocations are indicative planning allocations, not independent fixed-price quotations.</p>
            </section>

            <section className={styles.section} aria-labelledby="budget-title">
              <h2 id="budget-title" className="sr-only">Working budget</h2>
              <div className={styles.budgetBlock}>
                <p className={styles.budgetLabel}>Initial implementation envelope</p>
                <p className={styles.budgetApprox}>Approximately</p>
                <p className={styles.budgetValue}>R60,000</p>
                <p className={styles.budgetCopy}>R60,000 is a working budget boundary for the initial NeoSmart implementation, not an estimate for the complete NeoSmart vision.</p>
                <p className={styles.budgetCopy}>The purpose of this boundary is to guide decisions about what should form part of the first operational release. Discovery may result in functionality moving between phases or being deferred so that the initial build remains technically and operationally coherent.</p>
                <p className={styles.budgetCopy}>Final scope, milestones, pricing and payment terms would be confirmed separately before implementation.</p>
              </div>
            </section>

            <section className={styles.section} aria-labelledby="growth-title">
              <p className={styles.sectionLabel}>05</p>
              <h2 id="growth-title" className={styles.sectionTitle}>Where NeoSmart can grow</h2>
              <p className={styles.sectionIntro}>The broader NeoSmart concept already points toward capabilities beyond the first operational release. These can be developed progressively once the core service model has been proven.</p>
              <ul className={styles.capabilityList}>
                {growthCapabilities.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <p className={styles.capabilityNote}>These capabilities are not assumed to be fully included within the initial R60,000 working envelope. Some simplified versions may be appropriate for the first release where they are operationally essential.</p>
            </section>

            <section className={styles.section} aria-labelledby="discovery-title">
              <p className={styles.sectionLabel}>06</p>
              <h2 id="discovery-title" className={styles.sectionTitle}>Removing assumptions before development</h2>
              <p className={styles.sectionIntro}>Several operational decisions will directly affect the architecture, effort and cost of the platform. Discovery is where these assumptions should be converted into agreed operating rules.</p>
              <ul className={styles.topicList}>
                {discoveryTopics.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <p className={styles.topicNote}>Discovery is intended to remove assumptions before either party commits to the full implementation.</p>
              <p className={styles.disclaimer}>AiForm Studio has not validated the legality, licensing, safety requirements or regulatory feasibility of mobile fuel delivery. These are matters for discovery and for LeOra Group&rsquo;s own regulatory and legal review.</p>
            </section>

            <section className={styles.section} aria-labelledby="delivery-title">
              <p className={styles.sectionLabel}>07</p>
              <h2 id="delivery-title" className={styles.sectionTitle}>Built around visible progress</h2>
              <div className={styles.principleGrid}>
                {principles.map((principle) => (
                  <div key={principle.label} className={styles.principle}>
                    <p>{principle.label}</p>
                    <p>{principle.copy}</p>
                  </div>
                ))}
              </div>
              <p className={styles.principleNote}>Each phase can be commissioned separately. Proceeding with discovery does not automatically commit LeOra Group to every subsequent phase.</p>
            </section>

            <section className={styles.section} aria-labelledby="next-title">
              <h2 id="next-title" className={styles.sectionTitle}>Next step</h2>
              <p className={styles.sectionIntro}>If this preliminary direction reflects LeOra Group&rsquo;s expectations, the next step is to complete the Discovery &amp; System Design phase. This would convert the current concept into an agreed implementation scope and provide a stronger basis for final pricing, milestones and scheduling.</p>
              <div className={styles.finalActions}>
                <a href={discussHref} target={whatsappNumber ? "_blank" : undefined} rel={whatsappNumber ? "noopener noreferrer" : undefined} className={`button-primary ${styles.primary}`}>
                  Discuss the scope <span aria-hidden="true">→</span>
                </a>
                <Link href="/documents/leora-group/nda" className={`button-secondary ${styles.secondary}`}>
                  Review NDA
                </Link>
              </div>
              <div className={styles.footnote}>
                <p>Preliminary planning document.<br />Not a quotation, contractual offer or development agreement.</p>
                <p>AiForm Studio × LeOra Group<br /><time dateTime="2026-09-16">16 September 2026</time></p>
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
