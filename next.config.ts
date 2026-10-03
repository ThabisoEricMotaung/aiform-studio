import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/documents/leora-group/nda{,/**}": ["./public/documents/leora-group/AiForm-Studio-LeOra-Group-Mutual-NDA.pdf"],
  },
  async headers() {
    return [
      ...["/studio/:path*", "/api/studio/:path*"].map(source => ({
        source,
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "private, no-store, max-age=0, must-revalidate" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      })),
      {
        source: "/api/documents/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
      {
        source: "/documents/leora-group/nda/sign",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
      {
        source: "/documents/leora-group/nda/countersign",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
      {
        source: "/documents/leora-group/access",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
      {
        source: "/documents/leora-group/preliminary-scope",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
      // Client Product Review portal and reports: private, never cached or indexed.
      ...["/reviews/:path*", "/api/reviews/:path*"].map(source => ({
        source,
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      })),
      {
        source: "/share/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
      {
        source: "/documents/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
      // Delivered client sites served here temporarily, until their permanent domain is live.
      // Covers responses served by this app under /sites (e.g. 404s for paths not forwarded).
      // Responses from the external rewrite keep the upstream's headers instead (verified with
      // `next dev`), so the client's /sites build must also send X-Robots-Tag itself.
      {
        source: "/sites/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
    ];
  },
  async rewrites() {
    return [
      // Guardian's public surface only; its /login (job manager) is deliberately absent.
      ...clientSiteRewrites("guardian-enviroclean", process.env.GUARDIAN_SITE_ORIGIN,
        ["", "/request-quote", "/api/quote-requests", "/_next/:path+", "/images/:path+", "/favicon.ico", "/icon.png"]),
    ];
  },
};

// /sites/<slug>: a delivered client site served from aiformstudio.co.za while its permanent
// domain is pending (Next.js Multi-Zones). The client app is built with basePath "/sites/<slug>",
// so paths pass through unchanged. Only the listed public paths are forwarded: anything else
// (e.g. /login, or a future admin area) 404s here. No origin configured → nothing is served.
function clientSiteRewrites(slug: string, origin: string | undefined, publicPaths: string[]) {
  if (!origin) return [];
  if (!/^https?:\/\/[^/]+$/.test(origin)) throw new Error(`Client site origin for ${slug} must be a bare origin with no path; got "${origin}"`);
  return publicPaths.map(path => ({
    source: `/sites/${slug}${path}`,
    destination: `${origin}/sites/${slug}${path}`,
  }));
}

export default nextConfig;
