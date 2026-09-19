import { z } from "zod";
import { clearStudioCookies, createStudioClient } from "@/lib/supabase/server";
import { requireStudioAdmin } from "@/lib/studio-auth";
import { studioAuthConfig } from "@/lib/studio-auth-config";
import { authError, authJson, limitStudioAuth, readAuthJson, requireStudioOrigin } from "@/lib/studio-auth-http";

export async function POST(request: Request) {
  try {
    requireStudioOrigin(request);
    await limitStudioAuth(request, "verify");
    const parsed = z.object({ email: z.string().trim().email().max(254), token: z.string().regex(/^\d{6}$/) }).strict().safeParse(await readAuthJson(request));
    if (!parsed.success) return authJson({ error: "Enter your email and six-digit access code." }, 400);
    if (parsed.data.email.toLowerCase() !== studioAuthConfig().email) return authJson({ error: "The access code is invalid or expired." }, 401);
    await limitStudioAuth(request, "verify", true);
    const client = await createStudioClient(true);
    const { error } = await client.auth.verifyOtp({ email: studioAuthConfig().email, token: parsed.data.token, type: "email" });
    if (error) return authJson({ error: "The access code is invalid or expired." }, 401);
    try { await requireStudioAdmin(client); }
    catch (error) {
      try { await client.auth.signOut({ scope: "local" }); }
      finally { await clearStudioCookies(); }
      throw error;
    }
    return authJson({ ok: true });
  } catch (error) { return authError(error); }
}
