# LeOra private-document access

General view permission for LeOra Group's private commercial documents. This is
a distinct, smaller-authority credential from both Studio admin authentication
(`docs/studio-auth.md`) and the NDA electronic-signing session
(`docs/leora-electronic-signing.md`). None of the three can satisfy another.

```
LeOra private access session   (this document)
    ├── NDA
    │   └── existing document-specific signing permissions remain isolated
    ├── Preliminary Scope
    │   └── view permission
    └── future LeOra documents (proposal, development agreement, milestones,
        invoices, handover) — same guard, no new secret per document
```

## What this is not

- It is not Studio admin authentication. `requireStudioPage()`/`requireStudioAdmin()`
  remain strictly for AiForm Studio's own internal `/studio` access.
- It is not the NDA signing session. `leora-signing-server.ts`, its cookie
  (`leora-signing-session`), its env vars (`LEORA_SIGNING_*`,
  `DOCUMENT_SIGNING_SESSION_SECRET`), and every route under
  `/api/documents/leora-group/nda*` are unchanged by this feature and are not
  read or written by it.
- It grants no signing, countersigning, or database-write authority. A leaked
  access code cannot be used to sign or countersign the NDA, reach Studio, or
  write any database row.

## Architecture

- `src/lib/leora-access.ts` — the entire mechanism: config validation, code
  hashing/comparison, HMAC-signed session token, rate limiting, a small
  same-origin/body-size HTTP helper set, and `resolveLeoraNextPath()` for safe
  post-unlock redirects. Self-contained; it does not import from
  `leora-signing-server.ts` or `studio-auth*`, matching this codebase's
  existing convention of one isolated module per credential domain.
- `POST /api/documents/leora-group/access` — validates same-origin, rate
  limits, checks the code, and sets the session cookie. No document identity,
  version, or hash is involved (unlike the NDA route) because this session is
  not tied to any one document.
- `/documents/leora-group/access` — the private access page (code entry
  form). Reads `?next=`, resolves it server-side to a safe in-namespace path
  via `resolveLeoraNextPath()`, and passes only that resolved, trusted string
  to the client form — the client never redirects using an unvalidated
  attacker-controlled value.
- `requireLeoraAccess(returnTo)` in `leora-access.ts` — the page guard.
  Currently used by `/documents/leora-group/preliminary-scope`, which also
  sets `export const dynamic = "force-dynamic"` so a build-time redirect
  (e.g. from missing configuration) is never baked into cached static HTML
  that would bypass the guard for later visitors.

## Session details

- Cookie: `leora-access-session`, HttpOnly, Secure in production,
  SameSite=Strict, `Path=/documents/leora-group` (not `/`, so it is never
  sent to `/studio` or `/api/studio`, and — because those live under the
  separate `/api/documents/leora-group/nda*` prefix, not under
  `/documents/leora-group` — never sent to any NDA or countersigning API
  route either). By ordinary browser cookie-path matching, it **is** sent
  alongside other cookies to the NDA's own *page* routes
  (`/documents/leora-group/nda`, `/nda/sign`, `/nda/countersign`), since
  those share the `/documents/leora-group` prefix. That is harmless: none of
  those pages read cookies server-side at all (the client-side signing flow
  calls the API routes instead), and the guards that do run there —
  `requireSession()` and `requireStudioSession()` — each look up only their
  own named cookie (`leora-signing-session`, `studio-countersign-session`)
  and never inspect `leora-access-session`. The isolation guarantee is
  therefore about **authentication**, not cookie transmission: the general
  LeOra access cookie cannot satisfy the NDA signing guard or the Studio
  countersigning guard, and neither of those can satisfy the LeOra access
  guard (verified by `tests/leora-access.test.cjs` and the cross-satisfaction
  test in `tests/studio-auth.test.cjs`).
- Token: `until.mac` where `mac = HMAC-SHA256(secret, "${until}.${codeHash}")`,
  timing-safe compared. Structurally similar to the NDA session token, but
  computed from entirely separate config, so possession of one token implies
  nothing about the other.
- TTL: 24 hours, fixed at session creation (not a sliding/renewing window).
- Rate limiting reuses the existing `studio_signing_rate_limit` RPC (no new
  migration) under a distinct key namespace (`leora-access-v1:unlock:<ip>`),
  HMAC'd with `LEORA_ACCESS_SESSION_SECRET` — never the NDA's or Studio's
  secret, never a raw IP.

## `?next=` redirect validation

`resolveLeoraNextPath()` parses the candidate against a fixed internal base
URL (`new URL(raw, "http://leora-access.internal")`) and requires the
resulting origin to be unchanged. WHATWG URL parsing normalizes backslashes to
forward slashes and collapses `.`/`..` segments for special schemes exactly as
a browser would when following a redirect — so protocol-relative values
(`//evil.test`), absolute URLs, and backslash tricks (`/\evil.test`) all
change the parsed origin and are rejected before any prefix check runs.
The resulting pathname must additionally start with
`/documents/leora-group/` and must not contain `..` or equal the access page
itself. Anything that fails any of these checks — including malformed input,
oversized input, or unparseable input — resolves to the fixed fallback
`/documents/leora-group/preliminary-scope`, never to the caller-supplied
value.

## Environment

All server-only; see `.env.example` for the authoritative list:

| Name | Purpose |
| --- | --- |
| `LEORA_ACCESS_ENABLED` | Must be exactly `true`; anything else fails closed |
| `LEORA_ACCESS_CODE_SHA256` | SHA-256 of a private access code, distinct from the NDA signing code |
| `LEORA_ACCESS_SESSION_SECRET` | Independent random secret, ≥32 characters, distinct from `DOCUMENT_SIGNING_SESSION_SECRET` and `STUDIO_COUNTERSIGN_SESSION_SECRET` |

No database migration is required — the feature reuses the existing
`studio_signing_rate_limit` function and table from
`20260916090350_create_document_executions.sql`.

## Scope of this change

The NDA cover, sign, and countersign workflows are unmodified. The only
current consumer of `requireLeoraAccess()` is the Preliminary Scope page.
Retrofitting the NDA cover page or the investor-prototype page onto this
layer, if ever wanted for consistency, is a separate decision — not made by
this change.

## Validation

- `node --test tests/leora-access.test.cjs tests/leora-signing.test.cjs tests/studio-countersign.test.cjs`
- `npm run typecheck`, affected-file ESLint, `npm run build`.
