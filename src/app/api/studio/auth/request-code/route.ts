import { z } from "zod";
import { createStudioClient } from "@/lib/supabase/server";
import { studioAuthConfig } from "@/lib/studio-auth-config";
import { authError, authJson, limitStudioAuth, readAuthJson, requireStudioOrigin } from "@/lib/studio-auth-http";

export async function POST(request: Request) {
  try {
    requireStudioOrigin(request);
    await limitStudioAuth(request, "request");
    const parsed = z.object({ email: z.string().trim().email().max(254) }).strict().safeParse(await readAuthJson(request));
    if (!parsed.success) return authJson({ error: "Enter a valid email address." }, 400);
    // Same response for other addresses: no account enumeration, no email sent.
    if (parsed.data.email.toLowerCase() === studioAuthConfig().email) {
      await limitStudioAuth(request, "request", true);
      const client = await createStudioClient(true);
      const { error } = await client.auth.signInWithOtp({ email: studioAuthConfig().email, options: { shouldCreateUser: false } });
      if (error) return authJson({ error: "Unable to send an access code. Please wait a minute and try again." }, 503);
    }
    return authJson({ ok: true });
  } catch (error) { return authError(error); }
}
