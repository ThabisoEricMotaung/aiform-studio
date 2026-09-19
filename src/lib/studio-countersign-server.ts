import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "./supabase-admin";
import { SigningError } from "./leora-signing-server";
import { LEORA_DOCUMENT } from "./leora-document";

/**
 * Studio-only countersigning session. Entirely separate from Neo's signing
 * session: its own cookie name, its own code/secret, and its own route scope
 * (`/api/documents/leora-group/nda/countersign*`). Neo's signing code/session
 * cannot satisfy this check, and this session cannot satisfy Neo's.
 */
export const STUDIO_SESSION_COOKIE = "studio-countersign-session";
const SESSION_TTL_MS = 30 * 60 * 1000;

function equal(a: string, b: string) {
  return a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export function studioCountersignConfig() {
  const codeHash = process.env.STUDIO_COUNTERSIGN_CODE_SHA256 ?? "";
  const secret = process.env.STUDIO_COUNTERSIGN_SESSION_SECRET ?? "";
  if (process.env.STUDIO_COUNTERSIGN_ENABLED !== "true" || !/^[a-f0-9]{64}$/.test(codeHash)
      || secret.length < 32 || !getSupabaseAdmin()) {
    throw new SigningError("Studio countersigning is not available.", 503);
  }
  return { codeHash, secret };
}

export function validStudioCode(code: string) {
  return equal(createHash("sha256").update(code).digest("hex"), studioCountersignConfig().codeHash);
}

export function createStudioSession() {
  const { secret, codeHash } = studioCountersignConfig();
  const until = Date.now() + SESSION_TTL_MS;
  const payload = `${until}.${codeHash}`;
  return { value: `${until}.${createHmac("sha256", secret).update(payload).digest("hex")}`, until };
}

export async function requireStudioSession() {
  const { secret, codeHash } = studioCountersignConfig();
  const value = (await cookies()).get(STUDIO_SESSION_COOKIE)?.value ?? "";
  const [until, mac] = value.split(".");
  if (!/^\d{13}$/.test(until ?? "") || !/^[a-f0-9]{64}$/.test(mac ?? "") || Number(until) <= Date.now()
    || !equal(mac, createHmac("sha256", secret).update(`${until}.${codeHash}`).digest("hex"))) {
    throw new SigningError("Please enter the Studio countersigning code to continue. Your session may have expired.", 401);
  }
}

export async function studioRateLimit(request: Request, scope: "unlock" | "submit") {
  const { secret } = studioCountersignConfig();
  const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = createHmac("sha256", secret).update(`studio-countersign-${scope}:${ip}`).digest("hex");
  const { data, error } = await getSupabaseAdmin()!.rpc("studio_signing_rate_limit", { p_key: key, p_limit: scope === "unlock" ? 5 : 10 });
  if (error) throw new Error("Rate limiter unavailable");
  if (data !== true) throw new SigningError("Too many attempts. Please wait 15 minutes before trying again.", 429);
}

export type ExecutionForCountersign = {
  id: string;
  signatoryName: string;
  business: string;
  signingAs: string;
  entityName: string | null;
  registrationNumber: string | null;
  capacity: string;
  signedAt: string;
  documentHash: string;
  alreadyCountersigned: boolean;
};

/** Read-only lookup for Studio review; never writes, never touches Neo's session. */
export async function getExecutionForCountersign(): Promise<ExecutionForCountersign | null> {
  const { data, error } = await getSupabaseAdmin()!.from("studio_document_executions")
    .select("id, signatory_name, business, signing_as, entity_name, registration_number, capacity, signed_at, document_hash")
    .eq("document_id", LEORA_DOCUMENT.id).eq("document_version", LEORA_DOCUMENT.version).maybeSingle();
  if (error) throw new Error("Execution lookup unavailable");
  if (!data) return null;
  if (data.document_hash !== LEORA_DOCUMENT.sha256) throw new Error("Execution version mismatch");
  const { data: counter, error: counterError } = await getSupabaseAdmin()!.from("studio_document_countersignatures")
    .select("id").eq("execution_id", data.id).maybeSingle();
  if (counterError) throw new Error("Countersignature lookup unavailable");
  return {
    id: data.id, signatoryName: data.signatory_name, business: data.business,
    signingAs: data.signing_as, entityName: data.entity_name, registrationNumber: data.registration_number,
    capacity: data.capacity, signedAt: data.signed_at, documentHash: data.document_hash,
    alreadyCountersigned: Boolean(counter),
  };
}
