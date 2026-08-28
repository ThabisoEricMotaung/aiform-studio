import { Resend } from "resend";
import {
  labelFor,
  inquiryTypeOptions,
  collaborationTypeOptions,
  currentStageOptions,
  helpTypeOptions,
  timingOptions,
  budgetRangeOptions,
  preferredContactOptions,
  type Inquiry,
} from "@/lib/inquiry";

const DEFAULT_NOTIFICATION_EMAIL = "aiformstudio@gmail.com";

function buildPlainTextSummary(inquiry: Inquiry): string {
  const lines: string[] = [
    `Inquiry type: ${labelFor(inquiryTypeOptions, inquiry.inquiryType)}`,
  ];

  if (inquiry.collaborationType?.length) {
    lines.push(
      `Collaboration areas: ${inquiry.collaborationType
        .map((value) => labelFor(collaborationTypeOptions, value))
        .join(", ")}`,
    );
  }
  if (inquiry.problemDescription) {
    lines.push("", "Problem / situation:", inquiry.problemDescription);
  }
  if (inquiry.projectDescription) {
    lines.push("", "Project / collaboration:", inquiry.projectDescription);
  }
  if (inquiry.desiredOutcome) {
    lines.push("", "Desired outcome:", inquiry.desiredOutcome);
  }
  if (inquiry.currentStage) {
    lines.push("", `Current stage: ${labelFor(currentStageOptions, inquiry.currentStage)}`);
  }
  if (inquiry.existingUrl) {
    lines.push(`Existing / project URL: ${inquiry.existingUrl}`);
  }
  if (inquiry.currentStateNote) {
    lines.push(`Note on current state: ${inquiry.currentStateNote}`);
  }
  if (inquiry.helpTypes?.length) {
    lines.push(
      "",
      `Help requested: ${inquiry.helpTypes.map((value) => labelFor(helpTypeOptions, value)).join(", ")}`,
    );
  }
  if (inquiry.referenceNotes) {
    lines.push("", "References to look at:", inquiry.referenceNotes);
  }
  if (inquiry.timing) {
    lines.push("", `Timing: ${labelFor(timingOptions, inquiry.timing)}`);
  }
  if (inquiry.budgetRange) {
    lines.push(`Budget range: ${labelFor(budgetRangeOptions, inquiry.budgetRange)}`);
  }

  lines.push(
    "",
    "Contact details:",
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
  );
  if (inquiry.phone) lines.push(`Phone / WhatsApp: ${inquiry.phone}`);
  if (inquiry.organisation) lines.push(`Organisation: ${inquiry.organisation}`);
  if (inquiry.role) lines.push(`Role: ${inquiry.role}`);
  if (inquiry.preferredContact) {
    lines.push(`Preferred contact method: ${labelFor(preferredContactOptions, inquiry.preferredContact)}`);
  }

  return lines.join("\n");
}

/**
 * Fire-and-forget. Never throws — a failed notification must not surface as
 * a failed submission, since the inquiry is already safely stored.
 */
export async function sendInquiryNotification(inquiry: Inquiry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn(
      "[inquiries] RESEND_API_KEY is not set — skipping email notification. The inquiry was still stored.",
    );
    return;
  }

  const to = process.env.CONTACT_NOTIFICATION_EMAIL || DEFAULT_NOTIFICATION_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL || "AiForm Studio <onboarding@resend.dev>";

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      replyTo: inquiry.email,
      subject: `New AiForm Studio inquiry — ${inquiry.name} — ${labelFor(inquiryTypeOptions, inquiry.inquiryType)}`,
      text: buildPlainTextSummary(inquiry),
    });
  } catch (error) {
    console.error("[inquiries] Failed to send notification email", error);
  }
}
