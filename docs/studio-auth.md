# Studio Console authentication

Authentication foundation only. No Finance implementation or finance tables.

## Exact file manifest

Created:
- `src/lib/studio-auth-config.ts`
- `src/lib/studio-auth-http.ts`
- `src/lib/studio-auth.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/proxy.ts`
- `src/proxy.ts`
- `src/app/api/studio/auth/request-code/route.ts`
- `src/app/api/studio/auth/verify/route.ts`
- `src/app/api/studio/auth/logout/route.ts`
- `src/app/studio/layout.tsx`
- `src/app/studio/login/page.tsx`
- `src/app/studio/(protected)/layout.tsx`
- `src/app/studio/(protected)/page.tsx`
- `src/app/studio/studio.module.css`
- `src/components/studio/StudioLogin.tsx`
- `src/components/studio/SignOutButton.tsx`
- `tests/studio-auth.test.cjs`
- `docs/studio-auth.md`

Modified, preserving pre-existing changes:
- `.env.example`
- `package.json`
- `package-lock.json`
- `next.config.ts`
- `src/components/MarketingChrome.tsx`
- `src/lib/supabase-admin.ts`

Dependencies: added `@supabase/ssr` 0.12.7 and pinned `@supabase/supabase-js` 2.116.0, satisfying SSR's peer dependency. No framework upgrade or database migration.

## Architecture

- `/studio/login`: email, then a six-digit OTP. Tokens never enter application URLs or browser storage.
- `POST /api/studio/auth/request-code`: bounded JSON, exact-origin validation, durable throttling, administrator-email restriction, `signInWithOtp({ options: { shouldCreateUser: false } })`. Other valid emails receive the same success response without sending email.
- `POST /api/studio/auth/verify`: validates email/code, throttles attempts, calls `verifyOtp({ type: 'email' })`, then independently calls `getUser()` and checks the configured UUID. A wrong UUID is denied and its newly created local session is signed out/cleared.
- `requireStudioAdmin()` returns only a trusted `{ id, name }` after remote Auth verification and UUID comparison. Future data reads and mutations must invoke it independently. Do not authorize by email or metadata.
- Both the protected layout and `/studio` page enforce the guard. Anonymous users redirect to login; wrong UUIDs receive a restrained denial on login. Unavailable configuration fails closed.
- Request-scoped `@supabase/ssr` clients use only the publishable key. `src/proxy.ts` refreshes cookies for Studio GET/HEAD requests through `getClaims()`, propagating updated cookies to both the downstream request and response. Authorization remains in the server guard. Mutation handlers own their cookie writes.
- Cookie name: `aiform-studio-auth` (including SSR chunks/PKCE suffixes). HttpOnly, SameSite=Strict, Secure in production, host-only, Path=/ because both `/studio` and `/api/studio` need it. No browser Supabase client exists. Never add one without reassessing HttpOnly/cookie behaviour.
- Auth/session responses are private/no-store; Studio pages are dynamic. Noindex/nofollow/noarchive, no-referrer, nosniff and frame denial supplement authentication. Studio is absent from the sitemap and public navigation.
- Logout is same-origin POST with an empty JSON object. Supabase `signOut({ scope: 'local' })` revokes this session's refresh token; cookie chunks and PKCE cookies are cleared, then a fixed 303 redirect goes to `/studio/login`. An upstream signout error returns 503 and retains credentials for retry. The browser makes a full navigation, clearing the current client router state.

## Environment

All variables below are server-only. Do not add `NEXT_PUBLIC_` prefixes.

| Name | Purpose |
| --- | --- |
| `SUPABASE_URL` | Existing project URL |
| `SUPABASE_PUBLISHABLE_KEY` | New-format `sb_publishable_` key for Auth; secret/service-role keys are rejected |
| `SUPABASE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY` | Existing privileged server key, used only for the durable limiter and existing workflows |
| `STUDIO_ADMIN_USER_ID` | Exact pre-provisioned Auth UUID; V1 authorization allowlist |
| `STUDIO_ADMIN_EMAIL` | Administrator email, used to restrict OTP requests; not authorization |
| `STUDIO_APP_ORIGIN` | Exact origin, no trailing slash: production `https://www.aiformstudio.co.za`; local `http://localhost:3000` |

No custom Studio session-signing secret is needed. Production values must be supplied through deployment configuration, never committed. The application does not auto-provision users.

## Supabase Dashboard setup (manual; not completed by this change)

