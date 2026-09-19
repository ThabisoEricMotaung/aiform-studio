import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isStudioCookie, studioAuthConfig, studioCookieOptions } from "@/lib/studio-auth-config";

/** Per-request client. Never use the privileged database client for Auth. */
export async function createStudioClient(writable = false) {
  const config = studioAuthConfig();
  const jar = await cookies();
  return createServerClient(config.url, config.key, {
    cookieOptions: studioCookieOptions(),
    cookies: {
      getAll: () => jar.getAll().filter(({ name }) => isStudioCookie(name)),
      setAll(values) {
        // Server Components cannot write cookies; the proxy refreshes first.
        // Route handlers opt in, and never swallow failed cookie writes.
        if (writable) values.forEach(({ name, value, options }) => jar.set(name, value, options));
      },
    },
  });
}

export async function clearStudioCookies() {
  const jar = await cookies();
  for (const { name } of jar.getAll()) {
    if (isStudioCookie(name)) jar.set(name, "", { ...studioCookieOptions(), maxAge: 0 });
  }
}
