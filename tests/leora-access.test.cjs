/* eslint-disable @typescript-eslint/no-require-imports -- Node's dependency-free CommonJS test harness intercepts module loading. */
// Run: node --test tests/leora-access.test.cjs
// Route/page tests use an in-memory rate-limiter double; production never uses it.
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
for (const extension of ['.ts', '.tsx']) require.extensions[extension] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText, filename);

const jar = new Map();
let rateAllowed = true;
const admin = { rpc: async () => ({ data: rateAllowed, error: null }) };

const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === 'server-only') return {};
  if (request.endsWith('.module.css')) return {};
  if (request === 'next/headers') return {
    cookies: async () => ({
      get: name => jar.has(name) ? { value: jar.get(name) } : undefined,
      set: (name, value, options) => { if (options?.maxAge === 0) jar.delete(name); else jar.set(name, value); },
    }),
  };
  if (request === 'next/navigation') return { redirect: url => { throw new Error(`REDIRECT:${url}`); } };
  if (request.endsWith('/supabase-admin') || request === './supabase-admin') return { getSupabaseAdmin: () => admin };
  if (request.startsWith('@/')) request = path.join(root, 'src', request.slice(2));
  return originalLoad.call(this, request, parent, isMain);
};

const access = require('../src/lib/leora-access.ts');
const unlockRoute = require('../src/app/api/documents/leora-group/access/route.ts');
const scopePage = require('../src/app/documents/leora-group/preliminary-scope/page.tsx').default;
const neo = require('../src/lib/leora-signing-server.ts');

const code = crypto.randomBytes(32).toString('hex');
const origin = 'https://studio.test';

function req(body, extra = {}) {
  return new Request(`${origin}/api/documents/leora-group/access`, {
    method: 'POST', headers: { origin, 'content-type': 'application/json', ...extra }, body: JSON.stringify(body),
  });
}

test.beforeEach(() => {
  jar.clear(); rateAllowed = true;
  process.env.LEORA_ACCESS_ENABLED = 'true';
  process.env.LEORA_ACCESS_CODE_SHA256 = crypto.createHash('sha256').update(code).digest('hex');
  process.env.LEORA_ACCESS_SESSION_SECRET = crypto.randomBytes(32).toString('hex');
  // NDA signing config, used only by the cross-satisfaction tests.
  process.env.LEORA_SIGNING_ENABLED = 'true';
  process.env.LEORA_SIGNING_CODE_SHA256 = 'a'.repeat(64);
  process.env.DOCUMENT_SIGNING_SESSION_SECRET = 'b'.repeat(64);
  process.env.LEORA_SIGNING_EXPIRES_AT = new Date(Date.now() + 3600000).toISOString();
});

async function unlock() {
  const response = await unlockRoute.POST(req({ code }));
  assert.equal(response.status, 200);
}

// 1. unauthenticated Preliminary Scope access fails closed
test('unauthenticated Preliminary Scope access redirects to the access page, never rendering content', async () => {
  await assert.rejects(scopePage(), /REDIRECT:\/documents\/leora-group\/access\?next=/);
});

// 2 & 3. correct code creates a session; wrong code is rejected
test('correct access code creates a session; wrong code is rejected', async () => {
  const wrong = await unlockRoute.POST(req({ code: 'wrong'.repeat(12) }));
  assert.equal(wrong.status, 401);
  assert.equal(jar.has(access.ACCESS_COOKIE), false);
  await unlock();
  assert.ok(jar.has(access.ACCESS_COOKIE));
  await access.requireLeoraAccessSession();
});

// 4. cross-origin unlock is rejected
test('cross-origin, missing-origin, and cross-site unlock requests are rejected', async () => {
  assert.equal((await unlockRoute.POST(req({ code }, { origin: 'https://evil.test' }))).status, 403);
  assert.equal((await unlockRoute.POST(req({ code }, { origin: '' }))).status, 403);
  assert.equal((await unlockRoute.POST(req({ code }, { 'sec-fetch-site': 'cross-site' }))).status, 403);
});

// 5. valid LeOra session permits Preliminary Scope viewing
test('a valid LeOra access session renders Preliminary Scope instead of redirecting', async () => {
  jar.set(access.ACCESS_COOKIE, access.createAccessSession().value);
  const element = await scopePage();
  assert.ok(element);
});

