import type { NextRequest } from "next/server";
import { updateStudioSession } from "@/lib/supabase/proxy";

export function proxy(request: NextRequest) { return updateStudioSession(request); }
// /reviews: Studio administrators open client reports directly, so their session
// must refresh there too. Access decisions stay in the report page guard.
export const config = { matcher: ["/studio/:path*", "/reviews/:path*"] };
