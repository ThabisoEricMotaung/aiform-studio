import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "./supabase-admin";

/**
 * General LeOra private-document access. Grants view permission to LeOra's
 * private document area (Preliminary Scope and future LeOra documents). It
 * is deliberately independent from `leora-signing-server.ts`: its own cookie,
 * its own code/secret, its own route scope. It carries no signing,
 * countersigning, or database-write authority, and cannot satisfy — and is
 * not satisfied by — the NDA signing session, the Studio countersigning
 * session, or Studio admin authentication.
 */
export const ACCESS_COOKIE = "leora-access-session";
export const ACCESS_COOKIE_PATH = "/documents/leora-group";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
export const DEFAULT_LEORA_DESTINATION = "/documents/leora-group/preliminary-scope";
const NAMESPACE_PREFIX = "/documents/leora-group/";
const ACCESS_PAGE_PATH = "/documents/leora-group/access";

export const PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
};

export class LeoraAccessError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

function equal(a: string, b: string) {
  return a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export function leoraAccessConfig() {
  const codeHash = process.env.LEORA_ACCESS_CODE_SHA256 ?? "";
  const secret = process.env.LEORA_ACCESS_SESSION_SECRET ?? "";
  if (process.env.LEORA_ACCESS_ENABLED !== "true" || !/^[a-f0-9]{64}$/.test(codeHash)
      || secret.length < 32 || !getSupabaseAdmin()) {
    throw new LeoraAccessError("Access to LeOra private documents is not available yet.", 503);
  }
  return { codeHash, secret };
}

export function validAccessCode(code: string) {
  return equal(createHash("sha256").update(code).digest("hex"), leoraAccessConfig().codeHash);
}

export function createAccessSession() {
  const { secret, codeHash } = leoraAccessConfig();
  const until = Date.now() + SESSION_TTL_MS;
  const payload = `${until}.${codeHash}`;
  return { value: `${until}.${createHmac("sha256", secret).update(payload).digest("hex")}`, until };
}

/** Throwing primitive. Use directly from routes that need the raw error/status. */
export async function requireLeoraAccessSession() {
  const { secret, codeHash } = leoraAccessConfig();
  const value = (await cookies()).get(ACCESS_COOKIE)?.value ?? "";
  const [until, mac] = value.split(".");
  if (!/^\d{13}$/.test(until ?? "") || !/^[a-f0-9]{64}$/.test(mac ?? "") || Number(until) <= Date.now()
    || !equal(mac, createHmac("sha256", secret).update(`${until}.${codeHash}`).digest("hex"))) {
    throw new LeoraAccessError("Please enter your private access code to continue. Your session may have expired.", 401);
  }
}

/** Page guard: call at the top of a LeOra private document's server component. */
export async function requireLeoraAccess(returnTo: string) {
  try { await requireLeoraAccessSession(); }
  catch { redirect(`${ACCESS_PAGE_PATH}?next=${encodeURIComponent(returnTo)}`); }
}

export function requireSameOrigin(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin
    || request.headers.get("sec-fetch-site") === "cross-site") {
    throw new LeoraAccessError("This request must be made from the access page.", 403);
  }
}

export async function readJson(request: Request, limit: number): Promise<unknown> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new LeoraAccessError("Expected a JSON request.", 415);
  if (!request.body) throw new LeoraAccessError("Missing request body.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) { await reader.cancel(); throw new LeoraAccessError("The request is too large.", 413); }
    chunks.push(value);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw new LeoraAccessError("Invalid request body."); }
}

export async function rateLimit(request: Request, scope: "unlock") {
  const { secret } = leoraAccessConfig();
  const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = createHmac("sha256", secret).update(`leora-access-v1:${scope}:${ip}`).digest("hex");
  const { data, error } = await getSupabaseAdmin()!.rpc("studio_signing_rate_limit", { p_key: key, p_limit: 5 });
  if (error) throw new Error("Rate limiter unavailable");
  if (data !== true) throw new LeoraAccessError("Too many attempts. Please wait 15 minutes before trying again.", 429);
}

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: PRIVATE_HEADERS });
}

export function errorResponse(error: unknown) {
  if (error instanceof LeoraAccessError) return json({ error: error.message }, error.status);
  console.error("[leora-access] Request failed; no session was granted.");
  return json({ error: "We could not confirm this request. Please try again." }, 503);
}

/**
 * Resolves an untrusted `?next=` value to a safe in-namespace path, or a
 * fixed fallback destination. Parses against a fixed internal base so that
 * WHATWG URL parsing — which normalizes backslashes to slashes and collapses
 * `.`/`..` segments exactly as a browser would — does the escaping analysis
 * for us; any resulting origin change or path outside the LeOra document
 * namespace is rejected outright, never partially trusted.
 */
export function resolveLeoraNextPath(raw: string | null | undefined): string {
  if (!raw || raw.length > 2048) return DEFAULT_LEORA_DESTINATION;
  let url: URL;
  try { url = new URL(raw, "http://leora-access.internal"); }
  catch { return DEFAULT_LEORA_DESTINATION; }
  if (url.origin !== "http://leora-access.internal") return DEFAULT_LEORA_DESTINATION;
  const { pathname, search } = url;
  if (!pathname.startsWith(NAMESPACE_PREFIX) || pathname.includes("..") || pathname === ACCESS_PAGE_PATH) {
    return DEFAULT_LEORA_DESTINATION;
  }
  return pathname + search;
}
