/* eslint-disable @typescript-eslint/no-require-imports -- Node's dependency-free CommonJS test harness intercepts module loading. */
// Run: node --test tests/review-access.test.cjs
// Supabase, Studio Auth and the report projections are in-memory doubles; no network or database is touched.
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
for (const extension of ['.ts', '.tsx']) require.extensions[extension] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText, filename);

const REVIEW_A = '11111111-1111-4111-8111-111111111111';
const REVIEW_B = '22222222-2222-4222-8222-222222222222';
const REVIEW_DRAFT = '33333333-3333-4333-8333-333333333333';
const origin = 'https://studio.test';

let tables, jar, cookieWrites, studioAdmin, rateCounts, queries;

function row(table, value, columns) {
  return columns ? Object.fromEntries(columns.map(column => [column, value[column]])) : value;
}
const db = {
  rpc: async (name, args) => {
    assert.equal(name, 'studio_signing_rate_limit');
    assert.match(args.p_key, /^[a-f0-9]{64}$/);
    const count = (rateCounts.get(args.p_key) || 0) + 1; rateCounts.set(args.p_key, count);
    return { data: count <= args.p_limit, error: null };
  },
  from(table) {
    let columns, filters = [], single = false, op = 'select', values;
    const query = {
      select(value) { columns = value.split(',').map(column => column.trim()); queries.push({ table, columns }); return query; },
      eq(column, value) { filters.push([column, value]); return query; },
      maybeSingle() { single = true; return query; },
      update(value) { op = 'update'; values = value; return query; },
      upsert(value, options) {
        assert.equal(options.onConflict, 'review_id');
        const existing = tables[table].find(item => item.review_id === value.review_id);
        const now = new Date().toISOString();
        if (existing) Object.assign(existing, value, { updated_at: now });
        else tables[table].push({ id: crypto.randomUUID(), created_at: now, updated_at: now, ...value });
        return Promise.resolve({ error: null });
      },
      then(resolve, reject) {
        const matched = tables[table].filter(item => filters.every(([column, value]) => item[column] === value));
        if (op === 'update') { matched.forEach(item => Object.assign(item, values, { updated_at: new Date().toISOString() })); return Promise.resolve({ error: null }).then(resolve, reject); }
        const selected = matched.map(item => row(table, item, columns));
        return Promise.resolve({ data: single ? selected[0] ?? null : selected, error: null }).then(resolve, reject);
      },
    };
    return query;
  },
};

// Report projections: eligibility is the only behaviour review-access depends on.
const eligible = new Set(['PR-2026-001', 'PR-2026-002']);
function projection(reference) {
  return { reference, version: 1, status: 'issued', product: 'Product', client: 'Client', date: '2026-09-21', question: 'Question', scope: 'Scope',
    environment: 'Desktop', limitations: null, direction: [], journeys: [], findings: [], assumptions: [] };
}
const publicReview = { getPublicProductReview: async reference => eligible.has(reference) ? projection(reference) : null };
const plainReview = { getPlainLanguageProductReview: async reference => reference === 'PR-2026-001' ? { review: projection(reference),
  copy: { takeaway: 'T', working: [], preserve: 'P', scope: 'S', coverage: [], findings: [], assumptions: [], limitations: [] } } : null };

const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === 'server-only') return {};
  if (request.endsWith('.module.css')) return {};
  if (request === 'next/headers') return { cookies: async () => ({
    get: name => jar.has(name) ? { value: jar.get(name) } : undefined,
    getAll: () => [...jar].map(([name, value]) => ({ name, value })),
    set: (nameOrCookie, value, options) => {
      const cookie = typeof nameOrCookie === 'object' ? nameOrCookie : { name: nameOrCookie, value, ...options };
      cookieWrites.push(cookie); jar.set(cookie.name, cookie.value);
    },
  }) };
  if (request === 'next/navigation') return {
    redirect: url => { throw new Error(`REDIRECT:${url}`); },
    notFound: () => { throw new Error('NOT_FOUND'); },
  };
  if (request.endsWith('/supabase-admin') || request === './supabase-admin') return { getSupabaseAdmin: () => db };
  if (request === './studio-auth' || request === '@/lib/studio-auth') return { requireStudioAdmin: async () => {
    if (!studioAdmin) { const { StudioAuthError } = require('../src/lib/studio-auth-config.ts'); throw new StudioAuthError(401, 'Please sign in to continue.'); }
    return { id: 'admin', name: 'Admin' };
  } };
  if (request === '@/lib/supabase/server') return { createStudioClient: async () => ({}) };
  if (request === './public-product-review' || request === '@/lib/public-product-review') return publicReview;
  if (request === './plain-language-product-review' || request === '@/lib/plain-language-product-review') return plainReview;
  if (request.startsWith('@/')) request = path.join(root, 'src', request.slice(2));
  return originalLoad.call(this, request, parent, isMain);
};

