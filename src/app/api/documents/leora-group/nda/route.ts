import { randomUUID, createHash } from "node:crypto";
import { CONSENT_VERSION, LEORA_DOCUMENT, SIGNING_CONSENT } from "@/lib/leora-document";
import { signingSchema } from "@/lib/leora-signing-schema";
import { errorResponse, getExecution, json, rateLimit, readJson, requireSameOrigin, requireSession, verifiedPdf } from "@/lib/leora-signing-server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireSession();
    const receipt = await getExecution();
    return json({ receipt, defaults: receipt ? null : {
      name: "Neo Makgoba", business: "LeOra Group",
      address: "169 Corobay Avenue\nB3-02 Corobay Corner\nWaterkloof Glen\n0001",
    } });
  } catch (error) { return errorResponse(error); }
}

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    await requireSession();
    await rateLimit(request, "submit");
    const parsed = signingSchema.safeParse(await readJson(request, 300_000));
    if (!parsed.success) return json({ error: "Please confirm all required details, draw your signature, and accept the signing consent.", fields: parsed.error.flatten().fieldErrors }, 400);
    const pdf = await verifiedPdf();
    // A retry after a lost response returns the committed record. It never replaces it.
    const existing = await getExecution();
    if (existing) return json({ receipt: existing });
    const data = parsed.data;
    const { error } = await getSupabaseAdmin()!.from("studio_document_executions").insert({
      id: randomUUID(), document_id: LEORA_DOCUMENT.id, document_version: LEORA_DOCUMENT.version,
      document_reference: LEORA_DOCUMENT.reference, document_hash: LEORA_DOCUMENT.sha256,
      issued_pdf_base64: pdf.toString("base64"),
      signatory_name: data.name, business: data.business, address: data.address,
      signing_as: data.signingAs, entity_name: data.signingAs === "company" ? data.entityName : null,
      registration_number: data.signingAs === "company" ? data.registrationNumber : null,
      capacity: data.capacity || "Individual / trading as LeOra Group",
      signature: data.signature, signature_format: "normalized-strokes-v1",
      signature_hash: createHash("sha256").update(JSON.stringify(data.signature)).digest("hex"),
      consent: true, consent_text: SIGNING_CONSENT, consent_version: CONSENT_VERSION,
      authentication_method: "separately-issued-signing-code",
    });
    // The unique document/version constraint handles simultaneous submissions atomically.
    if (error && error.code !== "23505") throw new Error("Execution insert failed");
    const receipt = await getExecution();
    if (!receipt) throw new Error("Execution could not be confirmed");
    return json({ receipt }, error ? 200 : 201);
  } catch (error) { return errorResponse(error); }
}
