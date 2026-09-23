# LeOra NDA electronic execution

## Implemented flow

The existing cover at `/documents/leora-group/nda` retains its typography, spacing, colours, and download action. `Review & sign` opens `/documents/leora-group/nda/sign`.

1. Enter a separately issued private signing code.
2. Open the hash-verified issued PDF in a new tab and confirm review.
3. Confirm/correct the prefilled name, business, and address. Choose individual/trading-as or registered company. Registered company requires entity name, registration number, and capacity.
4. Draw a signature using pointer events (mouse, touch, or pen). Clear and redraw as needed. No signature is stored in localStorage/sessionStorage or URL parameters.
5. Accept the exact versioned consent statement and submit.
6. Only a confirmed database record produces “Agreement signed”, a timestamp, document reference, and countersignature status. Authenticated reloads recover the record. Retries cannot replace it.

The signing code is a bearer credential, not independent identity verification. Verify the intended recipient before sharing it through an appropriate private channel. No signing code or notification has been sent by this implementation.

## Issued document

- Source (unchanged): `public/documents/leora-group/AiForm-Studio-LeOra-Group-Mutual-NDA.pdf`
- Identifier: `aiform-leora-mutual-nda`
- Version: `2026-09-16.v1`
- Reference: `AFS-LEORA-NDA-20260916-v1`
- SHA-256: `79269f1c14dd6d3c7d6c456c136d118588c99ed15a6f36ce05f204f8b855bfcd`

The server checks the bytes when opening a session, serving the review PDF, and accepting a signature. An execution contains a base64 snapshot of the same PDF, and Postgres verifies its SHA-256 with a constraint. A deployment that replaces the PDF without a new explicit document/version configuration fails closed. Never reuse this version identifier for amended legal clauses. Confirmed signatory details supplement the execution record; they do not rewrite the original legal document.

## Persistence and privacy

Migration `20260916090350_create_document_executions.sql` was applied to the existing AiForm Studio Supabase project (`cczfkdtayvfzlhekcjtz`). It adds:

- `studio_document_executions`: one immutable client execution per document/version; signatory details, normalized signature strokes, signature hash, consent wording/version, authentication method, database timestamp, and issued PDF snapshot.
- `studio_document_countersignatures`: separate immutable countersignature evidence referencing the client execution.
- `studio_signing_rate_limits` and the `studio_signing_rate_limit` function: shared atomic 15-minute rate limits; expired buckets cleaned after one day.

RLS is enabled with no browser-role policies. Public, anon, and authenticated table privileges are revoked. The server role can insert/read executions, read countersignatures, and operate the rate limiter. It cannot update/delete executions or insert countersignatures. Append-only triggers provide another protection against changes. There is no public signature storage bucket or storage URL.

The only record download is an authenticated, uncached JSON attachment at `/api/documents/leora-group/nda/record`. It includes the original PDF snapshot and separate signature evidence. **No completed signed PDF is generated or claimed.** Download access requires a valid signing session; the signing code can reopen a session until its expiry. After expiry, the Studio must arrange access or issue a new code.

