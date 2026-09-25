# Product Review client access

Clients open an issued Product Review at `/reviews` using a review reference
and an access code from AiForm Studio. A report URL on its own grants nothing.
Report pages (`/reviews/[reference]`, `/reviews/[reference]/plain-language`)
open only for:

- a client session for **that exact review**, or
- a verified Studio administrator (`requireStudioAdmin()`).

This is a separate credential domain from Studio admin auth
(`docs/studio-auth.md`), LeOra private access (`docs/leora-private-access.md`)
and NDA signing/countersigning. None of those can satisfy it, and it can't
satisfy them. Studio admin is accepted as an alternative on report pages only.

## Architecture

- `src/lib/review-access.ts`: the whole mechanism. It handles code
  generation, scrypt hashing and verification, the session token, the
  report-page guard, Studio management, rate limiting and HTTP helpers. It
  follows the one-module-per-credential-domain convention.
- `supabase/migrations/20260924090000_create_studio_review_client_access.sql`:
  `studio_review_client_access` has one row per review (`unique (review_id)`).
  The columns are `code_hash`, `is_active`, `expires_at` and `last_accessed_at`,
  plus timestamps. RLS is on, only service_role has access, and there is no
  delete grant. A check constraint only accepts the exact scrypt hash format,
  so a plaintext code can't be stored.
- `POST /api/reviews/access`: the public unlock route. It checks same-origin,
  applies the rate limit, verifies the code and sets the cookie. It returns
  `{ ok, next }`, where `next` is the plain-language review if one exists,
  otherwise the detailed review.
- `/reviews`: the access form. `?reference=` only pre-fills the form. It is
  not a credential.
- `POST /api/studio/reviews/[id]/access`: Studio only. It requires the Studio
  origin and `requireStudioAdmin()`, and accepts two actions:
  - `{ action: "reset", expiresInDays: 30 | 90 | 365 | null }` generates or
    replaces the code. The plaintext code is returned **only in this
    response**.
  - `{ action: "revoke" }` deactivates access.
- `/studio/reviews/[id]`: the "Issued report & client access" panel
  (`src/components/studio/ReviewAccessPanel.tsx`). `/studio/reviews` shows a
  client-access badge for each review.

## Codes

- 16 characters from `23456789ABCDEFGHJKMNPQRSTUVWXYZ` (the alphabet leaves
  out 0/O/1/I/L), displayed as `XXXX-XXXX-XXXX-XXXX`. That is about 79 bits,
  generated with `crypto.randomInt`. Input ignores case, spaces and hyphens.
- Stored as `scrypt$16384$8$1$<salt>$<hash>`, with a 16-byte random salt per
  code and a 32-byte key. Comparison is timing-safe.
- Plaintext codes are never persisted, logged or retrievable. A lost code is
  replaced by resetting it.
- Codes can only be issued when `getPublicProductReview(reference)` returns
  a review, meaning it is in the publications allowlist, `completed`, and has
  an `issued` report version.

## Session

- Cookie `aiform-review-access`: HttpOnly, Secure in production, SameSite=Lax,
  **`Path=/reviews/<REFERENCE>`**. The browser only sends it to that review's
  two report URLs.
- Value: `until.mac`, where
  `mac = HMAC-SHA256(REVIEW_ACCESS_SESSION_SECRET, "review-access-v1\n<review id>\n<access row id>\n<until>\n<code_hash>")`.
  Because the MAC covers the review ID and the current code hash:
  - a session can't open another review, even if the path scope is bypassed;
  - a reset invalidates every session issued under the old code.
- Every report request re-reads the access row, so revocation and expiry take
  effect on the next page load.
- TTL: 24 hours, or less if `expires_at` is sooner. It is fixed, not sliding.
- SameSite=Lax rather than Strict: with Strict, a client following an emailed
  link would lose their session on arrival. The cookie only authorizes GET page
  reads, and the unlock POST checks same-origin.
- There is no client "sign out" yet. Sessions expire, or can be ended by
  revoking or resetting the code.

## Enumeration and leakage

- The guard runs **before** any report lookup, in both `generateMetadata` and
  the page. Unauthenticated requests for known and unknown references get the
  same 307 redirect to `/reviews`.
- Every unlock failure returns the same 401 message: bad format, unknown
  reference, wrong code, no access row, revoked, expired, or not eligible.
  For unknown references a decoy scrypt hash is verified, so response timing
  doesn't reveal whether a reference exists.
- The public projection (`public-product-review.ts`) is unchanged. The
  plain-language view is pinned to a hash of that projection. The projection
  never queries the access table.
- Studio state reads never select `code_hash`. Unlock responses and cookies
  contain no code, hash, UUID or commercial data.
- `/reviews/*` and `/api/reviews/*` send noindex/nofollow/noarchive,
  `no-store`, `no-referrer`, `X-Frame-Options: DENY` and `nosniff`. Report
  metadata keeps `robots: noindex, nofollow`. Nothing is added to the sitemap
  or navigation.
- `src/proxy.ts` now also matches `/reviews/:path*`. This refreshes Studio
  Supabase cookies when an administrator opens a report directly (a Server
  Component can't persist a refreshed token itself). It makes no access
  decision.

## Rate limiting

Unlock attempts reuse the durable `studio_signing_rate_limit` RPC:
10 attempts per 15 minutes per IP bucket, keyed by
`HMAC(REVIEW_ACCESS_SESSION_SECRET, "review-access-v1:unlock:ip:<ip>")`.
Only Vercel's overwritten `x-vercel-forwarded-for` is trusted. Other hosts
share one bucket, as in `studio-auth-http.ts`.

There is deliberately no per-reference bucket. With about 79-bit codes,
distributed guessing isn't practical, and a per-reference limit would let
anyone who knows a reference lock that client out.

## Environment

| Name | Purpose |
| --- | --- |
| `REVIEW_ACCESS_SESSION_SECRET` | Random value of 32+ characters, independent of all other secrets. If it is missing or short, the portal fails closed with 503 and client sessions are rejected. Studio administrators can still open reports. Rotating it signs out all clients but leaves codes valid. |

Existing `SUPABASE_URL` / `SUPABASE_SECRET_KEY` and the Studio auth variables
are reused.

## Validation

- `node --test tests/review-access.test.cjs` (with Supabase, Studio Auth and
  projection doubles), plus the existing suites.
- `supabase/tests/studio_review_client_access_schema.sql`: run it against a
  non-production database after migrating. It always rolls back.
- `npm run typecheck`, `npm run lint`, `npm run build`.
