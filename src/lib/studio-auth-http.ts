import "server-only";
import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { StudioAuthError, STUDIO_PRIVATE_HEADERS, studioAuthConfig } from "@/lib/studio-auth-config";

export function authJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: STUDIO_PRIVATE_HEADERS });
}
export function authError(error: unknown) {
  return error instanceof StudioAuthError
    ? authJson({ error: error.message }, error.status)
    : authJson({ error: "Studio access is temporarily unavailable. Please try again." }, 503);
}
export function requireStudioOrigin(request: Request) {
  if (request.headers.get("origin") !== studioAuthConfig().origin || request.headers.get("sec-fetch-site") === "cross-site") {
    throw new StudioAuthError(403, "Please use the Studio login page.");
  }
}
export async function readAuthJson(request: Request) {
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") throw new StudioAuthError(415, "Expected a JSON request.");
  if (!request.body) throw new StudioAuthError(400, "Please check the form and try again.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 2048) { await reader.cancel(); throw new StudioAuthError(413, "Request too large."); }
    chunks.push(value);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown; }
  catch { throw new StudioAuthError(400, "Please check the form and try again."); }
}
export async function limitStudioAuth(request: Request, scope: "request" | "verify", account = false) {
  const admin = getSupabaseAdmin();
  const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!admin || !secret) throw new StudioAuthError(503, "Studio access is temporarily unavailable.");
  // Vercel overwrites x-vercel-forwarded-for. Other deployments use one shared
  // bucket until a trusted ingress is configured; never trust client-supplied XFF.
  const identity = account ? studioAuthConfig().adminId
    : process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "unknown" : "non-vercel";
  const key = createHmac("sha256", secret).update(`studio-auth-v1:${scope}:${account ? "account" : "ip"}:${identity}`).digest("hex");
  const { data, error } = await admin.rpc("studio_signing_rate_limit", { p_key: key, p_limit: scope === "request" ? 5 : 10 });
  if (error) throw new StudioAuthError(503, "Studio access is temporarily unavailable.");
  if (data !== true) throw new StudioAuthError(429, "Too many attempts. Please wait 15 minutes before trying again.");
}
