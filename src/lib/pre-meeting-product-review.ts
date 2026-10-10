import "server-only";
import { createHash } from "node:crypto";
import { cache } from "react";
import { getPublicProductReview } from "@/lib/public-product-review";

// Reviewed client report for PR-2026-002. Canonical data and publication
// eligibility remain in getPublicProductReview; this copy renders only while
// the projection matches the fingerprint it was reviewed against. Observed
// behaviour, client statements, inferred consequences and unverified matters
// are kept in separate fields. Re-review the copy if the fingerprint changes.
const REFERENCE = "PR-2026-002";

const report = {
  sourceHash: "0000000000000000000000000000000000000000000000000000000000000000",
  title: "Credit Builder Flow — Pre-Meeting Website Review",
  preparedBy: "AiForm Studio",
  preparedFor: "Kea / Volve Media",
  date: "10 October 2026",
  engagement: "Complimentary",
  website: "https://recovery.creditbuilderflow.co.za/",
  executive: [
    "The offer addresses a recognisable dealership problem: recovering previously declined buyers without turning the F&I team into a credit rehabilitation desk. The narrative explains the handoff and why recovered sales matter. The main opportunity is to make supporting evidence, commercial boundaries and outcome labels as clear as the offer itself.",
    "Potential sales friction is inferred from the journey. No lost sales, conversion changes or actual customer reactions were measured. No Critical defect was established.",
  ],
  actions: [
    { horizon: "Now", items: ["Distinguish finance readiness, lender approval and delivery. Label the different case milestones and score-change periods."] },
    { horizon: "Next", items: [
      "Explain that both buyers and dealerships pay.",
      "Align the booking description with the intended dealership audit.",
      "Add a direct meeting link after case evidence.",
      "Explain referral attribution through commitments CBF controls.",
    ] },
    { horizon: "Investigate", items: [
      "Document the single-dealership basis of the monthly-return example.",
      "Define cohort percentages.",
      "Verify consent, attribution and supporting compliance claims.",
    ] },
  ],
  preserve: "Retain the acquisition-cost framing, four-step referral explanation, off-site workload reassurance, acknowledgement that not all buyers are recoverable, range of recovery examples and delivery-based fee trigger.",
  clarifications: [
    "Volkswagen personalisation is intentional. The cases provide additional process explanation and proof.",
    "Kea says different dates represent different milestones, and the shorter score increase represents a shorter measurement period. Precise labels remain unconfirmed.",
    "Kea prefers emphasis on finance readiness. This review keeps readiness, lender approval and completed delivery separate so readers can identify the milestone each case documents.",
    "According to Kea, the 6–10 monthly returning-buyer example is based on results at one dealership and depends on dealership lead volume. Supporting records, measurement period and approval/delivery split were not independently verified.",
    "Kea reports buyer pricing of R699 in the first month, followed by R199 monthly until finance qualification. Pricing is under adjustment.",
    "Kea reports a dealership fee of R6,000 per successful sale and 5% of vehicle value for vehicles over R130,000. Whether 5% replaces or supplements R6,000 remains unresolved. These are client-reported terms, not a verified published tariff.",
    "The intended meeting is ideally a dealership-specific audit.",
    "Kea recalls a calculator, but its location has not been confirmed on the recovery pages inspected. Calculator behaviour from the earlier Executive Decision Portal review must not be attributed to this product.",
  ],
  journey: [
    { stage: "Entry", text: "Saved-deal promise and low-administration proposition." },
    { stage: "Understanding", text: "Decline, branded referral, off-site recovery, showroom return." },
    { stage: "Evidence", text: "Featured case, timeline hub, three numbered cases." },
    { stage: "Objections", text: "Workload, recoverability, attribution and payment trigger." },
    { stage: "Action", text: "Book a 15-minute Revenue Salvage Audit through Calendly." },
  ],
  perspectives: [
    { role: "Dealership principal", text: "The economics and low fixed-cost pitch are understandable. Questions remain about net value after fees, delivered results, attribution and the evidence behind monthly volumes." },
    { role: "F&I manager", text: "The handoff is understandable. Referral confidence depends on buyer charges, eligibility, what to promise, status updates and who resubmits to the lender." },
  ],
  perspectivesNote: "These are analytical perspectives grounded in the pages, not interviews, actual customer testimony or measured behaviour.",
  findingsNote: "All potential sales consequences below are analytical inferences, not measured customer responses.",
  findings: [
    {
      reference: "R-01", title: "Volkswagen personalisation: clarified",
      priority: "Observation", horizon: "Later, conditional", basis: "Observed and client-clarified", confidence: "High confidence",
      clarification: "Kea confirms intentional personalisation. This is not an accidental naming defect.",
      recommendation: "Preserve it. If the same link is sent to non-Volkswagen prospects, verify that the destination is appropriate.",
    },
    {
      reference: "R-02", title: "Different timeline milestones need labels",
      priority: "Important", horizon: "Now", basis: "Observed comparison", confidence: "High confidence",
      observed: "Case #003 is labelled “Day 108 Cleared” in the hub; its detailed page describes a 120-day turnaround.",
      clarification: "Kea says the dates represent different milestones. Exact milestone mapping remains unconfirmed.",
      consequence: "Readers cannot tell whether the dates refer to debt clearance, finance readiness or another event.",
      recommendation: "Keep both dates if accurate, name each milestone and use consistent labels in the hub and chronology.",
    },
    {
      reference: "R-03", title: "Score-change period is not explicit",
      priority: "Important", horizon: "Now", basis: "Observed", confidence: "High confidence",
      observed: "Case #001 displays 580 to 614 alongside a +10-point increase. The overall difference is 34 points.",
      clarification: "Kea appears to confirm that +10 relates to a shorter period. The precise interval remains unidentified.",
      consequence: "Readers may interpret the presentation as an arithmetic mistake.",
      recommendation: "Separate overall movement from period-specific movement and include dates. Do not change underlying scores without checking case records.",
    },
    {
      reference: "R-04", title: "Readiness, approval and delivery need distinct outcomes",
      priority: "Important", horizon: "Now", basis: "Observed", confidence: "High confidence",
      observed: "Case #003 says “Approved & Cleared” while its conclusion describes readiness for submission. Other cases alternate approval and resubmission language.",
      clarification: "Kea regards these outcomes as closely connected and prefers finance-readiness emphasis. This does not establish lender approval or delivery for every case.",
      consequence: "Readers may expect an approved buyer when the documented milestone is readiness for reassessment.",
      recommendation: "Give each case one clear outcome line: recovery complete, ready for submission, lender approved, or delivered. Record who submits and the last documented milestone.",
    },
    {
      reference: "R-05", title: "Define fast-track populations and calculations",
      priority: "Important", horizon: "Investigate", basis: "Observed", confidence: "High confidence",
      observed: "The hub says 15–20% of the cohort, while Case #002 says less than 10% of showroom declines. Its headline uses 106% DTI while the narrative labels 96.5% baseline burden.",
      consequence: "Readers cannot reconcile the figures without knowing denominators and included commitments.",
      recommendation: "Define populations and measurement periods. Case #002 arithmetic checks:\n16,883 ÷ 17,500 is approximately 96.5%.\n(4,265 + 2,735) ÷ 17,500 is 40%.\nExplain the separate 106% calculation rather than calling all figures wrong.",
    },
    {
      reference: "R-06", title: "State the scope of the monthly-results example",
      priority: "Important", horizon: "Investigate", basis: "Observed claim; client-reported basis", confidence: "High confidence in wording",
      observed: "The hub projects 6–10 monthly pre-approved returning buyers without a visible measurement period or sample description.",
      clarification: "Kea says this comes from one dealership and depends on dealership lead volume.",
      consequence: "Readers could interpret a single-store example as a generally expected result.",
      recommendation: "Label it a single-dealership example. Show period, referrals, readiness, approvals and deliveries. Obtain supporting aggregated records rather than identifiable buyer files.",
    },
    {
      reference: "R-07", title: "Make both payment relationships visible",
      priority: "Important", horizon: "Next", basis: "Observed omission; client-reported terms", confidence: "High confidence in wording",
      observed: "The landing page states no setup fee, no retainer and payment linked to delivery, without clearly explaining buyer charges or fee basis.",
      clarification: "Both buyers and dealerships pay. Reported amounts and the unresolved percentage rule are recorded above.",
      consequence: "An F&I manager may hesitate to refer without knowing buyer costs; a principal cannot assess net benefit.",
      recommendation: "Explain payer, service, payment trigger and buyer recurring terms. Confirm tariff, cancellation/end conditions and percentage rule before publishing figures. Negotiated detail may remain for the meeting.",
    },
    {
      reference: "R-08", title: "Align meeting promise and preparation",
      priority: "Opportunity", horizon: "Next", basis: "Observed; progression reproduced", confidence: "High confidence",
      observed: "The site promises an audit; Calendly describes a discovery/integration meeting. The details form requests name, email and an optional preparation note.",
      clarification: "Kea confirms the intended meeting is ideally dealership-specific.",
      consequence: "The prospect may expect analysis while the host lacks basic inputs.",
      recommendation: "Match meeting language and request dealership, role, approximate decline volume and main decline categories. Avoid customer-identifying financial records. Exact figures can be optional estimates.",
    },
    {
      reference: "R-09", title: "Add a meeting route after case evidence",
      priority: "Opportunity", horizon: "Next", basis: "Observed link controls", confidence: "High confidence for inspected pages",
      observed: "The inspected hub and three numbered case pages provide return/previous/next links but no direct booking link.",
      consequence: "A convinced reader must return to the landing page to book.",
      recommendation: "Add a contextual booking CTA at the end of each case. Verify mobile placement separately. Reported pixel distances are not independent measurements in this review.",
    },
    {
      reference: "R-10", title: "Explain attribution through commitments CBF controls",
      priority: "Important", horizon: "Next", basis: "Observed; operational mechanism unverified", confidence: "High confidence in wording",
      observed: "The site describes buyers as locked to the dealership and implies a certain return. The featured case connects attribution to the buyer not considering other showrooms.",
      consequence: "A principal may interpret system attribution as control over customer purchasing choice.",
      recommendation: "Explain referral tracking, CBF return commitments, duration, multi-branch treatment and exceptions. Verify actual practice before proposing contractual wording.",
    },
    {
      reference: "R-11", title: "Reconcile redaction presentation and disclosure scope",
      priority: "Important", horizon: "Investigate", basis: "Observed; permissions unverified", confidence: "High confidence in wording",
      observed: "Redaction notices coexist with name-like route segments, named image descriptions and detailed personal financial context. The hub explicitly states client consent.",
      consequence: "The presentation may invite questions about how referred customers are protected.",
      recommendation: "Verify whether identifiers are real or pseudonymous and whether permission covers the published information. Where confidentiality is intended, use anonymous references consistently.",
      note: "No missing consent or POPIA violation is established.",
    },
    {
      reference: "R-12", title: "Substantiate compliance and endorsement claims",
      priority: "Important", horizon: "Investigate", basis: "Claims observed; validity unverified", confidence: "High confidence in wording",
      observed: "Pages use POPIA-aligned and absolute compliance wording, bank-rule assertions and a trusted-by logo strip. Supporting permissions and legal review were not inspected.",
      consequence: "Absolute assurances may invite scrutiny beyond what the page explains.",
      recommendation: "Have an appropriate adviser review legal assertions, explain operating boundaries and link relevant privacy information. Verify dealership relationships and logo permissions.",
      note: "This report makes no legal determination.",
    },
  ] as Finding[],
  improvements: [
    "The featured case changes the vehicle instalment from R9,500 to R7,980 without explaining changed financing assumptions in inspected text. Add a verified explanation if available. Do not infer the cause.",
    "The landing page mentions 60–90-day recoveries; linked cases extend to 180 days. Kea describes a 1–6-month range depending on profile. Make the full range visible with milestones and eligibility qualifications. This need not be framed as a contradiction.",
  ],
  coverage: [
    { title: "Testing completed", items: [
      "Direct browser inspection covered the landing page, revenue return page, timeline hub, three numbered cases and earlier inspection of the featured Thabile case. Tested hub-to-case, previous-case and return navigation paths loaded successfully.",
      "Calendly date selection, time selection and Next progression were reproduced to the details form for 12 October 2026, 10:00 Central Africa Time, 15 minutes.",
      "No personal data was entered. Schedule Event was not pressed. Successful submission, confirmation and notifications remain untested.",
    ] },
    { title: "Supplementary evidence", items: [
      "A supplied Claude review reports 375 × 812 mobile emulation, late booking CTA placement, lightbox operation and image-readability concerns. These remain attributed reports, not independently reproduced mobile tests.",
      "GPT and Gemini text submissions were identical and counted once as a distinct source. Agreement between models is not verification.",
    ] },
    { title: "Review boundaries", items: [
      "No physical-device testing, independent mobile emulation, exhaustive link audit, complete accessibility audit, page-speed study, consumer referral/intake test, WhatsApp test, backend/source-code review, penetration test or compliance certification was performed.",
      "Case authenticity, consent records, lender decisions and measured results remain unverified. No lost sales or conversion effects were measured.",
    ] },
  ],
  questions: [
    "Does 5% replace or supplement R6,000, and what is the rule at exactly R130,000?",
    "Over what period did the single dealership achieve 6–10 monthly returns, and which milestone was counted?",
    "Which page contains the calculator?",
    "What exact dates/milestones explain 108 versus 120 days and the shorter +10-point change?",
  ],
  sequence: [
    { step: "First", text: "Reconcile case labels, dates and score periods; keep intentional personalisation." },
    { step: "Second", text: "Publish confirmed payment boundaries, align the audit booking and add case-level CTAs." },
    { step: "Third", text: "Document statistics and trust claims, then retest the updated journey on desktop and physical mobile devices." },
  ],
  status: "This report does not establish client approval, remediation completion, authorisation to implement changes on the CBF website, a paid engagement or permission to publish a case study.",
  source: [
    "Live recovery site and linked Calendly inspected on 9 October 2026; supplied Claude PDF and identical GPT/Gemini text reviews; user-supplied transcripts of Kea’s clarification incorporated into the consolidated review.",
    "Client statements are distinguished from independently observed website behaviour.",
  ],
};

type Finding = {
  reference: string; title: string; priority: string; horizon: string; basis: string; confidence: string;
  observed?: string; clarification?: string; consequence?: string; recommendation: string; note?: string;
};

/** True when a reference may only render through its reviewed report copy. */
export function requiresPreMeetingReport(reference: string) {
  return reference === REFERENCE;
}

export const getPreMeetingProductReview = cache(async (reference: string) => {
  if (reference !== REFERENCE) return null;
  const review = await getPublicProductReview(reference);
  if (!review) return null;
  const hash = createHash("sha256").update(JSON.stringify(review)).digest("hex");
  if (hash !== report.sourceHash) return null;
  return { review, copy: report };
});
