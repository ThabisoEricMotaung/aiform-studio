import "server-only";
import { createHash } from "node:crypto";
import { cache } from "react";
import { getPublicProductReview } from "@/lib/public-product-review";

// Editorial presentation only. Canonical data and publication eligibility remain
// in getPublicProductReview. Re-review this copy if its source fingerprint changes.
const pilot = {
  sourceHash: "a85393c0c0ca2df440923d409086680fda3aed6d15bc38877de39b4146dd212b",
  takeaway: "Keep the six-step journey. It presents the offer in a clear, connected way. The next round of work should focus on details that weaken the confidence it builds: how case studies protect identities, whether the content consistently addresses the intended dealership, and how people reach the final booking step.",
  working: [
    "The six-step explanation works well for this product, and people can follow it without logging in.",
    "The return-on-investment calculator gave internally consistent results in the checks performed.",
    "Moving backwards and forwards, and fully reloading the page, worked reliably. The calculator kept its values after a full reload.",
    "The fees are clearly explained, and the sample service agreement is clearly identified as a sample.",
    "The booking form correctly stopped an empty submission from being sent, although it did not clearly explain that to the person using it.",
  ],
  preserve: "Keep the six-step structure, clear fee explanations, labels that identify sample documents, and the calculator calculations and saved values that worked in testing. Keep the way the provider presents its comparisons, provided the claims can be supported.",
  scope: "We followed the six-step journey on the live website using a desktop. We looked at the case studies, the return-on-investment calculator, what happened when an empty booking form was submitted, moving between steps and retaining entered values, the sample agreement, and a limited set of loading and error behaviours.",
  coverage: ["Understand the offer", "Consider the proposed solution", "Assess the case studies", "Consider risks and protections", "Estimate the financial return", "Move towards an agreement or booking", "Move through the experience and return to it"],
  findings: [
    {
      reference: "F-001", title: "Case-study web addresses appear to include personal names", priority: "Check this now",
      found: "The case-study web addresses contain what appear to be personal names, while the page says that identifying details have been removed.",
      matters: "This conflicts with the promise of confidentiality and can weaken trust. We have not established whether the names belong to real people. This finding does not establish a POPIA violation.",
      action: "Check whether the names identify real people. Where appropriate, replace identifying names in web addresses and file names with anonymous case numbers or labels.",
      known: "We reproduced this and have high confidence in the observation. Whether the names identify real people remains unconfirmed.",
    },
    {
      reference: "F-002", title: "One case study shows a different dealership name", priority: "Address this now",
      found: "Case File #001 repeatedly shows “Apex Auto Group”, while the surrounding experience addresses “Volkswagen Auto Group”.",
      matters: "When a presentation is meant to feel prepared for a particular prospect, inconsistent names can make that prospect question whether it was prepared for them.",
      action: "Trace where the name comes from. Check whether it is leftover sample text, content being used in the wrong place, or a wider implementation issue. There is no evidence here to call it a data leak.",
      known: "We reproduced the mismatch and have high confidence in the observation. Its cause still needs to be checked.",
    },
    {
      reference: "F-003", title: "The calculator slider is difficult to drag", priority: "Address this next",
      found: "Dragging the slider selected text instead of moving it as expected, and the far-right end had an area that did not respond. Clicking along the slider track worked. The calculations we tested were correct.",
      matters: "This gets in the way when a prospect is estimating the financial value of the offer.",
      action: "Repair how the slider responds to dragging and to its maximum position. Preserve the calculation logic that worked in testing.",
      known: "We reproduced this and have high confidence in the observation. The finding concerns the control, not an error in the tested calculations.",
    },
    {
      reference: "F-004", title: "An empty booking form stops without explaining why", priority: "Address this next",
      found: "When we tried to submit the empty booking form, it did not show a visible error message or other visible change explaining the problem. The active input moved, and no request was sent to the server.",
      matters: "A person may not understand why they cannot continue or which information they need to add.",
      action: "Show clear messages next to the fields that need attention. Keep the protection that prevents an invalid submission from being sent.",
      known: "We observed this and have high confidence in the observation. A successful booking submission and partly completed invalid forms were not tested.",
    },
    {
      reference: "F-005", title: "The page stopped responding once at the final step", priority: "Needs investigation",
      found: "During one session in which we followed all six steps in order, the page stopped responding at Step 6. Opening a fresh tab worked.",
      matters: "If this can happen again, it could prevent someone from completing the full intended journey.",
      action: "Try to reproduce the problem under controlled conditions and measure what happens during the session before deciding what caused it.",
      known: "Seen once; needs confirmation. Confidence is moderate, and the cause has not been established.",
    },
    {
      reference: "F-006", title: "Fast scrolling sometimes leaves a temporary blank area", priority: "Worth investigating",
      found: "When scrolling quickly, we sometimes saw blank space before the animations finished bringing the content into view.",
      matters: "This can make the page feel slower to respond.",
      action: "Check whether the behaviour can be repeated on different devices and browsers before changing the animations.",
      known: "We observed this, with moderate confidence. Its behaviour across devices and browsers still needs checking.",
    },
    {
      reference: "F-007", title: "Step numbers and the missing-page screen need tidying", priority: "Improve when practical",
      found: "The step numbers shown on the page do not consistently match the numbers in the web addresses. An invalid address also showed the hosting provider’s standard page-not-found screen.",
      matters: "These small inconsistencies make the experience feel less finished.",
      action: "Make the web-address numbering consistent with the steps where practical, and provide a page-not-found screen that fits the product’s identity.",
      known: "We observed this, with moderate confidence.",
    },
  ],
  assumptions: [
    { reference: "A01", text: "Check whether decision-makers understand the finance and compliance terms used in the presentation.", known: "There is reason to question this assumption, with moderate confidence. Audience understanding has not been established." },
    { reference: "A02", text: "Check whether removing names from the visible page is enough to protect case-study identities when web addresses can still contain apparent names.", known: "There is strong reason to question this assumption. Whether those names identify real people remains unknown." },
    { reference: "A03", text: "Check whether the calculator’s starting values are appropriate and whether people understand how those starting values influence their estimates.", known: "This needs checking; confidence in the assessment is moderate." },
    { reference: "A04", text: "Check whether desktop is really the main way the intended audience will use the experience.", known: "This needs checking; confidence is low. Actual use on mobile was not verified." },
    { reference: "A05", text: "The full journey depends on the experience continuing to work throughout a long session. Check that it does.", known: "Confidence in this concern is moderate. The one-time failure needs confirmation, and its cause is unknown." },
    { reference: "A06", text: "Check whether moving the active input, without a visible explanation, tells people enough about why a booking form cannot be submitted.", known: "There is strong reason to question this assumption." },
  ],
  limitations: [
    "We did not test a successful booking submission.",
    "We did not test forms that were partly completed but still contained missing or invalid information.",
    "We did not test contacting the business through WhatsApp.",
    "We did not verify actual behaviour on mobile devices or narrow screens.",
    "We did not inspect the systems behind the website, its database, or its source code.",
    "We did not perform security testing or try to break into the system.",
    "We did not carry out a formal POPIA or legal compliance assessment.",
    "We did not establish what caused the session to stop responding or the temporary blanks while content appeared.",
    "We did not establish whether the names in the case-study addresses belong to real people.",
  ],
};

export const getPlainLanguageProductReview = cache(async (reference: string) => {
  const review = await getPublicProductReview(reference);
  if (!review || reference !== "PR-2026-001") return null;
  const hash = createHash("sha256").update(JSON.stringify(review)).digest("hex");
  if (hash !== pilot.sourceHash) return null;
  return { review, copy: pilot };
});
