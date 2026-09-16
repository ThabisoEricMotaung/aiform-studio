import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "./supabase-admin";
import { LEORA_DOCUMENT, type ExecutionReceipt } from "./leora-document";

export const SESSION_COOKIE = "leora-signing-session";
export const PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
};
export class SigningError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: PRIVATE_HEADERS });
}
export function errorResponse(error: unknown) {
  if (error instanceof SigningError) return json({ error: error.message }, error.status);
  // Never log request bodies, signatures, cookies, or database error details.
  console.error("[leora-signing] Request failed; no execution confirmation issued.");
  return json({ error: "We could not confirm this request. Your agreement has not been confirmed as signed. Please try again; an existing signature will not be overwritten." }, 503);
}
export function signingConfig() {
  const codeHash = process.env.LEORA_SIGNING_CODE_SHA256 ?? "";
  const secret = process.env.DOCUMENT_SIGNING_SESSION_SECRET ?? "";
  const expires = Date.parse(process.env.LEORA_SIGNING_EXPIRES_AT ?? "");
  if (process.env.LEORA_SIGNING_ENABLED !== "true" || !/^[a-f0-9]{64}$/.test(codeHash)
      || secret.length < 32 || !Number.isFinite(expires) || expires <= Date.now() || !getSupabaseAdmin()) {
    throw new SigningError("Electronic signing is not available yet. You can still review or download the issued agreement. Please contact AiForm Studio to arrange signing.", 503);
  }
  return { codeHash, secret, expires };
}
export async function verifiedPdf() {
  const bytes = await readFile(path.join(process.cwd(), "public", LEORA_DOCUMENT.pdfPath));
  if (createHash("sha256").update(bytes).digest("hex") !== LEORA_DOCUMENT.sha256) {
    throw new SigningError("The issued document could not be verified. Signing is paused; please contact AiForm Studio.", 409);
  }
  return bytes;
}
function equal(a: string, b: string) {
  return a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
export function validSigningCode(code: string) {
  return equal(createHash("sha256").update(code).digest("hex"), signingConfig().codeHash);
}
export function createSession() {
  const { secret, codeHash, expires } = signingConfig();
  const until = Math.min(Date.now() + 60 * 60 * 1000, expires);
  const payload = `${until}.${codeHash}`;
  return { value: `${until}.${createHmac("sha256", secret).update(payload).digest("hex")}`, until };
}
export async function requireSession() {
  const { secret, codeHash, expires } = signingConfig();
  const value = (await cookies()).get(SESSION_COOKIE)?.value ?? "";
  const [until, mac] = value.split(".");
  if (!/^\d{13}$/.test(until ?? "") || !/^[a-f0-9]{64}$/.test(mac ?? "") || Number(until) <= Date.now()
    || Number(until) > expires || !equal(mac, createHmac("sha256", secret).update(`${until}.${codeHash}`).digest("hex"))) {
    throw new SigningError("Please enter your signing code to continue. Your session may have expired.", 401);
  }
}
export function requireSameOrigin(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin
    || request.headers.get("sec-fetch-site") === "cross-site") {
    throw new SigningError("This request must be made from the signing page.", 403);
  }
}
export async function readJson(request: Request, limit: number): Promise<unknown> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new SigningError("Expected a JSON request.", 415);
  if (!request.body) throw new SigningError("Missing request body.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) { await reader.cancel(); throw new SigningError("The signature is too large. Please clear it and try again.", 413); }
    chunks.push(value);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw new SigningError("Invalid request body."); }
}
export async function rateLimit(request: Request, scope: "unlock" | "submit") {
  const { secret } = signingConfig();
  const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = createHmac("sha256", secret).update(`${scope}:${ip}`).digest("hex");
  const { data, error } = await getSupabaseAdmin()!.rpc("studio_signing_rate_limit", { p_key: key, p_limit: scope === "unlock" ? 5 : 10 });
  if (error) throw new Error("Rate limiter unavailable");
  if (data !== true) throw new SigningError("Too many attempts. Please wait 15 minutes before trying again.", 429);
}
export async function getExecution() {
  const { data, error } = await getSupabaseAdmin()!.from("studio_document_executions")
    .select("id, signatory_name, signed_at, document_hash")
    .eq("document_id", LEORA_DOCUMENT.id).eq("document_version", LEORA_DOCUMENT.version).maybeSingle();
  if (error) throw new Error("Execution lookup unavailable");
  if (!data) return null;
  if (data.document_hash !== LEORA_DOCUMENT.sha256) throw new Error("Execution version mismatch");
  const { data: counter, error: counterError } = await getSupabaseAdmin()!.from("studio_document_countersignatures")
    .select("id").eq("execution_id", data.id).maybeSingle();
  if (counterError) throw new Error("Countersignature lookup unavailable");
  return {
    id: data.id, signatory: data.signatory_name, signedAt: data.signed_at,
    reference: LEORA_DOCUMENT.reference, sha256: data.document_hash,
    status: counter ? "fully_executed" : "awaiting_countersignature",
  } satisfies ExecutionReceipt;
}
