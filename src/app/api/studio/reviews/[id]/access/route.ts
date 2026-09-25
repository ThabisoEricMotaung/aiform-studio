import { z } from "zod";
import { requireStudioAdmin } from "@/lib/studio-auth";
import { authError, authJson, readAuthJson, requireStudioOrigin } from "@/lib/studio-auth-http";
import { createStudioClient } from "@/lib/supabase/server";
import { issueReviewAccessCode, ReviewAccessError, revokeReviewAccess } from "@/lib/review-access";

export const runtime = "nodejs";

const body = z.discriminatedUnion("action", [
  z.object({ action: z.literal("reset"), expiresInDays: z.union([z.literal(30), z.literal(90), z.literal(365), z.null()]) }).strict(),
  z.object({ action: z.literal("revoke") }).strict(),
]);

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireStudioOrigin(request);
    await requireStudioAdmin(await createStudioClient(true));
    const id = z.string().uuid().safeParse((await params).id);
    const parsed = body.safeParse(await readAuthJson(request));
    if (!id.success || !parsed.success) return authJson({ error: "Invalid request." }, 400);
    // The plaintext code appears only in this response; it is never persisted or logged.
    return authJson(parsed.data.action === "reset"
      ? await issueReviewAccessCode(id.data, parsed.data.expiresInDays)
      : await revokeReviewAccess(id.data));
  } catch (error) {
    if (error instanceof ReviewAccessError) return authJson({ error: error.message }, error.status);
    return authError(error);
  }
}
