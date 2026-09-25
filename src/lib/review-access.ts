import "server-only";
import { createHmac, randomBytes, randomInt, scrypt, timingSafeEqual } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "./supabase-admin";
import { getPublicProductReview } from "./public-product-review";
import { getPlainLanguageProductReview } from "./plain-language-product-review";
import { requireStudioAdmin } from "./studio-auth";

/**
 * Client access to issued Product Reviews (/reviews). One credential per
 * review, stored only as a salted scrypt hash in studio_review_client_access.
 * A successful unlock issues an HMAC-signed cookie whose Path is that
 * review's own report prefix and whose MAC binds the review, the credential
 * row and the current code hash — so it cannot open another review, and a
 * reset or revocation invalidates it on the next request. Self-contained by
 * design: it neither satisfies nor is satisfied by LeOra, NDA signing or
 * countersigning sessions. Studio admin authentication is accepted as an
 * alternative on report pages only, via requireStudioAdmin().
 */
export const REVIEW_ACCESS_COOKIE = "aiform-review-access";
export const REVIEW_PORTAL_PATH = "/reviews";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"; // No 0/O, 1/I/L: readable aloud and on paper.
const CODE_LENGTH = 16; // 16 × log2(31) ≈ 79 bits.
const SCRYPT = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const HASH_PATTERN = /^scrypt\$16384\$8\$1\$([A-Za-z0-9_-]{22})\$([A-Za-z0-9_-]{43})$/;
const INVALID_CREDENTIALS = "The review reference or access code is not valid.";

export const REVIEW_PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
};

export class ReviewAccessError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

export type ReviewAccessStatus = "none" | "active" | "expired" | "revoked";
export type ReviewAccessState = { status: ReviewAccessStatus; expiresAt: string | null; lastAccessedAt: string | null; updatedAt: string | null };
type AccessRow = { id: string; review_id: string; code_hash: string; is_active: boolean; expires_at: string | null; last_accessed_at: string | null; updated_at: string };
type AccessRecord = { reviewId: string; reference: string; access: AccessRow };

function equal(a: string, b: string) {
  return a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

function admin() {
  const client = getSupabaseAdmin();
  if (!client) throw new ReviewAccessError("Review access is not available yet.", 503);
  return client;
}

function sessionSecret() {
  const secret = process.env.REVIEW_ACCESS_SESSION_SECRET ?? "";
  if (secret.length < 32) throw new ReviewAccessError("Review access is not available yet.", 503);
  return secret;
}

export function normalizeReference(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim().toUpperCase();
  return /^[A-Z0-9][A-Z0-9-]{0,39}$/.test(value) ? value : null;
}

export function reviewCookiePath(reference: string) {
  return `${REVIEW_PORTAL_PATH}/${reference}`;
}

export function generateAccessCode() {
  const chars = Array.from({ length: CODE_LENGTH }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]);
  return chars.join("").match(/.{4}/g)!.join("-");
}

/** Accepts the code as displayed, typed in lowercase, or without separators. */
export function normalizeAccessCode(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.length > 64) return null;
  const value = raw.toUpperCase().replace(/[\s-]/g, "");
  return value.length === CODE_LENGTH && [...value].every(char => CODE_ALPHABET.includes(char)) ? value : null;
}

function derive(code: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => scrypt(code, salt, 32, SCRYPT, (error, key) => error ? reject(error) : resolve(key)));
}

export async function hashAccessCode(code: string) {
  const normalized = normalizeAccessCode(code);
  if (!normalized) throw new Error("Invalid access code format.");
  const salt = randomBytes(16);
  return `scrypt$16384$8$1$${salt.toString("base64url")}$${(await derive(normalized, salt)).toString("base64url")}`;
}

