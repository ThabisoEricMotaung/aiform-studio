import type { NextRequest } from "next/server";
import { updateStudioSession } from "@/lib/supabase/proxy";

export function proxy(request: NextRequest) { return updateStudioSession(request); }
export const config = { matcher: ["/studio/:path*"] };
