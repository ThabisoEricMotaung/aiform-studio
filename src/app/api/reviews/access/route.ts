import { cookies } from "next/headers";
import { z } from "zod";
import {
  rateLimitUnlock, readJson, requireSameOrigin, reviewErrorResponse, reviewJson, reviewSessionCookie, unlockReviewAccess,
} from "@/lib/review-access";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    await rateLimitUnlock(request);
    // Shape only; format checks happen inside unlockReviewAccess so every bad input gets the same generic answer.
    const parsed = z.object({ reference: z.string().max(64), code: z.string().max(64) }).strict().safeParse(await readJson(request, 1024));
    const { reference, destination, session } = await unlockReviewAccess(parsed.data?.reference, parsed.data?.code);
    (await cookies()).set(reviewSessionCookie(reference, session));
    return reviewJson({ ok: true, next: destination });
  } catch (error) { return reviewErrorResponse(error); }
}
