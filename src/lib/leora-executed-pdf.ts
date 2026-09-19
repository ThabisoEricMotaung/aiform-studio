import "server-only";
import { PDFDocument, StandardFonts, rgb, type PDFPage, type RGB } from "pdf-lib";
import type { SignatureStrokes } from "./leora-document";
import { LEORA_DOCUMENT } from "./leora-document";
import { verifiedPdf } from "./leora-signing-server";
import { getSupabaseAdmin } from "./supabase-admin";

/**
 * Renders normalized signature strokes as vector line segments inside a box
 * on the page, so the certificate never rasterizes or re-hosts the signature
 * image anywhere — it is drawn directly from the stored stroke evidence.
 */
function drawSignature(page: PDFPage, strokes: SignatureStrokes, box: { x: number; y: number; width: number; height: number }, color: RGB) {
  for (const stroke of strokes) {
    for (let i = 1; i < stroke.length; i++) {
      const a = stroke[i - 1];
      const b = stroke[i];
      page.drawLine({
        start: { x: box.x + a.x * box.width, y: box.y + (1 - a.y) * box.height },
        end: { x: box.x + b.x * box.width, y: box.y + (1 - b.y) * box.height },
        thickness: 1.3,
        color,
      });
    }
  }
}

function formatTimestamp(iso: string) {
  return `${new Intl.DateTimeFormat("en-ZA", { dateStyle: "long", timeStyle: "short", timeZone: "Africa/Johannesburg" }).format(new Date(iso))} SAST (UTC+02:00)`;
}

export type ExecutedPdfParty = {
  name: string;
  capacity: string;
  signedAt: string;
  signature: SignatureStrokes;
};

/**
 * Derives the fully executed PDF from the immutable issued document plus the
 * two stored evidence records. Never mutates the original bytes on disk;
 * this is computed fresh on each authenticated request, never persisted to
 * a public path or storage bucket.
 */
export async function buildExecutedPdf(originalPdfBytes: Buffer, signatory: ExecutedPdfParty, countersignatory: ExecutedPdfParty): Promise<Uint8Array> {
  const doc = await PDFDocument.load(originalPdfBytes, { updateMetadata: false });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const ink = rgb(0.09, 0.23, 0.17);
  const muted = rgb(0.42, 0.42, 0.4);

  const page = doc.addPage([595.28, 841.89]); // A4
  const left = 56;
  let y = 780;

  page.drawText("Execution certificate", { x: left, y, size: 18, font: bold, color: ink });
  y -= 22;
  page.drawText("Appended to the immutable issued agreement below. This certificate does not alter the agreement text.", { x: left, y, size: 9, font, color: muted, maxWidth: 480 });
  y -= 28;
  for (const line of [
    `Document reference: ${LEORA_DOCUMENT.reference}`,
    `Document version: ${LEORA_DOCUMENT.version}`,
    `Issued document SHA-256: ${LEORA_DOCUMENT.sha256}`,
  ]) {
    page.drawText(line, { x: left, y, size: 9, font, color: muted });
    y -= 14;
  }

  const blockWidth = 483;
  for (const [heading, party] of [["Client signature", signatory], ["AiForm Studio countersignature", countersignatory]] as const) {
    y -= 26;
    page.drawText(heading, { x: left, y, size: 12, font: bold, color: ink });
    y -= 18;
    page.drawText(`${party.name} — ${party.capacity}`, { x: left, y, size: 10, font, color: ink });
    y -= 14;
    page.drawText(`Signed: ${formatTimestamp(party.signedAt)}`, { x: left, y, size: 9, font, color: muted });
    y -= 10;
    const boxHeight = 70;
    page.drawRectangle({ x: left, y: y - boxHeight, width: blockWidth, height: boxHeight, borderColor: muted, borderWidth: 0.75 });
    drawSignature(page, party.signature, { x: left + 6, y: y - boxHeight + 6, width: blockWidth - 12, height: boxHeight - 12 }, ink);
    y -= boxHeight;
  }

  y -= 30;
  page.drawText("This certificate is derived from append-only execution and countersignature evidence recorded by AiForm Studio.", { x: left, y, size: 8, font, color: muted, maxWidth: blockWidth });

  return doc.save();
}

/**
 * Loads both evidence rows and derives the fully executed PDF fresh on each
 * call. Returns null when the countersignature does not exist yet — callers
 * must not fabricate a result. Both the Neo-gated and Studio-gated routes
 * call this same function after performing their own, separate auth check.
 */
export async function loadFullyExecutedPdf(): Promise<Uint8Array | null> {
  const admin = getSupabaseAdmin();
  if (!admin) return null;
  const { data: execution, error } = await admin.from("studio_document_executions")
    .select("id, signatory_name, capacity, signed_at, signature, document_hash")
    .eq("document_id", LEORA_DOCUMENT.id).eq("document_version", LEORA_DOCUMENT.version).maybeSingle();
  if (error) throw new Error("Execution lookup unavailable");
  if (!execution || execution.document_hash !== LEORA_DOCUMENT.sha256) return null;
  const { data: countersignature, error: counterError } = await admin.from("studio_document_countersignatures")
    .select("signatory_name, capacity, signed_at, signature")
    .eq("execution_id", execution.id).maybeSingle();
  if (counterError) throw new Error("Countersignature lookup unavailable");
  if (!countersignature) return null;
  const originalPdfBytes = await verifiedPdf();
  return buildExecutedPdf(originalPdfBytes,
    { name: execution.signatory_name, capacity: execution.capacity, signedAt: execution.signed_at, signature: execution.signature },
    { name: countersignature.signatory_name, capacity: countersignature.capacity, signedAt: countersignature.signed_at, signature: countersignature.signature });
}
