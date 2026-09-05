import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "How AiForm Studio collects, uses and protects information submitted through this website.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://aiformstudio.co.za/privacy",
    siteName: "AiForm Studio",
    title: "Privacy Notice | AiForm Studio",
    description: "How AiForm Studio collects, uses and protects information submitted through this website.",
    images: [{ url: "https://aiformstudio.co.za/images/aiform-story.png", width: 1254, height: 1254, alt: "AiForm Studio logo and its moth-inspired design origins" }],
  },
  twitter: {
    card: "summary",
    title: "Privacy Notice | AiForm Studio",
    description: "How AiForm Studio collects, uses and protects information submitted through this website.",
    images: ["https://aiformstudio.co.za/images/aiform-story.png"],
  },
};

const sections = [
  {
    label: "01 / Who we are",
    heading: "Who we are",
    body: (
      <>
        <p className="mt-5 text-lg leading-8 text-text/85">
          AiForm Studio (Pty) Ltd (registration number 2026/692621/07) is a
          South African private company based in Pretoria, led by Thabiso
          Eric Motaung. For the purposes of this notice, AiForm Studio is
          responsible for deciding how information submitted through this
          website is used.
        </p>
        <p className="mt-5 text-lg leading-8 text-text/85">
          You can reach us at{" "}
          <a href="mailto:aiformstudio@gmail.com" className="underline decoration-line underline-offset-4 hover:text-green">
            aiformstudio@gmail.com
          </a>
          , or at 607 Fred Messenger Avenue, Andeon AH, Pretoria, 0183, South
          Africa.
        </p>
      </>
    ),
  },
  {
    label: "02 / Information you give us",
    heading: "Information you give us",
    body: (
      <>
        <p className="mt-5 text-lg leading-8 text-text/85">
          The main way we collect information is through the enquiry form on
          our Contact page. Depending on what you choose to tell us, this can
          include your name, organisation, email address, phone or WhatsApp
          number, and a description of the problem you&apos;re trying to
          solve — along with any answers you give as you work through the
          guided questions.
        </p>
        <p className="mt-5 text-lg leading-8 text-text/85">
          While you&apos;re filling in the form, your answers are temporarily
          kept in your browser&apos;s session storage so your progress
          isn&apos;t lost if you navigate away or refresh the page. This is
          not a cookie — it isn&apos;t used to track you, it stays on your
          device, and it&apos;s cleared once you submit the form or close
          your browser session.
        </p>
        <p className="mt-5 text-lg leading-8 text-text/85">
          Please don&apos;t include passwords, access credentials, ID
          numbers, or any other sensitive information you don&apos;t need to
          share with us for us to understand your enquiry.
        </p>
      </>
    ),
  },
  {
    label: "03 / Why we use it",
    heading: "Why we use it",
    body: (
      <p className="mt-5 text-lg leading-8 text-text/85">
        We use what you tell us to understand your enquiry, work out whether
        we&apos;re a good fit for what you&apos;re trying to do, and reply to
        you. We also keep a record of enquiries so we have context if a
        conversation continues later.
      </p>
    ),
  },
  {
    label: "04 / How we handle it",
    heading: "How we handle it",
    body: (
      <p className="mt-5 text-lg leading-8 text-text/85">
        When you submit the form, your answers are stored and an internal
        notification is sent so someone at the studio can read and respond to
        it. We don&apos;t use enquiry information for advertising, we
        don&apos;t build marketing profiles from it, and we don&apos;t sell
        it to anyone.
      </p>
    ),
  },
  {
    label: "05 / Service providers",
    heading: "Service providers",
    body: (
      <>
        <p className="mt-5 text-lg leading-8 text-text/85">
          Running a website and responding to enquiries means relying on a
          small number of outside service providers to do specific jobs on
          our behalf:
        </p>
        <ul className="mt-5 space-y-3 pl-6 text-lg leading-8 text-text/85 list-disc">
          <li><strong className="font-semibold text-text">Vercel</strong> hosts this website.</li>
          <li><strong className="font-semibold text-text">Supabase</strong> stores enquiry submissions.</li>
          <li><strong className="font-semibold text-text">Resend</strong> delivers the notification email that lets us know an enquiry has come in.</li>
          <li><strong className="font-semibold text-text">Google/Gmail</strong> handles our day-to-day studio email.</li>
          <li><strong className="font-semibold text-text">Calendly</strong>, if you choose to use it, handles project-conversation bookings.</li>
          <li><strong className="font-semibold text-text">WhatsApp/Meta</strong>, if you choose to message us there, handles that conversation.</li>
        </ul>
        <p className="mt-6 text-lg leading-8 text-text/85">
          Calendly and WhatsApp are both optional — you&apos;re never
          required to use either. The answers you give in the enquiry form
          aren&apos;t automatically sent to WhatsApp. If you open the
          Calendly booking option after submitting an enquiry, it may
          pre-fill your name and email to save you retyping them.
        </p>
        <p className="mt-5 text-lg leading-8 text-text/85">
          Each of these providers has its own privacy practices governing how
          they handle information on their platforms, separate from this
          notice. AiForm Studio does not sell enquiry information to anyone.
        </p>
      </>
    ),
  },
  {
    label: "06 / International processing",
    heading: "International processing",
    body: (
      <p className="mt-5 text-lg leading-8 text-text/85">
        Some of the providers listed above may process information on
        servers located outside South Africa. Where that&apos;s the case, we
        consider the safeguards and service arrangements those providers
        have in place before relying on them.
      </p>
    ),
  },
  {
    label: "07 / How long we keep enquiries",
    heading: "How long we keep enquiries",
    body: (
      <>
        <p className="mt-5 text-lg leading-8 text-text/85">
          AiForm Studio generally keeps inactive or unsuccessful project
          enquiries for up to 12 months after the last meaningful contact,
          unless there is a legitimate business or legal reason to retain the
          information for longer.
        </p>
        <p className="mt-5 text-lg leading-8 text-text/85">
          If an enquiry becomes a client engagement, relevant information may
          need to be retained for longer, for contractual, accounting, tax or
          legal purposes.
        </p>
      </>
    ),
  },
  {
    label: "08 / Security",
    heading: "Security",
    body: (
      <p className="mt-5 text-lg leading-8 text-text/85">
        We take reasonable steps to protect the information you share with
        us — for example, the systems handling enquiries run over encrypted
        connections, and access to stored enquiries is restricted to what the
        studio&apos;s systems need to operate. No method of storage or
        transmission over the internet is completely secure, so while we work
        to protect your information, we can&apos;t guarantee absolute
        security.
      </p>
    ),
  },
  {
    label: "09 / Your rights",
    heading: "Your rights",
    body: (
      <>
        <p className="mt-5 text-lg leading-8 text-text/85">
          Under the Protection of Personal Information Act (POPIA), you have
          the right to:
        </p>
        <ul className="mt-5 space-y-3 pl-6 text-lg leading-8 text-text/85 list-disc">
          <li>ask what information we hold about you and request a copy of it</li>
          <li>ask us to correct information that&apos;s inaccurate or out of date</li>
          <li>ask us to delete your information, where we&apos;re not required to keep it for a legitimate business or legal reason</li>
          <li>object to how we&apos;re using your information</li>
          <li>withdraw consent, in any case where consent is actually what we&apos;re relying on to use your information</li>
          <li>lodge a complaint with the Information Regulator (details below)</li>
        </ul>
        <p className="mt-6 text-lg leading-8 text-text/85">
          We may need to verify your identity before acting on a request.
          Deletion isn&apos;t always immediate or unconditional — for
          example, we may need to keep some information where the law
          requires it or where it relates to an active client engagement.
        </p>
      </>
    ),
  },
  {
    label: "10 / Contact and complaints",
    heading: "Contact and complaints",
    body: (
      <>
        <p className="mt-5 text-lg leading-8 text-text/85">
          If you have a question about this notice, or want to exercise any
          of the rights above, contact us at{" "}
          <a href="mailto:aiformstudio@gmail.com" className="underline decoration-line underline-offset-4 hover:text-green">
            aiformstudio@gmail.com
          </a>{" "}
          or 607 Fred Messenger Avenue, Andeon AH, Pretoria, 0183, South
          Africa.
        </p>
        <p className="mt-5 text-lg leading-8 text-text/85">
          If you feel we haven&apos;t handled your information properly and
          would like to take it further, you can complain to South
          Africa&apos;s Information Regulator:
        </p>
        <div className="mt-6 border-l-2 border-gold pl-6 text-base leading-7 text-text/85">
          <p>Email: POPIAComplaints@inforegulator.org.za</p>
          <p className="mt-1">General enquiries: enquiries@inforegulator.org.za</p>
          <p className="mt-1">Phone: 010 023 5200 (toll-free 0800 017 160)</p>
          <p className="mt-1">Address: Woodmead North Office Park, 54 Maxwell Drive, Woodmead, Johannesburg, 2191</p>
        </div>
      </>
    ),
  },
  {
    label: "11 / Changes to this notice",
    heading: "Changes to this notice",
    body: (
      <p className="mt-5 text-lg leading-8 text-text/85">
        We may update this notice from time to time — for example, if we
        start using a new service provider, or as our practices evolve. The
        effective date at the top will change whenever we do. If a change is
        significant, we&apos;ll look at ways to make it noticeable on the
        site rather than relying on you finding it here.
      </p>
    ),
  },
] as const;

