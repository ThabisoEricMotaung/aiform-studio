"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Keep the marketing shell out of focused client document routes. */
export default function MarketingChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDocument = pathname === "/share" || pathname.startsWith("/share/")
    || pathname === "/documents" || pathname.startsWith("/documents/")
    || pathname === "/studio" || pathname.startsWith("/studio/");
  return isDocument ? null : children;
}