const access = require('../src/lib/review-access.ts');
const unlockRoute = require('../src/app/api/reviews/access/route.ts');
const studioRoute = require('../src/app/api/studio/reviews/[id]/access/route.ts');
const detailedPage = require('../src/app/reviews/[reference]/page.tsx');
const plainPage = require('../src/app/reviews/[reference]/plain-language/page.tsx');

test.beforeEach(() => {
  tables = {
    studio_reviews: [
      { id: REVIEW_A, reference: 'PR-2026-001' },
      { id: REVIEW_B, reference: 'PR-2026-002' },
      { id: REVIEW_DRAFT, reference: 'PR-2026-003' },
    ],
    studio_review_client_access: [],
  };
  jar = new Map(); cookieWrites = []; studioAdmin = false; rateCounts = new Map(); queries = [];
  Object.assign(process.env, {
    REVIEW_ACCESS_SESSION_SECRET: crypto.randomBytes(32).toString('hex'),
    SUPABASE_URL: 'https://test.supabase.co', SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test', SUPABASE_SECRET_KEY: 'test-privileged-key-not-real',
    STUDIO_ADMIN_USER_ID: '12345678-1234-4123-8123-123456789012', STUDIO_ADMIN_EMAIL: 'admin@example.test', STUDIO_APP_ORIGIN: origin,
  });
  delete process.env.VERCEL;
});

