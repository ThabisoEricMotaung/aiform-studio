import { errorResponse, PRIVATE_HEADERS, requireSession, verifiedPdf } from "@/lib/leora-signing-server";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireSession();
    const bytes = await verifiedPdf();
    return new Response(new Uint8Array(bytes), { headers: {
      ...PRIVATE_HEADERS, "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="AiForm-Studio-LeOra-Group-Mutual-NDA.pdf"',
    } });
  } catch (error) { return errorResponse(error); }
}
