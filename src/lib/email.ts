import { Resend } from "resend";
import { buildInquirySummary, labelFor, enquiryTypeOptions, type Inquiry } from "@/lib/inquiry";

const DEFAULT_NOTIFICATION_EMAIL = "aiformstudio@gmail.com";

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
      subject: `New AiForm Studio inquiry — ${inquiry.name} — ${labelFor(enquiryTypeOptions, inquiry.enquiryType)}`,
      text: inquiry.summary || buildInquirySummary(inquiry),
    });
  } catch (error) {
    console.error("[inquiries] Failed to send notification email", error);
  }
}
