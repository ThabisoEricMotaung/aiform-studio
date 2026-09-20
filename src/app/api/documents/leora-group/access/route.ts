import { cookies } from "next/headers";
import { z } from "zod";
import {
  ACCESS_COOKIE, ACCESS_COOKIE_PATH, createAccessSession, errorResponse, json,
  LeoraAccessError, rateLimit, readJson, requireSameOrigin, validAccessCode,
} from "@/lib/leora-access";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    await rateLimit(request, "unlock");
    const parsed = z.object({ code: z.string().trim().min(32).max(128) }).strict().safeParse(await readJson(request, 1024));
    if (!parsed.success || !validAccessCode(parsed.data.code)) throw new LeoraAccessError("The access code is invalid or has expired.", 401);
    const session = createAccessSession();
    (await cookies()).set(ACCESS_COOKIE, session.value, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
      path: ACCESS_COOKIE_PATH, expires: new Date(session.until),
    });
    return json({ ok: true });
  } catch (error) { return errorResponse(error); }
}