1. Select the existing project. In **Authentication → Users**, create the administrator using **Add user → Create new user**, using Dr Thabiso Eric Motaung's confirmed mailbox. Confirm the email for this deliberately pre-provisioned account. If the dashboard requires a password at creation, use a random password; the application has no password sign-in or reset flow. Do not use a public registration form. Copy the user's UUID from the user record into `STUDIO_ADMIN_USER_ID`; set the same mailbox as `STUDIO_ADMIN_EMAIL`.
2. In **Authentication → Sign In / Providers**, disable **Allow new users to sign up** and anonymous sign-ins. Keep Email enabled; leave unneeded OAuth providers disabled. Application `shouldCreateUser: false` is additional protection, not a replacement for disabling signup.
3. In **Authentication → Email Templates → Magic Link**, change the template to display `{{ .Token }}` as the six-digit access code. Remove confirmation/magic-link URLs (`{{ .ConfirmationURL }}` and token-hash links). Example content: `Your AiForm Studio access code is {{ .Token }}. Enter it on the Studio Console login page.` OTP and magic links share this template/API.
4. In **Authentication → Sign In / Providers → Email**, configure six-digit OTPs and an **Email OTP expiration** of 600 seconds. Keep a minimum resend interval of 60 seconds and configure Auth rate limits. The UI and server intentionally require six digits.
5. In **Authentication → URL Configuration**, set Site URL to `https://www.aiformstudio.co.za`. This flow has no callback/token URL and sends no `emailRedirectTo`. If redirect allowlists are configured, permit only exact owned origins/routes; avoid wildcard production entries. Use a separate development project where practical, with local Site URL and `STUDIO_APP_ORIGIN` both `http://localhost:3000`.
6. Configure production custom SMTP in Supabase Authentication email settings using a verified sending domain/sender. Existing inquiry `RESEND_API_KEY` configuration does not automatically configure Supabase Auth email delivery. Verify delivery and spam placement manually; Supabase's default mail service is not the production delivery plan.
7. Obtain the publishable key from the project's **Connect/API Keys** interface. Set `SUPABASE_PUBLISHABLE_KEY`, never a secret key in that slot. Configure all environment names above in the application deployment.
8. Verify the existing migration `20260916090350_create_document_executions.sql` has been applied: it provides `studio_signing_rate_limit` and its private table/grants. This change creates no migrations and does not apply migrations automatically. If unavailable, login returns 503 rather than falling back to memory throttling.
9. Review Auth session settings and choose the intended administrator session lifetime/inactivity limits supported by the project plan. Test refresh, expiry, account disablement, and logout with the actual project before launch.

Dashboard labels may evolve. Authoritative references:
- https://supabase.com/docs/guides/auth/auth-email-passwordless
- https://supabase.com/docs/guides/auth/server-side/creating-a-client
- https://supabase.com/docs/guides/auth/server-side/advanced-guide

## Rate limiting and document isolation

The existing atomic database limiter supplies fixed 15-minute windows: 5 OTP requests and 10 verification attempts per IP bucket, plus separate administrator-account buckets. Account limits protect against distributed verification attempts but can also temporarily deny the administrator access under attack.

Keys are HMAC-SHA256 under the existing server-only privileged key, with a separate `studio-auth-v1` namespace. No raw IP is stored; neither document-signing secret is used. On Vercel only its overwritten `x-vercel-forwarded-for` header supplies the IP. Other hosts use a shared restrictive bucket until their trusted ingress is explicitly configured. Client-supplied `x-forwarded-for` is not trusted. Privileged-key rotation resets rate identities; it does not control Auth sessions.

LeOra and countersigning cookies, code validation, sessions, and routes are unchanged. They cannot authorize Studio, and a Supabase Studio session cannot satisfy either document guard. `supabase-admin.ts` now has an enforceable `server-only` import; its existing callers are server utilities/route handlers.

## Security limits and future work

- This is a one-UUID allowlist. A later protected membership lookup can replace it behind `requireStudioAdmin()` without changing callers. No user-management UI or broad RBAC is included.
- No MFA is implemented. Mailbox security controls OTP access.
- Supabase logout revokes refresh tokens but a previously copied access JWT can remain valid until expiration. `getUser()` verifies a token/user; it is not a guarantee of immediate session revocation. Before financial mutations require stronger immediate-revocation guarantees, add an authoritative session-validity check and test it. Ordinary logout removes browser access immediately.
- Refreshable expired access tokens may be renewed by SSR; invalid/expired sessions without a valid refresh token must fail. Tests mock Auth behaviour; actual project session policies require production-like verification.
- Future sensitive endpoints must call the UUID guard before touching the privileged client. A layout or proxy alone never secures data or mutations. Keep finance data out of shared caches/static generation.
- The existing public invoice route is unchanged. No finance information is introduced by this console.
- `npm audit` during this pass reported existing Next.js 16.3.2 critical advisories (GHSA-p293-qw3h-jr36, GHSA-2xp9-vwfh-vxw4), plus Sharp and js-yaml advisories. Patch the framework/dependency findings and rerun validation before production release. No broad audit-fix or framework upgrade was performed in this authentication-only pass.

## Validation and local review

Run `node --test tests/studio-auth.test.cjs tests/leora-signing.test.cjs tests/studio-countersign.test.cjs`, `npm run typecheck`, `npm run lint`, and `npm run build`.

Auth tests replace the external Auth boundary and database limiter with controlled doubles; no OTP email or production database mutation is performed. They exercise independent page/layout guards, invalid sessions, UUID authorization, endpoints, logout, SSR cookie propagation, throttling, and document isolation. Existing SQL tests remain separate and are not run against production by this pass.

Review `/studio/login`, `/studio`, and `/studio/login?notice=denied`. With missing setup, `/studio` fails closed to `/studio/login?notice=unavailable`. With configured Auth and no session, it redirects to `/studio/login`. Do not fabricate a production test session or send OTPs from automated tests.

### Results from this implementation pass

- 39 tests passed across the new Auth suite and both existing document-signing suites. No real OTP requests were made.
- `npm run typecheck`: passed. `npm run lint`: passed without warnings. `npm run build`: passed; `/studio`, `/studio/login`, and all three Auth endpoints are dynamic.
- Built-app HTTP checks at `http://127.0.0.1:3100`: login returned 200 with private/no-store and noindex/nofollow/noarchive; unconfigured `/studio` returned 307 to the setup-unavailable login state without the administrator name; sitemap excluded Studio; unconfigured OTP endpoint returned a safe 503.
- Scanned 24 generated browser JavaScript files against the locally configured privileged Supabase credentials: no matches. No secret values were printed.
- Browser tooling reported no available browser. Visual/mobile verification at 390px and a real project OTP/refresh/logout round trip remain unverified. Authorized access and logout were exercised only through controlled Auth doubles, not a live account.
- No production Auth configuration, administrator provisioning, email delivery setup, migration application, staging, commit, or push was performed.