function unlockRequest(body, headers = {}) {
  return new Request(`${origin}/api/reviews/access`, { method: 'POST', headers: { origin, 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });
}
function studioRequest(id, body, headers = {}) {
  return studioRoute.POST(new Request(`${origin}/api/studio/reviews/${id}/access`, {
    method: 'POST', headers: { origin, 'content-type': 'application/json', ...headers }, body: JSON.stringify(body),
  }), { params: Promise.resolve({ id }) });
}
/** Issues a code through the real Studio route, as the Studio UI does. */
async function issue(id = REVIEW_A, expiresInDays = 90) {
  const previous = studioAdmin; studioAdmin = true;
  const response = await studioRequest(id, { action: 'reset', expiresInDays });
  studioAdmin = previous;
  assert.equal(response.status, 200);
  return response.json();
}
async function unlock(reference, code) {
  const response = await unlockRoute.POST(unlockRequest({ reference, code }));
  return { response, body: await response.json() };
}
const params = reference => ({ params: Promise.resolve({ reference }) });
async function assertDenied(reference) {
  for (const page of [detailedPage, plainPage]) {
    await assert.rejects(page.default(params(reference)), /^Error: REDIRECT:\/reviews$/);
    await assert.rejects(page.generateMetadata(params(reference)), /^Error: REDIRECT:\/reviews$/);
  }
}
async function assertAllowed(reference) {
  assert.ok(await detailedPage.default(params(reference)));
  assert.ok(await plainPage.default(params(reference)));
}

// 1
test('correct reference + code succeeds, sets a scoped HttpOnly cookie and lands on the plain-language review', async () => {
  const { code } = await issue();
  assert.match(code, /^[2-9A-HJKMNP-Z]{4}(-[2-9A-HJKMNP-Z]{4}){3}$/);
  // Case and separators are forgiving; the code itself is not.
  const { response, body } = await unlock('pr-2026-001 ', code.toLowerCase().replace(/-/g, ' '));
  assert.equal(response.status, 200);
  assert.deepEqual(body, { ok: true, next: '/reviews/PR-2026-001/plain-language' });
  const cookie = cookieWrites.at(-1);
  assert.equal(cookie.name, access.REVIEW_ACCESS_COOKIE);
  assert.equal(cookie.httpOnly, true);
  assert.equal(cookie.sameSite, 'lax');
  assert.equal(cookie.path, '/reviews/PR-2026-001');
  assert.ok(cookie.expires.getTime() <= Date.now() + 24 * 3600 * 1000);
  assert.match(response.headers.get('cache-control'), /no-store/);
  assert.match(response.headers.get('x-robots-tag'), /noindex/);
  assert.ok(tables.studio_review_client_access[0].last_accessed_at);
  await assertAllowed('PR-2026-001');
});

test('the session cookie is Secure in production', () => {
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  try { assert.equal(access.reviewSessionCookie('PR-2026-001', { value: 'x', until: Date.now() + 1000 }).secure, true); }
  finally { process.env.NODE_ENV = previous; }
});

// 2 & 3
test('incorrect code and unknown reference fail with the identical generic response', async () => {
  const { code } = await issue();
  const wrong = await unlock('PR-2026-001', code.replace(/^./, c => c === '2' ? '3' : '2'));
  const unknown = await unlock('PR-2099-999', code);
  const noAccessRow = await unlock('PR-2026-002', code);
  const malformed = await unlock('../../studio', 'x');
  for (const attempt of [wrong, unknown, noAccessRow, malformed]) {
    assert.equal(attempt.response.status, 401);
    assert.deepEqual(attempt.body, { error: 'The review reference or access code is not valid.' });
  }
  assert.equal(cookieWrites.length, 0);
});

// 4
test('revoked access fails at unlock and ends an existing session', async () => {
  const { code } = await issue();
  assert.equal((await unlock('PR-2026-001', code)).response.status, 200);
  studioAdmin = true;
  const revoked = await studioRequest(REVIEW_A, { action: 'revoke' });
  assert.equal(revoked.status, 200);
  assert.equal((await revoked.json()).state.status, 'revoked');
  studioAdmin = false;
  await assertDenied('PR-2026-001');
  const retry = await unlock('PR-2026-001', code);
  assert.equal(retry.response.status, 401);
  assert.equal(retry.body.error, 'The review reference or access code is not valid.');
});

// 5
test('expired access fails at unlock and ends an existing session', async () => {
  const { code } = await issue();
  assert.equal((await unlock('PR-2026-001', code)).response.status, 200);
  tables.studio_review_client_access[0].expires_at = new Date(Date.now() - 1000).toISOString();
  await assertDenied('PR-2026-001');
  assert.equal((await unlock('PR-2026-001', code)).response.status, 401);
  assert.equal((await access.getReviewAccessState(REVIEW_A)).status, 'expired');
});

test('a session never outlives the access expiry', async () => {
  const { code } = await issue(REVIEW_A, 30);
  tables.studio_review_client_access[0].expires_at = new Date(Date.now() + 60_000).toISOString();
  await unlock('PR-2026-001', code);
  assert.ok(cookieWrites.at(-1).expires.getTime() <= Date.now() + 60_000);
});

// 6
test('a client session is scoped to one review and cannot open another', async () => {
  const a = await issue(REVIEW_A);
  await issue(REVIEW_B);
  await unlock('PR-2026-001', a.code);
  // The test jar ignores cookie paths, so this also proves the MAC binding, not only the browser path scope.
  await assertAllowed('PR-2026-001');
  await assertDenied('PR-2026-002');
  // Codes are per review too.
  assert.equal((await unlock('PR-2026-002', a.code)).response.status, 401);
});

// 7
test('direct report access without Studio or client auth redirects to /reviews for known and unknown references alike', async () => {
  await issue();
  for (const reference of ['PR-2026-001', 'PR-2026-002', 'PR-2099-999', 'not a reference']) await assertDenied(reference);
});

test('forged, tampered and malformed session cookies are denied', async () => {
  const { code } = await issue();
  await unlock('PR-2026-001', code);
  const [until] = jar.get(access.REVIEW_ACCESS_COOKIE).split('.');
  for (const value of [`${until}.${'f'.repeat(64)}`, `${Date.now() - 1000}.${'a'.repeat(64)}`, 'garbage', '']) {
    jar.set(access.REVIEW_ACCESS_COOKIE, value);
    await assertDenied('PR-2026-001');
  }
});

test('a session signed with a different secret is denied, and missing configuration fails closed', async () => {
  const { code } = await issue();
  await unlock('PR-2026-001', code);
  process.env.REVIEW_ACCESS_SESSION_SECRET = crypto.randomBytes(32).toString('hex');
  await assertDenied('PR-2026-001');
  process.env.REVIEW_ACCESS_SESSION_SECRET = 'too-short';
  await assertDenied('PR-2026-001');
  assert.equal((await unlock('PR-2026-001', code)).response.status, 503);
});

// 8
test('Studio-authenticated access remains allowed without a client code', async () => {
  studioAdmin = true;
  await assertAllowed('PR-2026-001');
  assert.ok(await detailedPage.default(params('PR-2026-002')));
  // Studio still gets a 404 (not a redirect) for a reference that is not published.
  await assert.rejects(detailedPage.default(params('PR-2099-999')), /NOT_FOUND/);
});

// 9 & 10
test('public projection never reads the access table, and excludes internal fields and hashes', async () => {
  const hash = await access.hashAccessCode(access.generateAccessCode());
  const rows = {
    studio_reviews: [{ id: 'private-review-id', product_id: 'private-product-id', reference: 'PR-2026-001', status: 'completed', review_question: 'Q', scope: 'S', environment: 'E', start_date: '2026-09-21', end_date: null, limitations: null, notes: null, commercial_value_amount: 10000, commercial_notes: 'PRIVATE COMMERCIAL', engagement_type: 'pilot' }],
    studio_reports: [{ review_id: 'private-review-id', version: 1, status: 'issued' }],
    studio_products: [{ id: 'private-product-id', client_id: 'private-client-id', name: 'Product' }],
    studio_clients: [{ id: 'private-client-id', name: 'Client' }],
    studio_review_journeys: [], studio_findings: [], studio_finding_journeys: [], studio_review_assumptions: [],
    studio_review_client_access: [{ id: 'private-access-id', review_id: 'private-review-id', code_hash: hash, is_active: true }],
  };
  const touched = [];
  const fake = { from(table) {
    touched.push(table);
    let result = rows[table] ?? []; let columns; let single = false;
    const query = {
      select(value) { columns = value.split(',').map(column => column.trim()); return query; },
      eq(column, value) { result = result.filter(item => item[column] === value); return query; },
      in(column, values) { result = result.filter(item => values.includes(item[column])); return query; },
      order() { return query; }, maybeSingle() { single = true; return query; },
      then(resolve) { const data = result.map(item => row(table, item, columns)); return Promise.resolve({ data: single ? data[0] ?? null : data, error: null }).then(resolve); },
    };
    return query;
  } };
  const exports = {};
  const source = fs.readFileSync(path.join(root, 'src/lib/public-product-review.ts'), 'utf8');
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
    exports, require(name) {
      if (name === 'server-only') return {};
      if (name === 'react') return { cache: fn => fn };
      if (name === '@/lib/supabase-admin') return { getSupabaseAdmin: () => fake };
      throw new Error(`Unexpected import: ${name}`);
    },
  });
  const serialized = JSON.stringify(await exports.getPublicProductReview('PR-2026-001'));
  assert.ok(serialized.includes('PR-2026-001'));
  assert.ok(!touched.includes('studio_review_client_access'));
  assert.doesNotMatch(serialized, /private|commercial|engagement|pilot|10000|scrypt|code_hash/i);
  assert.ok(!serialized.includes(hash));
});

