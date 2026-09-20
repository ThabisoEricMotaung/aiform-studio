/* eslint-disable @typescript-eslint/no-require-imports -- Matches the existing Node test harness. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
for (const extension of ['.ts', '.tsx']) require.extensions[extension] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText, filename);
const jar = new Map();
let sessions, counters, authCalls, cookieWrites, verifyId, rpcError, signOutError, refresh, clientOptions;
const adminId = '12345678-1234-4123-8123-123456789012';
const otherId = '12345678-1234-4123-8123-123456789013';
const cookieName = 'aiform-studio-auth';
const origin = 'https://studio.test';
const admin = { rpc: async (name, args) => {
  assert.equal(name, 'studio_signing_rate_limit');
  assert.match(args.p_key, /^[a-f0-9]{64}$/);
  const count = (counters.get(args.p_key) || 0) + 1; counters.set(args.p_key, count);
  return { data: count <= args.p_limit, error: rpcError ? new Error('private database detail') : null };
} };
function mockSSR(url, key, options) {
  assert.equal(url, 'https://test.supabase.co');
  assert.equal(key, 'sb_publishable_test');
  clientOptions = options;
  const current = async () => (await options.cookies.getAll()).find(item => item.name === cookieName)?.value;
  const save = async value => {
    await options.cookies.setAll([{ name: cookieName, value, options: { ...options.cookieOptions, ...(value ? {} : { maxAge: 0 }) } }], { 'Cache-Control': 'private, no-store' });
  };
  return { auth: {
    async getUser() { authCalls.push('getUser'); const token = await current(); return { data: { user: sessions.get(token) || null }, error: sessions.has(token) ? null : new Error('invalid session') }; },
    async getClaims() { if (refresh) await save('refreshed'); return { data: null, error: null }; },
    async signInWithOtp(args) { authCalls.push(args); assert.equal(args.options.shouldCreateUser, false); return { error: null }; },
    async verifyOtp(args) {
      authCalls.push(args);
      if (args.token !== '123456') return { error: new Error('invalid OTP') };
      sessions.set('valid', { id: verifyId }); await save('valid'); return { error: null };
    },
    async signOut(args) { assert.equal(args.scope, 'local'); if (signOutError) return { error: new Error('upstream detail') }; sessions.delete(await current()); await save(''); return { error: null }; },
  } };
}
const originalLoad = Module._load;
Module._load = function(request, parent, isMain) {
  if (request === 'server-only') return {};
  if (request.endsWith('.module.css')) return {};
  if (request === '@supabase/ssr') return { createServerClient: mockSSR };
  if (request === 'next/headers') return { cookies: async () => ({
    get: name => jar.has(name) ? { value: jar.get(name) } : undefined,
    getAll: () => [...jar].map(([name, value]) => ({ name, value })),
    set: (name, value, options) => { cookieWrites.push({ name, value, options }); if (options?.maxAge === 0) jar.delete(name); else jar.set(name, value); },
  }) };
  if (request === 'next/navigation') return { redirect: url => { throw new Error(`REDIRECT:${url}`); } };
  if (request.endsWith('/supabase-admin') || request === './supabase-admin') return { getSupabaseAdmin: () => admin };
  if (request.startsWith('@/')) request = path.join(root, 'src', request.slice(2));
  return originalLoad.call(this, request, parent, isMain);
};
const guard = require('../src/lib/studio-auth.ts');
const config = require('../src/lib/studio-auth-config.ts');
const server = require('../src/lib/supabase/server.ts');
const proxy = require('../src/lib/supabase/proxy.ts');
const requestCode = require('../src/app/api/studio/auth/request-code/route.ts');
const verify = require('../src/app/api/studio/auth/verify/route.ts');
const logout = require('../src/app/api/studio/auth/logout/route.ts');
const protectedLayout = require('../src/app/studio/(protected)/layout.tsx').default;
const protectedPage = require('../src/app/studio/(protected)/page.tsx').default;
const neo = require('../src/lib/leora-signing-server.ts');
const counter = require('../src/lib/studio-countersign-server.ts');
const access = require('../src/lib/leora-access.ts');
const { NextRequest } = require('next/server');
function req(body, headers = {}) { return new Request(`${origin}/api/studio/auth/test`, { method: 'POST', headers: { origin, 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) }); }
function login(id = adminId, token = 'valid') { sessions.set(token, { id }); jar.set(cookieName, token); }
test.beforeEach(() => {
  jar.clear(); sessions = new Map(); counters = new Map(); authCalls = []; cookieWrites = []; verifyId = adminId; rpcError = false; signOutError = false; refresh = false;
  Object.assign(process.env, { SUPABASE_URL: 'https://test.supabase.co', SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test',
    SUPABASE_SECRET_KEY: 'test-privileged-key-not-real', STUDIO_ADMIN_USER_ID: adminId, STUDIO_ADMIN_EMAIL: 'admin@example.test', STUDIO_APP_ORIGIN: origin,
    LEORA_SIGNING_ENABLED: 'true', LEORA_SIGNING_CODE_SHA256: 'a'.repeat(64), DOCUMENT_SIGNING_SESSION_SECRET: 'b'.repeat(64), LEORA_SIGNING_EXPIRES_AT: new Date(Date.now() + 3600000).toISOString(),
    STUDIO_COUNTERSIGN_ENABLED: 'true', STUDIO_COUNTERSIGN_CODE_SHA256: 'c'.repeat(64), STUDIO_COUNTERSIGN_SESSION_SECRET: 'd'.repeat(64),
    LEORA_ACCESS_ENABLED: 'true', LEORA_ACCESS_CODE_SHA256: 'e'.repeat(64), LEORA_ACCESS_SESSION_SECRET: 'f'.repeat(64) });
});
test('anonymous layout and page independently redirect before protected content', async () => {
  await assert.rejects(protectedLayout({ children: 'private' }), /REDIRECT:\/studio\/login$/);
  await assert.rejects(protectedPage(), /REDIRECT:\/studio\/login$/);
});
test('verified UUID receives minimal actor; wrong UUID with same email is denied', async () => {
  login(); assert.deepEqual(await guard.requireStudioAdmin(), { id: adminId, name: 'Dr Thabiso Eric Motaung' });
  assert.equal(await protectedLayout({ children: 'private' }), 'private'); assert.ok(await protectedPage());
  login(otherId); sessions.get('valid').email = 'admin@example.test';
  await assert.rejects(guard.requireStudioAdmin(), error => error.status === 403);
  await assert.rejects(protectedPage(), /notice=denied/);
});
test('forged and expired sessions fail verified user lookup', async () => {
  for (const token of ['forged', 'expired']) { jar.set(cookieName, token); await assert.rejects(guard.requireStudioAdmin(), error => error.status === 401); }
  assert.deepEqual(authCalls, ['getUser', 'getUser']);
});
test('missing configuration fails closed and secret keys cannot be used as publishable keys', async () => {
  delete process.env.STUDIO_ADMIN_USER_ID; await assert.rejects(guard.requireStudioAdmin(), error => error.status === 503);
  process.env.STUDIO_ADMIN_USER_ID = adminId; process.env.SUPABASE_PUBLISHABLE_KEY = 'sb_secret_wrong';
  assert.throws(config.studioAuthConfig, error => error.status === 503);
});
test('request code validates email, suppresses unauthorized email, disables signup', async () => {
  assert.equal((await requestCode.POST(req({ email: 'bad' }))).status, 400);
  assert.equal((await requestCode.POST(req({ email: 'other@example.test' }))).status, 200);
  assert.equal(authCalls.length, 0);
  assert.equal((await requestCode.POST(req({ email: 'ADMIN@example.test' }))).status, 200);
  assert.equal(authCalls[0].email, 'admin@example.test'); assert.equal(authCalls[0].options.shouldCreateUser, false);
});
test('OTP malformed, wrong, expired, and incorrect email are rejected', async () => {
  assert.equal((await verify.POST(req({ email: 'admin@example.test', token: '123' }))).status, 400);
  assert.equal((await verify.POST(req({ email: 'admin@example.test', token: '000000' }))).status, 401);
  assert.equal((await verify.POST(req({ email: 'other@example.test', token: '123456' }))).status, 401);
  assert.equal(jar.has(cookieName), false);
});
test('OTP success sets HttpOnly scoped cookies and returns no session or UUID', async () => {
  const response = await verify.POST(req({ email: 'admin@example.test', token: '123456' }));
  assert.equal(response.status, 200); assert.deepEqual(await response.json(), { ok: true });
  assert.equal(cookieWrites[0].options.httpOnly, true); assert.equal(cookieWrites[0].options.sameSite, 'strict'); assert.equal(cookieWrites[0].options.path, '/');
  assert.match(response.headers.get('cache-control'), /no-store/); assert.match(response.headers.get('x-robots-tag'), /noarchive/);
});
test('OTP cannot authorize wrong UUID; resulting session is revoked and cleared', async () => {
  verifyId = otherId;
  assert.equal((await verify.POST(req({ email: 'admin@example.test', token: '123456' }))).status, 403);
  assert.equal(jar.has(cookieName), false); assert.equal(sessions.size, 0);
});
test('all auth mutations reject cross-origin, missing-origin, cross-site and oversized bodies', async () => {
  for (const endpoint of [requestCode, verify, logout]) {
    assert.equal((await endpoint.POST(req({}, { origin: 'https://evil.test' }))).status, 403);
    assert.equal((await endpoint.POST(req({}, { origin: '' }))).status, 403);
    assert.equal((await endpoint.POST(req({}, { 'sec-fetch-site': 'cross-site' }))).status, 403);
    assert.equal((await endpoint.POST(req({ data: 'x'.repeat(2100) }))).status, 413);
  }
});
test('durable rate limits enforce request and verification budgets and fail closed', async () => {
  for (let i = 0; i < 5; i++) assert.equal((await requestCode.POST(req({ email: 'other@example.test' }))).status, 200);
  assert.equal((await requestCode.POST(req({ email: 'admin@example.test' }))).status, 429);
  for (let i = 0; i < 10; i++) assert.equal((await verify.POST(req({ email: 'admin@example.test', token: '000000' }))).status, 401);
  assert.equal((await verify.POST(req({ email: 'admin@example.test', token: '123456' }))).status, 429);
  counters.clear(); rpcError = true; assert.equal((await requestCode.POST(req({ email: 'admin@example.test' }))).status, 503);
});
test('logout revokes session, clears cookie chunks, preserves NDA cookies, redirects safely', async () => {
  login(); jar.set(`${cookieName}.0`, 'chunk'); jar.set(`${cookieName}-code-verifier`, 'pkce'); jar.set(neo.SESSION_COOKIE, 'document');
  const response = await logout.POST(req({})); assert.equal(response.status, 303); assert.equal(response.headers.get('location'), `${origin}/studio/login`);
  assert.equal(sessions.size, 0); assert.deepEqual([...jar], [[neo.SESSION_COOKIE, 'document']]);
  await assert.rejects(guard.requireStudioAdmin(), error => error.status === 401);
});
test('failed upstream logout does not report success or silently discard retry credentials', async () => {
  login(); signOutError = true; const response = await logout.POST(req({}));
  assert.equal(response.status, 503); assert.equal(jar.get(cookieName), 'valid'); assert.doesNotMatch(await response.text(), /upstream detail/);
});
test('valid document cookies cannot authorize Studio; Studio cookie cannot authorize documents', async () => {
  jar.set(neo.SESSION_COOKIE, neo.createSession().value); await neo.requireSession();
  jar.set(counter.STUDIO_SESSION_COOKIE, counter.createStudioSession().value); await counter.requireStudioSession();
  await assert.rejects(guard.requireStudioAdmin(), error => error.status === 401);
  jar.clear(); login(); await guard.requireStudioAdmin();
  await assert.rejects(neo.requireSession(), error => error.status === 401);
  await assert.rejects(counter.requireStudioSession(), error => error.status === 401);
});
test('a Studio session cannot authorize LeOra general access; a LeOra access session cannot authorize Studio', async () => {
  login();
  await guard.requireStudioAdmin();
  await assert.rejects(access.requireLeoraAccessSession(), error => error.status === 401);
  jar.clear();
  jar.set(access.ACCESS_COOKIE, access.createAccessSession().value);
  await access.requireLeoraAccessSession();
  await assert.rejects(guard.requireStudioAdmin(), error => error.status === 401);
});

test('SSR refresh forwards updated request cookies and private response cookies', async () => {
  refresh = true;
  const response = await proxy.updateStudioSession(new NextRequest(`${origin}/studio`, { headers: { cookie: `${cookieName}=old; leora-signing-session=ignored` } }));
  assert.equal(response.cookies.get(cookieName).value, 'refreshed');
  assert.equal(response.cookies.get(cookieName).httpOnly, true);
  assert.match(response.headers.get('x-middleware-request-cookie'), /aiform-studio-auth=refreshed/);
  assert.match(response.headers.get('cache-control'), /no-store/);
  assert.equal((await clientOptions.cookies.getAll()).some(item => item.name === neo.SESSION_COOKIE), false);
});
test('writable server adapter clears only Studio cookies', async () => {
  jar.set('other-cookie', 'keep'); jar.set(cookieName, 'remove'); await server.clearStudioCookies(); assert.deepEqual([...jar], [['other-cookie', 'keep']]);
});
test('Studio is absent from public navigation and sitemap; client auth modules contain no secrets/storage', () => {
  for (const filename of ['src/app/sitemap.ts', 'src/components/Header.tsx', 'src/components/Footer.tsx']) assert.doesNotMatch(fs.readFileSync(path.join(root, filename), 'utf8'), /["'`]\/studio(?:[\/"'`])/);
  assert.match(fs.readFileSync(path.join(root, 'src/components/MarketingChrome.tsx'), 'utf8'), /pathname === "\/studio"/);
  for (const filename of ['StudioLogin.tsx', 'SignOutButton.tsx']) {
    const source = fs.readFileSync(path.join(root, 'src/components/studio', filename), 'utf8');
    assert.doesNotMatch(source, /SUPABASE_|STUDIO_ADMIN_|supabase-admin|localStorage|sessionStorage/);
  }
  assert.match(fs.readFileSync(path.join(root, 'src/lib/supabase-admin.ts'), 'utf8'), /import "server-only"/);
});
test('rate keys use independent namespace, never signing secrets or raw IPs', async () => {
  await requestCode.POST(req({ email: 'admin@example.test' }));
  const expected = crypto.createHmac('sha256', process.env.SUPABASE_SECRET_KEY).update(`studio-auth-v1:request:account:${adminId}`).digest('hex');
  assert.ok(counters.has(expected));
});
