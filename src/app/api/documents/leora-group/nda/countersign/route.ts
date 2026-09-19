import { randomUUID, createHash } from "node:crypto";
import { COUNTERSIGN_CONSENT, COUNTERSIGN_CONSENT_VERSION, STUDIO_COUNTERSIGNATORY } from "@/lib/leora-document";
import { errorResponse, json, readJson, requireSameOrigin } from "@/lib/leora-signing-server";
import { countersignSchema } from "@/lib/studio-countersign-schema";
import { getExecutionForCountersign, requireStudioSession, studioRateLimit } from "@/lib/studio-countersign-server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireStudioSession();
    const execution = await getExecutionForCountersign();
    return json({
      execution,
      studioCountersignatory: STUDIO_COUNTERSIGNATORY,
      consentText: COUNTERSIGN_CONSENT,
    });
  } catch (error) { return errorResponse(error); }
}

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    await requireStudioSession();
    await studioRateLimit(request, "submit");
    const parsed = countersignSchema.safeParse(await readJson(request, 300_000));
    if (!parsed.success) return json({ error: "Please confirm your name, capacity, consent, and draw your signature.", fields: parsed.error.flatten().fieldErrors }, 400);
    const data = parsed.data;
    const execution = await getExecutionForCountersign();
    if (!execution) return json({ error: "There is no client execution to countersign yet." }, 409);
    if (execution.id !== data.executionId) return json({ error: "This countersignature no longer matches the current execution. Please reload and try again." }, 409);
    if (execution.alreadyCountersigned) return json({ error: "This agreement has already been fully executed. Duplicate countersigning is not permitted." }, 409);
    const { error } = await getSupabaseAdmin()!.from("studio_document_countersignatures").insert({
      id: randomUUID(), execution_id: execution.id,
      signatory_name: data.signatoryName, capacity: data.capacity,
      signature: data.signature, signature_format: "normalized-strokes-v1",
      signature_hash: createHash("sha256").update(JSON.stringify(data.signature)).digest("hex"),
      consent: true, consent_text: COUNTERSIGN_CONSENT, consent_version: COUNTERSIGN_CONSENT_VERSION,
      authenticated_actor: "studio-countersign-session",
    });
    // The unique execution_id constraint handles a simultaneous duplicate submission atomically.
    if (error) {
      if (error.code === "23505") return json({ error: "This agreement has already been fully executed. Duplicate countersigning is not permitted." }, 409);
      throw new Error("Countersignature insert failed");
    }
    const confirmed = await getExecutionForCountersign();
    return json({ execution: confirmed }, 201);
  } catch (error) { return errorResponse(error); }
}