test('code and hash never appear in client responses, cookies, Studio state or rendered report data', async () => {
  const issued = await issue();
  const hash = tables.studio_review_client_access[0].code_hash;
  assert.match(hash, /^scrypt\$16384\$8\$1\$/);
  assert.ok(!hash.includes(issued.code) && !hash.includes(issued.code.replace(/-/g, '')));
  // The Studio response carries the plaintext exactly once, and never the hash or row ids.
  assert.doesNotMatch(JSON.stringify(issued), /scrypt|code_hash|review_id|11111111-/);
  const { body } = await unlock('PR-2026-001', issued.code);
  const cookie = jar.get(access.REVIEW_ACCESS_COOKIE);
  const state = await access.getReviewAccessState(REVIEW_A);
  studioAdmin = false;
  const rendered = JSON.stringify([await detailedPage.default(params('PR-2026-001')), await plainPage.default(params('PR-2026-001'))]);
  for (const output of [JSON.stringify(body), cookie, JSON.stringify(state), rendered]) {
    assert.ok(!output.includes(hash));
    assert.ok(!output.includes(issued.code) && !output.includes(issued.code.replace(/-/g, '')));
    assert.doesNotMatch(output, /scrypt|11111111-1111/);
  }
  // Studio state reads never select the hash.
  assert.ok(queries.filter(query => query.table === 'studio_review_client_access' && !query.columns.includes('code_hash')).length > 0);
});