Authorization uses an expiring HMAC-signed HttpOnly, Secure (production), SameSite=Strict cookie, restricted to these API routes. Changing either the code hash or session secret invalidates existing sessions. POST requests require same-origin JSON, have streaming body-size limits, and validate all fields and signature coordinates. Code attempts and submissions use database rate limits keyed by HMAC of client IP; raw IPs are not stored. Deployment must use a trusted reverse proxy that overwrites forwarded-IP headers (Vercel's forwarded header is preferred). Signatures, request bodies, and secrets are not logged.

Signing pages and APIs use noindex/nofollow metadata/headers. Sensitive responses are no-store; signing pages/API responses deny framing. The existing cover and issued PDF remain direct-link accessible as before: noindex is not access control for those existing resources.

## Countersigning

Status is derived from evidence:

| Evidence | Status |
| --- | --- |
| No client execution in the authorised session | Awaiting your signature |
| Client execution, no countersignature | Awaiting AiForm Studio countersignature |
| Client execution plus separate countersignature | Fully executed |

The unauthenticated cover shows the initial signing state, without revealing private execution information. In a valid signing session, it shows the recorded state.

No signature for Thabiso Motaung is fabricated or applied. Status is still never set manually — it is derived solely from whether a row exists in `studio_document_countersignatures`.

Studio countersigning lives at `/documents/leora-group/nda/countersign`, gated by its own Studio-only credential (`STUDIO_COUNTERSIGN_CODE_SHA256` / `STUDIO_COUNTERSIGN_SESSION_SECRET`), issuing its own HttpOnly cookie (`studio-countersign-session`) scoped to `/api/documents/leora-group/nda/countersign*`. It is structurally isolated from the client flow: different cookie name, different secret, different code, different route prefix — the client's signing code cannot open a Studio session, and a Studio session cannot open or answer the client's `/api/documents/leora-group/nda*` routes. See `src/lib/studio-countersign-server.ts`.

The Studio representative must review the executed agreement (served via the Studio-gated `/api/documents/leora-group/nda/countersign/document`), actively confirm their name and capacity, draw their own signature with the same `SignaturePad` component, accept a separate versioned consent statement (`COUNTERSIGN_CONSENT_VERSION`), and submit. The server hard-validates the submitted name/capacity against literal expected values (`STUDIO_COUNTERSIGNATORY` in `src/lib/leora-document.ts`) — the client cannot submit a different countersignatory. A second countersignature attempt against an already-countersigned execution is rejected (409), enforced both in the API route and by the database's `unique (execution_id)` constraint.

Migration `20260918090000_studio_countersignature_writer.sql` completes the countersignature schema (adds `signature_hash`, `consent_version`, matching the executions table) and grants `service_role` `insert` (only) on `studio_document_countersignatures` — it still cannot `update`/`delete`; the append-only trigger from the previous migration still blocks that regardless of role.

### Fully executed PDF

`src/lib/leora-executed-pdf.ts` derives a "fully executed" PDF on every authenticated request — it is never stored, never overwrites the original issued PDF at `public/documents/leora-group/AiForm-Studio-LeOra-Group-Mutual-NDA.pdf`, and is not a public asset. It loads the immutable issued PDF (hash-verified via `verifiedPdf()`), appends one certificate page (via `pdf-lib`) rendering both signatories' name/capacity/timestamp and their stored signature strokes as vector line art, and returns the merged bytes. It returns nothing (409) unless both an execution and a countersignature exist. Two thin, separately authenticated routes expose it: `/api/documents/leora-group/nda/executed` (client session) and `/api/documents/leora-group/nda/countersign/executed` (Studio session) — no query parameters, no public URL.

## Before production activation

The deployed signing flow is disabled unless all these **server-only** environment variables are present:

```dotenv
LEORA_SIGNING_ENABLED=true
LEORA_SIGNING_CODE_SHA256=<64-character lowercase SHA-256 of the private signing code>
LEORA_SIGNING_EXPIRES_AT=<future ISO-8601 timestamp, including timezone>
DOCUMENT_SIGNING_SESSION_SECRET=<independent cryptographically random secret, at least 32 characters>
```

Studio countersigning is separately gated and disabled unless these are also present:

```dotenv
STUDIO_COUNTERSIGN_ENABLED=true
STUDIO_COUNTERSIGN_CODE_SHA256=<64-character lowercase SHA-256 of a Studio-only countersigning code>
STUDIO_COUNTERSIGN_SESSION_SECRET=<independent cryptographically random secret, at least 32 characters, different from DOCUMENT_SIGNING_SESSION_SECRET>
```

Existing `SUPABASE_URL` and `SUPABASE_SECRET_KEY` (or service-role fallback) are also required. Do not prefix signing secrets with `NEXT_PUBLIC_`. Never reuse the client's signing code or secret for the Studio countersigning credential.

Generate a code and independent secret locally with a cryptographic random generator, for example this operator-run command (its output is secret; do not paste it into tickets or commit it):

```sh
node -e "const c=require('node:crypto');const code=c.randomBytes(32).toString('base64url');console.log({code,codeHash:c.createHash('sha256').update(code).digest('hex'),sessionSecret:c.randomBytes(32).toString('hex')})"
```

Configure secrets and an intentional expiry in the deployment environment, deploy after review, verify HTTPS/session/PDF/database access on that deployment, then deliver only the raw code privately to the verified signatory. Never put it in a link or query string. Do not use the temporary QA code: it was not a production invitation and is removed after testing.

Also establish the Studio's operational process for reviewing execution records, countersigning, retaining/backing up signature evidence, and providing records after invitation expiry. The existing Supabase administrators retain privileged access; these records are append-only at the application/database-permission level, not an externally notarized or qualified digital-signature service.

## Validation

- `npm run typecheck`, affected-file ESLint, and `npm run build`.
- `node --test tests/leora-signing.test.cjs tests/studio-countersign.test.cjs`: route/schema tests with a Supabase test double; no production signature writes. The Studio suite covers session isolation from the client flow (neither credential satisfies the other), missing signature/consent rejection, name/capacity literal enforcement, duplicate-countersignature rejection, status becoming fully executed only once evidence exists, and the executed PDF being byte-identical from both authenticated routes.
- `supabase/tests/document_execution_security.sql`: actual database tests run in a transaction and rolled back; covers insert/read, PDF hash constraint, duplicates, immutability, grants/RLS, shared rate limits, and the Studio countersignature writer (insert-only, still append-only, still isolated from anon/authenticated).
- Production-server checks against actual Supabase: authorization, secure cookie flags, defaults, exact PDF hash, invalid-submission rejection, and noindex/no-store/frame headers.
- Browser QA at 320/390/768/1440 pixels: mouse/touch/pen capture, clear, resize preservation, company requirements, missing-signature validation, failure recovery, completion. Successful submission UI uses explicitly intercepted test responses, not a fabricated production execution.
- Supabase security advisor: no security warnings/errors; informational no-policy notices are intentional for these server-only tables.
- Confirmed zero executions/countersignatures after QA. No genuine signature or notification was submitted.

RLS/grant approach follows the [Supabase RLS documentation](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Files for review

Modified (client-signing implementation): `.env.example`, `next.config.ts`, `src/app/documents/leora-group/nda/page.tsx`.

Created (client-signing implementation):

- `src/app/documents/leora-group/nda/layout.tsx`
- `src/app/documents/leora-group/nda/sign/page.tsx`
- `src/app/documents/leora-group/nda/sign/sign.module.css`
- `src/components/documents/ExecutionStatus.tsx`
- `src/components/documents/SigningFlow.tsx`
- `src/components/documents/SignaturePad.tsx`
- `src/lib/leora-document.ts`
- `src/lib/leora-signing-schema.ts`
- `src/lib/leora-signing-server.ts`
- `src/app/api/documents/leora-group/nda/route.ts`
- `src/app/api/documents/leora-group/nda/session/route.ts`
- `src/app/api/documents/leora-group/nda/issued/route.ts`
- `src/app/api/documents/leora-group/nda/record/route.ts`
- `supabase/migrations/20260916090350_create_document_executions.sql`

Modified (Studio countersigning): `.env.example`, `next.config.ts`, `package.json`/`package-lock.json` (new `pdf-lib` dependency), `src/lib/leora-document.ts` (added `STUDIO_COUNTERSIGNATORY`/consent constants), `src/components/documents/SigningFlow.tsx` (executed-PDF link once fully executed), `supabase/tests/document_execution_security.sql`.

Created (Studio countersigning):

- `src/lib/studio-countersign-server.ts` — Studio-only auth/session/rate-limit/read, isolated from the client flow
- `src/lib/studio-countersign-schema.ts` — server-side validation, including literal name/capacity enforcement
- `src/lib/leora-executed-pdf.ts` — derives the fully executed PDF from stored evidence
- `src/components/documents/StudioCountersignFlow.tsx`
- `src/app/documents/leora-group/nda/countersign/page.tsx`
- `src/app/api/documents/leora-group/nda/countersign/session/route.ts`
- `src/app/api/documents/leora-group/nda/countersign/route.ts`
- `src/app/api/documents/leora-group/nda/countersign/document/route.ts`
- `src/app/api/documents/leora-group/nda/countersign/executed/route.ts`
- `src/app/api/documents/leora-group/nda/executed/route.ts`
- `supabase/migrations/20260918090000_studio_countersignature_writer.sql`
- `tests/studio-countersign.test.cjs`
- `supabase/tests/document_execution_security.sql`
- `tests/leora-signing.test.cjs`
- `docs/leora-electronic-signing.md`
