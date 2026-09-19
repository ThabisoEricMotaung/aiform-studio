import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isStudioCookie, STUDIO_PRIVATE_HEADERS, studioAuthConfig, studioCookieOptions } from "@/lib/studio-auth-config";

export async function updateStudioSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  Object.entries(STUDIO_PRIVATE_HEADERS).forEach(([key, value]) => response.headers.set(key, value));
  // Mutation handlers own their cookie writes. Avoid competing refreshes.
  if (request.method !== "GET" && request.method !== "HEAD") return response;
  try {
    const config = studioAuthConfig();
    const client = createServerClient(config.url, config.key, {
      cookieOptions: studioCookieOptions(),
      cookies: {
        getAll: () => request.cookies.getAll().filter(({ name }) => isStudioCookie(name)),
        setAll(values, headers) {
          values.forEach(({ name, value }) => request.cookies.set(name, value));
          const previous = response.cookies.getAll();
          response = NextResponse.next({ request });
          previous.forEach(cookie => response.cookies.set(cookie));
          values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          Object.entries({ ...headers, ...STUDIO_PRIVATE_HEADERS }).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    });
    await client.auth.getClaims();
  } catch {
    // No access decision here. Layout/page guards independently fail closed.
  }
  return response;
}