// 11
test('reset invalidates the previous code and every session issued under it', async () => {
  const first = await issue();
  await unlock('PR-2026-001', first.code);
  const oldSession = jar.get(access.REVIEW_ACCESS_COOKIE);
  await assertAllowed('PR-2026-001');
  const second = await issue();
  assert.notEqual(second.code, first.code);
  assert.equal(tables.studio_review_client_access.length, 1);
  jar.set(access.REVIEW_ACCESS_COOKIE, oldSession);
  await assertDenied('PR-2026-001');
  assert.equal((await unlock('PR-2026-001', first.code)).response.status, 401);
  assert.equal((await unlock('PR-2026-001', second.code)).response.status, 200);
  await assertAllowed('PR-2026-001');
});

test('reset reactivates revoked access with a new code', async () => {
  await issue();
  studioAdmin = true; await studioRequest(REVIEW_A, { action: 'revoke' }); studioAdmin = false;
  const { code, state } = await issue();
  assert.equal(state.status, 'active');
  assert.equal((await unlock('PR-2026-001', code)).response.status, 200);
});

test('Studio access management requires Studio auth, the Studio origin and a valid request', async () => {
  assert.equal((await studioRequest(REVIEW_A, { action: 'reset', expiresInDays: 90 })).status, 401);
  studioAdmin = true;
  assert.equal((await studioRequest(REVIEW_A, { action: 'reset', expiresInDays: 90 }, { origin: 'https://evil.test' })).status, 403);
  assert.equal((await studioRequest('not-a-uuid', { action: 'revoke' })).status, 400);
  assert.equal((await studioRequest(REVIEW_A, { action: 'reset', expiresInDays: 7 })).status, 400);
  assert.equal((await studioRequest(REVIEW_A, { action: 'reset', expiresInDays: 90, code: 'CHOSEN' })).status, 400);
  assert.equal((await studioRequest('44444444-4444-4444-8444-444444444444', { action: 'revoke' })).status, 404);
  assert.equal(tables.studio_review_client_access.length, 0);
});

test('codes can only be issued for reviews eligible for client access', async () => {
  studioAdmin = true;
  const response = await studioRequest(REVIEW_DRAFT, { action: 'reset', expiresInDays: null });
  assert.equal(response.status, 409);
  assert.equal(tables.studio_review_client_access.length, 0);
});

test('a review that stops being eligible cannot be unlocked', async () => {
  const { code } = await issue(REVIEW_B);
  eligible.delete('PR-2026-002');
  try { assert.equal((await unlock('PR-2026-002', code)).response.status, 401); }
  finally { eligible.add('PR-2026-002'); }
});

test('unlock rejects cross-origin requests and is rate limited', async () => {
  const { code } = await issue();
  assert.equal((await unlockRoute.POST(unlockRequest({ reference: 'PR-2026-001', code }, { origin: 'https://evil.test' }))).status, 403);
  assert.equal((await unlockRoute.POST(unlockRequest({ reference: 'PR-2026-001', code }, { 'sec-fetch-site': 'cross-site' }))).status, 403);
  for (let attempt = 0; attempt < 10; attempt++) await unlock('PR-2026-001', 'AAAA-AAAA-AAAA-AAAA');
  const limited = await unlock('PR-2026-001', code);
  assert.equal(limited.response.status, 429);
  assert.equal(cookieWrites.length, 0);
});

test('report routes are guarded before any lookup and remain dynamic and noindex', () => {
  for (const file of ['src/app/reviews/[reference]/page.tsx', 'src/app/reviews/[reference]/plain-language/page.tsx']) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    assert.match(source, /export const dynamic = "force-dynamic"/);
    assert.match(source, /index: false, follow: false/);
    assert.equal(source.match(/await requireReviewReportAccess\(reference\);\n\s+const (review|result) = await get/g)?.length, 2);
  }
  const config = fs.readFileSync(path.join(root, 'next.config.ts'), 'utf8');
  assert.match(config, /"\/reviews\/:path\*", "\/api\/reviews\/:path\*"[\s\S]{0,200}noindex, nofollow[\s\S]{0,200}no-store/);
  assert.doesNotMatch(fs.readFileSync(path.join(root, 'src/app/sitemap.ts'), 'utf8'), /reviews/);
});
