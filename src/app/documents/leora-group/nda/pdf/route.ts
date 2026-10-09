import {
  errorResponse as accessErrorResponse,
  LeoraAccessError,
  PRIVATE_HEADERS as ACCESS_PRIVATE_HEADERS,
  requireLeoraAccessSession,
} from "@/lib/leora-access";
import {
  errorResponse as signingErrorResponse,
  PRIVATE_HEADERS as SIGNING_PRIVATE_HEADERS,
  verifiedPdf,
} from "@/lib/leora-signing-server";

export const runtime = "nodejs";

const PDF_ROUTE = "/documents/leora-group/nda/pdf";
const ACCESS_ROUTE = "/documents/leora-group/access";

function redirectToAccess() {
  return new Response(null, {
    status: 307,
    headers: {
      ...ACCESS_PRIVATE_HEADERS,
      Location: `${ACCESS_ROUTE}?next=${encodeURIComponent(PDF_ROUTE)}`,
    },
  });
}

export async function GET() {
  try {
    await requireLeoraAccessSession();
    const bytes = await verifiedPdf();
    return new Response(new Uint8Array(bytes), {
      headers: {
        ...SIGNING_PRIVATE_HEADERS,
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="AiForm-Studio-LeOra-Group-Mutual-NDA.pdf"',
      },
    });
  } catch (error) {
    if (error instanceof LeoraAccessError) {
      if (error.status === 401) return redirectToAccess();
      return accessErrorResponse(error);
    }
    return signingErrorResponse(error);
  }
}
