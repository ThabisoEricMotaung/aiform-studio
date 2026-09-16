import { cookies } from "next/headers";
import { z } from "zod";
import { createSession, errorResponse, getExecution, json, rateLimit, readJson, requireSameOrigin, SESSION_COOKIE, SigningError, validSigningCode, verifiedPdf } from "@/lib/leora-signing-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    await rateLimit(request, "unlock");
    const parsed = z.object({ code: z.string().trim().min(32).max(128) }).strict().safeParse(await readJson(request, 1024));
    if (!parsed.success || !validSigningCode(parsed.data.code)) throw new SigningError("The signing code is invalid or has expired.", 401);
    await verifiedPdf();
    await getExecution(); // Do not open a session if the execution schema is unavailable.
    const session = createSession();
    (await cookies()).set(SESSION_COOKIE, session.value, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
      path: "/api/documents/leora-group/nda", expires: new Date(session.until),
    });
    return json({ ok: true });
  } catch (error) { return errorResponse(error); }
}
