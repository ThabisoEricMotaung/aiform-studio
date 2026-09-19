import { cookies } from "next/headers";
import { z } from "zod";
import { errorResponse, json, readJson, requireSameOrigin, SigningError, verifiedPdf } from "@/lib/leora-signing-server";
import { createStudioSession, getExecutionForCountersign, STUDIO_SESSION_COOKIE, studioRateLimit, validStudioCode } from "@/lib/studio-countersign-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    await studioRateLimit(request, "unlock");
    const parsed = z.object({ code: z.string().trim().min(32).max(128) }).strict().safeParse(await readJson(request, 1024));
    if (!parsed.success || !validStudioCode(parsed.data.code)) throw new SigningError("The Studio countersigning code is invalid.", 401);
    await verifiedPdf();
    await getExecutionForCountersign(); // Do not open a session if the evidence schema is unavailable.
    const session = createStudioSession();
    (await cookies()).set(STUDIO_SESSION_COOKIE, session.value, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
      path: "/api/documents/leora-group/nda/countersign", expires: new Date(session.until),
    });
    return json({ ok: true });
  } catch (error) { return errorResponse(error); }
}
