import { LEORA_DOCUMENT } from "@/lib/leora-document";
import { errorResponse, getExecution, json, PRIVATE_HEADERS, requireSession } from "@/lib/leora-signing-server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireSession();
    const receipt = await getExecution();
    if (!receipt) return json({ error: "No execution record exists yet." }, 404);
    const { data, error } = await getSupabaseAdmin()!.from("studio_document_executions").select("*").eq("id", receipt.id).single();
    if (error) throw new Error("Record unavailable");
    const { data: countersignature, error: counterError } = await getSupabaseAdmin()!.from("studio_document_countersignatures").select("*").eq("execution_id", receipt.id).maybeSingle();
    if (counterError) throw new Error("Countersignature unavailable");
    return new Response(JSON.stringify({
      format: "aiform-execution-record-v1", status: receipt.status,
      note: "This execution record includes the unchanged issued PDF as base64 and the separately recorded electronic signature. It is not a signed PDF.",
      execution: data, countersignature,
    }, null, 2), { headers: {
      ...PRIVATE_HEADERS, "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${LEORA_DOCUMENT.reference}-execution.json"`,
    } });
  } catch (error) { return errorResponse(error); }
}
