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

Migration `20260916085706_create_document_executions.sql` was applied to the existing AiForm Studio Supabase project (`cczfkdtayvfzlhekcjtz`). It adds:

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

No signature for Thabiso Motaung is fabricated or applied. The schema supports countersigning, but an authenticated Studio-only countersigning workflow and narrowly scoped writer still need to be implemented. Do not manually mark a client-only record fully executed or relax the public table permissions to implement countersigning.

## Before production activation

The deployed signing flow is disabled unless all these **server-only** environment variables are present:

```dotenv
LEORA_SIGNING_ENABLED=true
LEORA_SIGNING_CODE_SHA256=<64-character lowercase SHA-256 of the private signing code>
LEORA_SIGNING_EXPIRES_AT=<future ISO-8601 timestamp, including timezone>
DOCUMENT_SIGNING_SESSION_SECRET=<independent cryptographically random secret, at least 32 characters>
```

Existing `SUPABASE_URL` and `SUPABASE_SECRET_KEY` (or service-role fallback) are also required. Do not prefix signing secrets with `NEXT_PUBLIC_`.

Generate a code and independent secret locally with a cryptographic random generator, for example this operator-run command (its output is secret; do not paste it into tickets or commit it):

```sh
node -e "const c=require('node:crypto');const code=c.randomBytes(32).toString('base64url');console.log({code,codeHash:c.createHash('sha256').update(code).digest('hex'),sessionSecret:c.randomBytes(32).toString('hex')})"
```

Configure secrets and an intentional expiry in the deployment environment, deploy after review, verify HTTPS/session/PDF/database access on that deployment, then deliver only the raw code privately to the verified signatory. Never put it in a link or query string. Do not use the temporary QA code: it was not a production invitation and is removed after testing.

Also establish the Studio's operational process for reviewing execution records, countersigning, retaining/backing up signature evidence, and providing records after invitation expiry. The existing Supabase administrators retain privileged access; these records are append-only at the application/database-permission level, not an externally notarized or qualified digital-signature service.

## Validation

- `npm run typecheck`, affected-file ESLint, and `npm run build`.
- `node --test tests/leora-signing.test.cjs`: route/schema tests with a Supabase test double; no production signature writes.
- `supabase/tests/document_execution_security.sql`: actual database tests run in a transaction and rolled back; covers insert/read, PDF hash constraint, duplicates, immutability, grants/RLS, and shared rate limits.
- Production-server checks against actual Supabase: authorization, secure cookie flags, defaults, exact PDF hash, invalid-submission rejection, and noindex/no-store/frame headers.
- Browser QA at 320/390/768/1440 pixels: mouse/touch/pen capture, clear, resize preservation, company requirements, missing-signature validation, failure recovery, completion. Successful submission UI uses explicitly intercepted test responses, not a fabricated production execution.
- Supabase security advisor: no security warnings/errors; informational no-policy notices are intentional for these server-only tables.
- Confirmed zero executions/countersignatures after QA. No genuine signature or notification was submitted.

RLS/grant approach follows the [Supabase RLS documentation](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Files for review

Modified: `.env.example`, `next.config.ts`, `src/app/documents/leora-group/nda/page.tsx`.

Created:

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
- `supabase/migrations/20260916085706_create_document_executions.sql`
- `supabase/tests/document_execution_security.sql`
- `tests/leora-signing.test.cjs`
- `docs/leora-electronic-signing.md`