export async function verifyAccessCode(code: string, stored: string) {
  const match = HASH_PATTERN.exec(stored);
  if (!match) return false;
  const actual = await derive(code, Buffer.from(match[1], "base64url"));
  const expected = Buffer.from(match[2], "base64url");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// Spent when a reference is unknown, so response timing matches a real check.
let decoyHash: Promise<string> | undefined;
function decoy() { return decoyHash ??= hashAccessCode(generateAccessCode()); }

function usable(access: AccessRow, now = Date.now()) {
  return access.is_active && (!access.expires_at || new Date(access.expires_at).getTime() > now);
}

function stateOf(access: AccessRow | null | undefined): ReviewAccessState {
  if (!access) return { status: "none", expiresAt: null, lastAccessedAt: null, updatedAt: null };
  const status = !access.is_active ? "revoked" : usable(access) ? "active" : "expired";
  // Deliberately omits code_hash and row identifiers.
  return { status, expiresAt: access.expires_at, lastAccessedAt: access.last_accessed_at, updatedAt: access.updated_at };
}

async function loadByReference(reference: string): Promise<AccessRecord | null> {
  const db = admin();
  const { data: review, error } = await db.from("studio_reviews").select("id, reference").eq("reference", reference).maybeSingle();
  if (error) throw new Error("Unable to check review access.");
  if (!review) return null;
  const { data: access, error: accessError } = await db.from("studio_review_client_access")
    .select("id, review_id, code_hash, is_active, expires_at, last_accessed_at, updated_at").eq("review_id", review.id).maybeSingle();
  if (accessError) throw new Error("Unable to check review access.");
  return access ? { reviewId: review.id as string, reference: review.reference as string, access: access as AccessRow } : null;
}

function sessionMac(secret: string, record: AccessRecord, until: string) {
  return createHmac("sha256", secret)
    .update(`review-access-v1\n${record.reviewId}\n${record.access.id}\n${until}\n${record.access.code_hash}`).digest("hex");
}

function createSession(secret: string, record: AccessRecord) {
  const expiry = record.access.expires_at ? new Date(record.access.expires_at).getTime() : Infinity;
  const until = String(Math.min(Date.now() + SESSION_TTL_MS, expiry));
  return { value: `${until}.${sessionMac(secret, record, until)}`, until: Number(until) };
}

export function reviewSessionCookie(reference: string, session: { value: string; until: number }) {
  return {
    name: REVIEW_ACCESS_COOKIE, value: session.value, httpOnly: true, secure: process.env.NODE_ENV === "production",
    // Lax, not Strict: a client opening an emailed report link must keep their session.
    // The cookie only authorizes GET page reads; the unlock route is same-origin checked.
    sameSite: "lax" as const, path: reviewCookiePath(reference), expires: new Date(session.until),
  };
}

/** Verifies reference + code. Every failure is the same generic 401. */
export async function unlockReviewAccess(rawReference: unknown, rawCode: unknown) {
  const secret = sessionSecret();
  const reference = normalizeReference(rawReference);
  const code = normalizeAccessCode(rawCode);
  const record = reference && code ? await loadByReference(reference) : null;
  const matches = await verifyAccessCode(code ?? "", record?.access.code_hash ?? await decoy());
  if (!record || !matches || !usable(record.access) || !(await getPublicProductReview(record.reference))) {
    throw new ReviewAccessError(INVALID_CREDENTIALS, 401);
  }
  const { error } = await admin().from("studio_review_client_access")
    .update({ last_accessed_at: new Date().toISOString() }).eq("id", record.access.id);
  if (error) console.error("[review-access] Unable to record last access.");
  const base = reviewCookiePath(record.reference);
  const destination = await getPlainLanguageProductReview(record.reference) ? `${base}/plain-language` : base;
  return { reference: record.reference, destination, session: createSession(secret, record) };
}

async function hasClientSession(reference: string) {
  const value = (await cookies()).get(REVIEW_ACCESS_COOKIE)?.value ?? "";
  const [until, mac] = value.split(".");
  if (!/^\d{13}$/.test(until ?? "") || !/^[a-f0-9]{64}$/.test(mac ?? "") || Number(until) <= Date.now()) return false;
  try {
    const secret = sessionSecret();
    const record = await loadByReference(reference);
    return !!record && usable(record.access) && equal(mac, sessionMac(secret, record, until));
  } catch { return false; }
}

async function hasStudioAccess() {
  try { await requireStudioAdmin(); return true; }
  catch { return false; }
}

/** A client session for this exact review, or a verified Studio administrator. */
export const hasReviewReportAccess = cache(async (reference: string) => {
  const normalized = normalizeReference(reference);
  if (normalized === reference && await hasClientSession(normalized)) return true;
  return hasStudioAccess();
});

/**
 * Report page guard. Runs before any report lookup so that known and unknown
 * references redirect identically; call from both generateMetadata and the page.
 */
export async function requireReviewReportAccess(reference: string) {
  if (!(await hasReviewReportAccess(reference))) redirect(REVIEW_PORTAL_PATH);
}

// Studio management. Every caller must have already passed requireStudioAdmin().

export async function getReviewAccessState(reviewId: string): Promise<ReviewAccessState> {
  const { data, error } = await admin().from("studio_review_client_access")
    .select("is_active, expires_at, last_accessed_at, updated_at").eq("review_id", reviewId).maybeSingle();
  if (error) throw new Error("Unable to load client access.");
  return stateOf(data as AccessRow | null);
}

export async function listReviewAccessStates(): Promise<Map<string, ReviewAccessStatus>> {
  const { data, error } = await admin().from("studio_review_client_access").select("review_id, is_active, expires_at");
  if (error) throw new Error("Unable to load client access.");
  return new Map((data ?? []).map(row => [row.review_id as string, stateOf(row as AccessRow).status]));
}

export async function isClientAccessEligible(reference: string) {
  return !!(await getPublicProductReview(reference));
}

async function studioReview(reviewId: string) {
  const { data, error } = await admin().from("studio_reviews").select("id, reference").eq("id", reviewId).maybeSingle();
  if (error) throw new Error("Unable to load this review.");
  if (!data) throw new ReviewAccessError("Review not found.", 404);
  return { id: data.id as string, reference: data.reference as string };
}

/** Generates or replaces the code. The plaintext is returned once and never stored. */
export async function issueReviewAccessCode(reviewId: string, expiresInDays: number | null) {
  const review = await studioReview(reviewId);
  if (!(await isClientAccessEligible(review.reference))) {
    throw new ReviewAccessError("Client access can only be issued for a completed review with an issued report.", 409);
  }
  const code = generateAccessCode();
  const { error } = await admin().from("studio_review_client_access").upsert({
    review_id: review.id, code_hash: await hashAccessCode(code), is_active: true,
    expires_at: expiresInDays ? new Date(Date.now() + expiresInDays * 86_400_000).toISOString() : null,
    last_accessed_at: null,
  }, { onConflict: "review_id" });
  if (error) throw new Error("Unable to save client access.");
  return { code, reference: review.reference, state: await getReviewAccessState(review.id) };
}

export async function revokeReviewAccess(reviewId: string) {
  const review = await studioReview(reviewId);
  const { error } = await admin().from("studio_review_client_access").update({ is_active: false }).eq("review_id", review.id);
  if (error) throw new Error("Unable to revoke client access.");
  return { state: await getReviewAccessState(review.id) };
}

// HTTP helpers for the public unlock route.

export function requireSameOrigin(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin || request.headers.get("sec-fetch-site") === "cross-site") {
    throw new ReviewAccessError("This request must be made from the review access page.", 403);
  }
}