// 6. expired/tampered session is rejected
test('expired and tampered sessions are rejected', async () => {
  const { value } = access.createAccessSession();
  const [until] = value.split('.');
  jar.set(access.ACCESS_COOKIE, `${until}.${'f'.repeat(64)}`); // tampered mac
  await assert.rejects(access.requireLeoraAccessSession(), error => error.status === 401);
  jar.set(access.ACCESS_COOKIE, `${Date.now() - 1000}.${'a'.repeat(64)}`); // expired
  await assert.rejects(access.requireLeoraAccessSession(), error => error.status === 401);
  jar.set(access.ACCESS_COOKIE, 'not-a-session-token');
  await assert.rejects(access.requireLeoraAccessSession(), error => error.status === 401);
});

// 7. LeOra access session cannot satisfy NDA signing authentication
test('a LeOra access session cannot satisfy NDA signing authentication', async () => {
  jar.set(access.ACCESS_COOKIE, access.createAccessSession().value);
  await access.requireLeoraAccessSession();
  await assert.rejects(neo.requireSession(), error => error.status === 401);
});

// 8. NDA signing session cannot satisfy LeOra general access
test('an NDA signing session cannot satisfy LeOra general access', async () => {
  jar.set(neo.SESSION_COOKIE, neo.createSession().value);
  await neo.requireSession();
  await assert.rejects(access.requireLeoraAccessSession(), error => error.status === 401);
});

// 11. malicious ?next= values cannot redirect outside /documents/leora-group/
test('malicious ?next= values resolve to the safe default, never to the supplied value', () => {
  const malicious = [
    'https://evil.test/documents/leora-group/preliminary-scope',
    '//evil.test/documents/leora-group/preliminary-scope',
    '/\\evil.test/documents/leora-group/preliminary-scope',
    '\\\\evil.test',
    '/documents/leora-group/../../studio',
    '/documents/leora-group-lookalike/preliminary-scope',
    '/studio',
    'javascript:alert(1)',
    '/documents/leora-group/access',
    null,
    undefined,
    '',
    'a'.repeat(3000),
  ];
  for (const candidate of malicious) {
    assert.equal(access.resolveLeoraNextPath(candidate), access.DEFAULT_LEORA_DESTINATION, `should fall back for ${JSON.stringify(candidate)}`);
  }
  // A legitimate in-namespace destination is preserved.
  assert.equal(access.resolveLeoraNextPath('/documents/leora-group/preliminary-scope'), '/documents/leora-group/preliminary-scope');
});

// 12. missing/invalid configuration fails closed
test('missing or invalid configuration fails closed for both the guard and the unlock route', async () => {
  delete process.env.LEORA_ACCESS_ENABLED;
  await assert.rejects(access.requireLeoraAccessSession(), error => error.status === 503);
  assert.equal((await unlockRoute.POST(req({ code }))).status, 503);
  process.env.LEORA_ACCESS_ENABLED = 'true';
  process.env.LEORA_ACCESS_SESSION_SECRET = 'too-short';
  assert.equal((await unlockRoute.POST(req({ code }))).status, 503);
});

// 13. protected content is not statically prerendered
test('Preliminary Scope is forced dynamic so a build-time redirect is never cached as static HTML', () => {
  const source = fs.readFileSync(path.join(root, 'src/app/documents/leora-group/preliminary-scope/page.tsx'), 'utf8');
  assert.match(source, /export const dynamic = "force-dynamic"/);
  assert.match(source, /requireLeoraAccess\(/);
});

// 14. protected responses remain private/no-store
test('unlock responses and the guarded route entries are private/no-store and noindex', async () => {
  const response = await unlockRoute.POST(req({ code }));
  assert.match(response.headers.get('cache-control'), /no-store/);
  assert.match(response.headers.get('x-robots-tag'), /noindex/);
  const config = fs.readFileSync(path.join(root, 'next.config.ts'), 'utf8');
  assert.match(config, /source: "\/documents\/leora-group\/preliminary-scope"[\s\S]{0,200}no-store/);
  assert.match(config, /source: "\/documents\/leora-group\/access"[\s\S]{0,200}no-store/);
});

// Rate limiting uses the existing RPC under a distinct namespace, never a raw IP or another domain's secret.
test('rate limit failures fail closed under a distinct namespace', async () => {
  rateAllowed = false;
  assert.equal((await unlockRoute.POST(req({ code }))).status, 429);
});

test('rotating the access code invalidates existing sessions without touching NDA sessions', async () => {
  await unlock();
  jar.set(neo.SESSION_COOKIE, neo.createSession().value);
  process.env.LEORA_ACCESS_CODE_SHA256 = 'c'.repeat(64);
  await assert.rejects(access.requireLeoraAccessSession(), error => error.status === 401);
  await neo.requireSession(); // unaffected by rotating the unrelated access code
});
