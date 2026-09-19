import { errorResponse, json, PRIVATE_HEADERS } from "@/lib/leora-signing-server";
import { loadFullyExecutedPdf } from "@/lib/leora-executed-pdf";
import { requireStudioSession } from "@/lib/studio-countersign-server";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireStudioSession();
    const bytes = await loadFullyExecutedPdf();
    if (!bytes) return json({ error: "This agreement is not fully executed yet." }, 409);
    return new Response(new Uint8Array(bytes), { headers: {
      ...PRIVATE_HEADERS, "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="AiForm-Studio-LeOra-Group-Mutual-NDA-fully-executed.pdf"',
    } });
  } catch (error) { return errorResponse(error); }
}
