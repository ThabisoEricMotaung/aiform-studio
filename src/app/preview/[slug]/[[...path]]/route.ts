import { NextResponse, type NextRequest } from "next/server";

// Client-preview system: /preview/<slug>[/...] transparently proxies a
// prototype hosted elsewhere (currently GitHub Pages) so a client only ever
// sees an aiformstudio.co.za URL and aiformstudio.co.za response headers —
// never the origin host, a visible redirect, or the origin's own
// infrastructure headers. To add a future preview, add one entry below;
// this one route handles the exact slug and everything nested under it.
//
// The origin should be the canonical trailing-slash root (e.g.
// ".../repo-name/", not ".../repo-name") — GitHub Pages 301-redirects the
// no-slash form, and while `fetch` below follows that redirect either way
// (so it would never reach the visitor), starting from the canonical URL
// avoids the extra hop entirely.
const previewSources: Record<string, string> = {
  "urban-heritage": "https://thabisoericmotaung.github.io/urban-heritage-concepts/",
};

// Headers that would reveal the upstream host or its CDN/infrastructure if
// forwarded as-is. Everything else the origin sends (Content-Type, ETag,
// Last-Modified, Cache-Control) is safe and worth keeping.
const STRIP_RESPONSE_HEADERS = new Set([
  "server",
  "x-github-request-id",
  "x-github-edge-region",
  "x-proxy-cache",
  "x-served-by",
  "x-cache",
  "x-cache-hits",
  "x-timer",
  "x-fastly-request-id",
  "via",
  // Recomputed by NextResponse from the body we actually send, or
  // meaningless to forward from a proxied fetch.
  "content-encoding",
  "content-length",
  "transfer-encoding",
  "connection",
]);

async function proxyPreview(slug: string, path: string[] | undefined) {
  const origin = previewSources[slug];
  if (!origin) {
    return new NextResponse("Not found", { status: 404 });
  }

  const upstreamUrl = origin + (path ?? []).join("/");

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl, { redirect: "follow", cache: "no-store" });
  } catch {
    return new NextResponse("This preview is temporarily unavailable.", { status: 502 });
  }

  if (upstream.status === 404) {
    return new NextResponse("Not found", { status: 404 });
  }

  const headers = new Headers();
  upstream.headers.forEach((value, key) => {
    if (!STRIP_RESPONSE_HEADERS.has(key.toLowerCase())) headers.set(key, value);
  });
  headers.set("X-Robots-Tag", "noindex, nofollow");

  const contentType = upstream.headers.get("content-type") ?? "";
  if (contentType.includes("text/html")) {
    // The prototype's own links/iframes are relative (e.g.
    // href="concept-01-essential.html"), authored assuming it's served at
    // a directory-style URL. /preview/<slug> (no trailing slash) is a
    // "file-like" URL to the browser, so those relative references would
    // otherwise resolve one level up (dropping the slug entirely) — a
    // <base> tag fixes that regardless of whether the visitor's address
    // bar has a trailing slash or not.
    const html = await upstream.text();
    const based = html.replace(/<head(\s[^>]*)?>/i, (match) => `${match}<base href="/preview/${slug}/">`);
    headers.set("Content-Type", contentType);
    return new NextResponse(based, { status: upstream.status, headers });
  }

  const body = await upstream.arrayBuffer();
  return new NextResponse(body, { status: upstream.status, headers });
}

type RouteParams = { params: Promise<{ slug: string; path?: string[] }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { slug, path } = await params;
  return proxyPreview(slug, path);
}

export const dynamic = "force-dynamic";
