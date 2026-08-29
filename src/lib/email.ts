import { Resend } from "resend";
import {
  audienceOptions,
  budgetOptions,
  buildInquirySummary,
  currentProblemOptions,
  desiredOutcomeOptions,
  enquiryTypeOptions,
  labelFor,
  projectStageOptions,
  timelineOptions,
  type Inquiry,
} from "@/lib/inquiry";

const DEFAULT_NOTIFICATION_EMAIL = "aiformstudio@gmail.com";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderValue(value?: string | null): string {
  return value ? escapeHtml(value) : "—";
}

function renderList(values: string[] | undefined, options: readonly { value: string; label: string }[]) {
  if (!values?.length) return "—";
  return values.map((value) => escapeHtml(labelFor(options, value))).join("<br>");
}

function buildInquiryHtml(inquiry: Inquiry): string {
  const phoneDigits = inquiry.phone?.replace(/[^\d]/g, "");
  const whatsappHref = phoneDigits ? `https://wa.me/${phoneDigits}` : undefined;
  const replyHref = `mailto:${encodeURIComponent(inquiry.email)}`;

  const rows = [
    ["What they need", labelFor(enquiryTypeOptions, inquiry.enquiryType)],
    ["Current problem", renderList(inquiry.currentProblems, currentProblemOptions)],
    ["Desired outcome", renderList(inquiry.desiredOutcomes, desiredOutcomeOptions)],
    ["For", renderList(inquiry.audiences, audienceOptions)],
    ["Current stage", labelFor(projectStageOptions, inquiry.projectStage)],
    ["Timeline", labelFor(timelineOptions, inquiry.timeline)],
    ["Budget", labelFor(budgetOptions, inquiry.budget)],
  ] as const;

  const detailRows = rows
    .map(
      ([heading, value]) => `
        <tr>
          <td style="padding:0 0 6px;color:#6e746e;font-size:12px;letter-spacing:.08em;text-transform:uppercase;vertical-align:top;width:145px;">${heading}</td>
          <td style="padding:0 0 18px;color:#1d2a23;font-size:15px;line-height:1.5;">${value || "—"}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f4f1e9;color:#1d2a23;font-family:Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;">New enquiry from ${escapeHtml(inquiry.name)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f1e9;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#fffdf8;border:1px solid #ded9cc;">
          <tr><td style="padding:36px 40px 30px;border-top:4px solid #254b3c;">
            <p style="margin:0 0 10px;color:#9a7a33;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">AiForm Studio</p>
            <h1 style="margin:0;font-size:28px;line-height:1.15;font-weight:600;">New Studio enquiry</h1>
            <p style="margin:12px 0 0;color:#6e746e;font-size:14px;">Received ${escapeHtml(new Date(inquiry.createdAt).toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Johannesburg" }))}</p>
          </td></tr>
          <tr><td style="padding:0 40px 26px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0">${detailRows}</table></td></tr>
          ${inquiry.additionalContext ? `<tr><td style="padding:24px 40px;border-top:1px solid #ded9cc;"><p style="margin:0 0 8px;color:#6e746e;font-size:12px;letter-spacing:.08em;text-transform:uppercase;">Additional context</p><p style="margin:0;font-size:15px;line-height:1.6;">${renderValue(inquiry.additionalContext)}</p></td></tr>` : ""}
          <tr><td style="padding:28px 40px;border-top:1px solid #ded9cc;">
            <p style="margin:0 0 18px;color:#6e746e;font-size:12px;letter-spacing:.08em;text-transform:uppercase;">Contact</p>
            <p style="margin:0 0 6px;font-size:16px;font-weight:600;">${renderValue(inquiry.name)}</p>
            ${inquiry.organisation ? `<p style="margin:0 0 6px;color:#6e746e;">${renderValue(inquiry.organisation)}</p>` : ""}
            <p style="margin:0 0 6px;"><a href="${replyHref}" style="color:#254b3c;">${renderValue(inquiry.email)}</a></p>
            ${inquiry.phone ? `<p style="margin:0;color:#6e746e;">${renderValue(inquiry.phone)}</p>` : ""}
            <div style="margin-top:24px;">
              <a href="${replyHref}" style="display:inline-block;margin:0 10px 10px 0;padding:11px 16px;background:#254b3c;color:#fffdf8;text-decoration:none;font-size:14px;">Reply to enquiry</a>
              ${whatsappHref ? `<a href="${whatsappHref}" style="display:inline-block;padding:10px 16px;border:1px solid #254b3c;color:#254b3c;text-decoration:none;font-size:14px;">Open WhatsApp</a>` : ""}
            </div>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

/**
 * Fire-and-forget from the caller's perspective — never throws, since a
 * failed notification must not surface as a failed submission (the inquiry
 * is already safely stored). Internally, every outcome is logged with a
 * distinct, greppable prefix so delivery failures are never silent:
 *   [inquiries][email:sent]           — accepted by Resend
 *   [inquiries][email:rejected]       — Resend returned an API error
 *   [inquiries][email:not-configured] — RESEND_API_KEY missing
 *   [inquiries][email:error]          — unexpected exception (network, SDK, etc.)
 */
export async function sendInquiryNotification(inquiry: Inquiry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn(
      "[inquiries][email:not-configured] RESEND_API_KEY is not set — skipping email notification. The inquiry was still stored.",
    );
    return;
  }

  const to = process.env.CONTACT_NOTIFICATION_EMAIL || DEFAULT_NOTIFICATION_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL || "AiForm Studio <onboarding@resend.dev>";
  const fromDomain = from.match(/@([^\s>]+)/)?.[1] ?? from;

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to,
      replyTo: inquiry.email,
      subject: `New AiForm Studio inquiry — ${inquiry.name} — ${labelFor(enquiryTypeOptions, inquiry.enquiryType)}`,
      html: buildInquiryHtml(inquiry),
      text: inquiry.summary || buildInquirySummary(inquiry),
    });

    if (error) {
      // Resend's SDK resolves (rather than throws) on API-level failures —
      // e.g. an unverified sender domain, or the resend.dev test sender
      // refusing to deliver to a recipient other than the account owner.
      // Checking `error` here is what makes those failures visible at all.
      console.error("[inquiries][email:rejected]", {
        inquiryId: inquiry.id,
        fromDomain,
        to,
        errorName: error.name,
        errorMessage: error.message,
      });
      return;
    }

    console.log("[inquiries][email:sent]", { inquiryId: inquiry.id, resendId: data?.id, fromDomain, to });
  } catch (error) {
    console.error("[inquiries][email:error]", {
      inquiryId: inquiry.id,
      fromDomain,
      to,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
