import { errorResponse, json, PRIVATE_HEADERS, requireSession } from "@/lib/leora-signing-server";
import { loadFullyExecutedPdf } from "@/lib/leora-executed-pdf";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireSession();
    const bytes = await loadFullyExecutedPdf();
    if (!bytes) return json({ error: "This agreement is not fully executed yet." }, 409);
    return new Response(new Uint8Array(bytes), { headers: {
      ...PRIVATE_HEADERS, "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="AiForm-Studio-LeOra-Group-Mutual-NDA-fully-executed.pdf"',
    } });
  } catch (error) { return errorResponse(error); }
}
