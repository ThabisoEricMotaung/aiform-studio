import "server-only";
import { z } from "zod";

export class StudioAuthError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export const STUDIO_COOKIE = "aiform-studio-auth";
export const STUDIO_PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0, must-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

export function studioAuthConfig() {
  const parsed = z.object({
    url: z.string().url(),
    key: z.string().startsWith("sb_publishable_"),
    adminId: z.string().uuid(),
    email: z.string().email(),
    origin: z.string().url(),
  }).safeParse({
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_PUBLISHABLE_KEY,
    adminId: process.env.STUDIO_ADMIN_USER_ID,
    email: process.env.STUDIO_ADMIN_EMAIL?.trim().toLowerCase(),
    origin: process.env.STUDIO_APP_ORIGIN,
  });
  if (!parsed.success) throw new StudioAuthError(503, "Studio access is not available yet.");
  const { origin } = parsed.data;
  const address = new URL(origin);
  if (address.origin !== origin || (process.env.NODE_ENV === "production" && address.protocol !== "https:")) {
    throw new StudioAuthError(503, "Studio access is not available yet.");
  }
  return parsed.data;
}

export function studioCookieOptions() {
  // Both /studio and /api/studio require the cookie; no Domain means host-only.
  return { name: STUDIO_COOKIE, path: "/", httpOnly: true,
    secure: process.env.NODE_ENV === "production", sameSite: "strict" as const };
}

export function isStudioCookie(name: string) {
  return name === STUDIO_COOKIE || name.startsWith(`${STUDIO_COOKIE}.`) || name.startsWith(`${STUDIO_COOKIE}-`);
}