export default function PrivacyPage() {
  return (
    <>
      <section className="editorial-grid relative overflow-hidden py-24 md:py-32">
        <div className="col-span-12 md:col-span-2">
          <p className="chapter-label">AiForm / Privacy</p>
        </div>
        <div className="col-span-12 mt-10 md:col-start-3 md:col-span-8 md:mt-0">
          <h1 className="section-title">Your privacy, in plain terms.</h1>
          <p className="mt-6 text-sm uppercase tracking-[.1em] text-muted">
            Effective from 29 August 2026
          </p>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
            This notice explains what happens to your information when you
            visit aiformstudio.co.za or send us an enquiry. We&apos;ve tried
            to write it the way we&apos;d explain it in conversation, not the
            way a legal document usually reads.
          </p>
        </div>
      </section>

      <section className="editorial-grid border-t border-line bg-bg-alt py-20 md:py-28">
        <div className="col-span-12 md:col-start-4 md:col-span-6">
          {sections.map((section) => (
            <div key={section.label} id={section.heading.toLowerCase().replace(/[^a-z]+/g, "-")} className="mt-16 scroll-mt-24 border-t border-line pt-10 first:mt-0 first:border-t-0 first:pt-0">
              <p className="chapter-label">{section.label}</p>
              <h2 className="mt-4 font-display text-2xl md:text-3xl">{section.heading}</h2>
              {section.body}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