export async function readJson(request: Request, limit: number): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") throw new ReviewAccessError("Expected a JSON request.", 415);
  if (!request.body) throw new ReviewAccessError("Missing request body.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) { await reader.cancel(); throw new ReviewAccessError("The request is too large.", 413); }
    chunks.push(value);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw new ReviewAccessError("Invalid request body."); }
}

/** Reuses the durable studio_signing_rate_limit RPC under its own key namespace. */
export async function rateLimitUnlock(request: Request) {
  const secret = sessionSecret();
  // As in studio-auth-http: only Vercel's overwritten header is trusted; other hosts share one bucket.
  const identity = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "unknown" : "non-vercel";
  const key = createHmac("sha256", secret).update(`review-access-v1:unlock:ip:${identity}`).digest("hex");
  const { data, error } = await admin().rpc("studio_signing_rate_limit", { p_key: key, p_limit: 10 });
  if (error) throw new ReviewAccessError("Review access is temporarily unavailable. Please try again.", 503);
  if (data !== true) throw new ReviewAccessError("Too many attempts. Please wait 15 minutes before trying again.", 429);
}

export function reviewJson(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: REVIEW_PRIVATE_HEADERS });
}

export function reviewErrorResponse(error: unknown) {
  if (error instanceof ReviewAccessError) return reviewJson({ error: error.message }, error.status);
  console.error("[review-access] Request failed; no session was granted.");
  return reviewJson({ error: "We could not confirm this request. Please try again." }, 503);
}
