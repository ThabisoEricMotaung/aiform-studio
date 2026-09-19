import "server-only";
import { redirect } from "next/navigation";
import { createStudioClient } from "@/lib/supabase/server";
import { StudioAuthError, studioAuthConfig } from "@/lib/studio-auth-config";

export type StudioActor = { id: string; name: string };

/** Call at every sensitive read/mutation, not only at the layout boundary. */
export async function requireStudioAdmin(client?: Awaited<ReturnType<typeof createStudioClient>>): Promise<StudioActor> {
  const config = studioAuthConfig();
  const supabase = client ?? await createStudioClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new StudioAuthError(401, "Please sign in to continue.");
  if (data.user.id !== config.adminId) throw new StudioAuthError(403, "This account cannot access the Studio Console.");
  return { id: data.user.id, name: "Dr Thabiso Eric Motaung" };
}

export async function requireStudioPage() {
  try { return await requireStudioAdmin(); }
  catch (error) {
    if (error instanceof StudioAuthError && error.status === 401) redirect("/studio/login");
    if (error instanceof StudioAuthError && error.status === 403) redirect("/studio/login?notice=denied");
    redirect("/studio/login?notice=unavailable");
  }
}
