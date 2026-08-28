import { NextResponse } from "next/server";
import { after } from "next/server";
import { randomUUID } from "crypto";
import { inquirySchema, type Inquiry } from "@/lib/inquiry";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { sendInquiryNotification } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

const GENERIC_ERROR =
  "I couldn't send that yet. Your answers haven't been lost. Please try again, or email aiformstudio@gmail.com directly.";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "You've sent a few of these already — I'll get to them. If it's urgent, please email aiformstudio@gmail.com directly.",
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: GENERIC_ERROR }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { ok: false, error: "Please add a little more context here.", fieldErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;

  const looksLikeSpam =
    Boolean(data.honeypot) ||
    (typeof data.startedAt === "number" && Date.now() - data.startedAt < 3000);

  if (looksLikeSpam) {
    // Report success without storing or emailing anything, so automated
    // submissions have no signal that they were caught.
    return NextResponse.json({ ok: true, id: randomUUID() });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error(
      "[inquiries] Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
    return NextResponse.json({ ok: false, error: GENERIC_ERROR }, { status: 500 });
  }

  const inquiry: Inquiry = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    inquiryType: data.inquiryType,
    collaborationType: data.collaborationType,
    problemDescription: data.problemDescription || undefined,
    projectDescription: data.projectDescription || undefined,
    desiredOutcome: data.desiredOutcome || undefined,
    currentStage: data.currentStage,
    existingUrl: data.existingUrl || undefined,
    currentStateNote: data.currentStateNote || undefined,
    referenceNotes: data.referenceNotes || undefined,
    helpTypes: data.helpTypes,
    timing: data.timing,
    budgetRange: data.budgetRange,
    name: data.name,
    email: data.email,
    phone: data.phone || undefined,
    organisation: data.organisation || undefined,
    role: data.role || undefined,
    preferredContact: data.preferredContact,
    status: "new",
  };

  const { error } = await supabase.from("studio_inquiries").insert({
    id: inquiry.id,
    created_at: inquiry.createdAt,
    inquiry_type: inquiry.inquiryType,
    collaboration_type: inquiry.collaborationType ?? null,
    problem_description: inquiry.problemDescription ?? null,
    project_description: inquiry.projectDescription ?? null,
    desired_outcome: inquiry.desiredOutcome ?? null,
    current_stage: inquiry.currentStage ?? null,
    existing_url: inquiry.existingUrl ?? null,
    current_state_note: inquiry.currentStateNote ?? null,
    reference_notes: inquiry.referenceNotes ?? null,
    help_types: inquiry.helpTypes ?? null,
    timing: inquiry.timing ?? null,
    budget_range: inquiry.budgetRange ?? null,
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone ?? null,
    organisation: inquiry.organisation ?? null,
    role: inquiry.role ?? null,
    preferred_contact: inquiry.preferredContact ?? null,
    status: inquiry.status,
  });

  if (error) {
    console.error("[inquiries] Supabase insert failed", error);
    return NextResponse.json({ ok: false, error: GENERIC_ERROR }, { status: 500 });
  }

  after(() => sendInquiryNotification(inquiry));

  return NextResponse.json({ ok: true, id: inquiry.id });
}
