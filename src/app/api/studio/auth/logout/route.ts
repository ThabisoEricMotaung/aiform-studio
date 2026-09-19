import { NextResponse } from "next/server";
import { z } from "zod";
import { clearStudioCookies, createStudioClient } from "@/lib/supabase/server";
import { STUDIO_PRIVATE_HEADERS, studioAuthConfig } from "@/lib/studio-auth-config";
import { authError, authJson, readAuthJson, requireStudioOrigin } from "@/lib/studio-auth-http";

export async function POST(request: Request) {
  try {
    requireStudioOrigin(request);
    if (!z.object({}).strict().safeParse(await readAuthJson(request)).success) return authJson({ error: "Invalid request." }, 400);
    const client = await createStudioClient(true);
    const { error } = await client.auth.signOut({ scope: "local" });
    // If upstream revocation fails, retain cookies so the user can retry it.
    if (error) return authJson({ error: "Unable to sign out. Please try again." }, 503);
    await clearStudioCookies();
    return NextResponse.redirect(new URL("/studio/login", studioAuthConfig().origin), { status: 303, headers: STUDIO_PRIVATE_HEADERS });
  } catch (error) { return authError(error); }
}
