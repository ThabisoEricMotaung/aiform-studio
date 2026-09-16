/* eslint-disable @typescript-eslint/no-require-imports -- Node's dependency-free CommonJS test harness intercepts module loading. */
// Run: node --test tests/leora-signing.test.cjs
// Route tests use an in-memory Supabase test double; production never uses it.
// Actual database constraints/permissions are tested by the rollback-only SQL suite.
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);
const jar = new Map();
const rows = { studio_document_executions: [], studio_document_countersignatures: [] };
let insertFailure = false;
let rateAllowed = true;
const client = {
  rpc: async () => ({ data: rateAllowed, error: null }),
  from(table) {
    const matches = [];
    return {
      select() { return this; },
      eq(key, value) { matches.push([key, value]); return this; },
      async maybeSingle() { return { data: rows[table].find(row => matches.every(([key, value]) => row[key] === value)) ?? null, error: null }; },
      async single() { return this.maybeSingle(); },
      async insert(row) {
        if (insertFailure) return { error: { code: 'TEST_FAILURE' } };
        if (rows[table].some(item => item.document_id === row.document_id && item.document_version === row.document_version)) return { error: { code: '23505' } };
        rows[table].push({ ...row, signed_at: new Date().toISOString() });
        return { error: null };
      },
    };
  },
};
const originalLoad = Module._load;
Module._load = function(request, parent, isMain) {
  if (request === 'server-only') return {};
  if (request === 'next/headers') return { cookies: async () => ({ get: name => jar.has(name) ? { value: jar.get(name) } : undefined, set: (name, value) => jar.set(name, value) }) };
  if (request.endsWith('/supabase-admin') || request === './supabase-admin') return { getSupabaseAdmin: () => client };
  if (request.startsWith('@/')) request = path.join(root, 'src', request.slice(2));
  return originalLoad.call(this, request, parent, isMain);
};
const { LEORA_DOCUMENT } = require('../src/lib/leora-document.ts');
const { signingSchema } = require('../src/lib/leora-signing-schema.ts');
const server = require('../src/lib/leora-signing-server.ts');
const api = require('../src/app/api/documents/leora-group/nda/route.ts');
const session = require('../src/app/api/documents/leora-group/nda/session/route.ts');
const record = require('../src/app/api/documents/leora-group/nda/record/route.ts');
const code = crypto.randomBytes(32).toString('hex');
const origin = 'https://studio.test';
function input(overrides = {}) {
  return { documentId: LEORA_DOCUMENT.id, documentVersion: LEORA_DOCUMENT.version, documentHash: LEORA_DOCUMENT.sha256,
    name: 'TEST SIGNATORY', business: 'TEST BUSINESS', address: 'TEST ADDRESS ONLY', signingAs: 'individual', entityName: '', registrationNumber: '', capacity: '',
    signature: [[{ x: .1, y: .2 }, { x: .3, y: .7 }, { x: .8, y: .4 }]], consent: true, ...overrides };
}
function request(body, extra = {}) {
  return new Request(`${origin}/api/documents/leora-group/nda`, { method: 'POST', headers: { origin, 'content-type': 'application/json', ...extra }, body: JSON.stringify(body) });
}
test.beforeEach(() => {
  jar.clear(); Object.values(rows).forEach(list => list.splice(0)); insertFailure = false; rateAllowed = true;
  process.env.LEORA_SIGNING_ENABLED = 'true';
  process.env.LEORA_SIGNING_CODE_SHA256 = crypto.createHash('sha256').update(code).digest('hex');
  process.env.DOCUMENT_SIGNING_SESSION_SECRET = crypto.randomBytes(32).toString('hex');
  process.env.LEORA_SIGNING_EXPIRES_AT = new Date(Date.now() + 86400000).toISOString();
});
async function authenticate() {
  const response = await session.POST(request({ code }));
  assert.equal(response.status, 200);
}
test('validates individual and registered-company details', () => {
  assert.equal(signingSchema.safeParse(input()).success, true);
  assert.equal(signingSchema.safeParse(input({ signingAs: 'company' })).success, false);
  assert.equal(signingSchema.safeParse(input({ signingAs: 'company', entityName: 'TEST ENTITY', registrationNumber: 'TEST REG', capacity: 'Director' })).success, true);
});
test('rejects no consent, blank signatures, invalid coordinates, oversized strokes, and altered version/hash', () => {
  for (const patch of [{ consent: false }, { signature: [] }, { signature: [[{x:.2,y:.2},{x:.2,y:.2}]] },
    { signature: [[{x:2,y:0},{x:0,y:1}]] }, { signature: Array(81).fill([{x:0,y:0},{x:1,y:1}]) },
    { documentHash: 'f'.repeat(64) }, { documentVersion: 'altered' }, { extra: 'unexpected' }]) {
    assert.equal(signingSchema.safeParse(input(patch)).success, false);
  }
});
test('no public access to details, records, or submissions', async () => {
  assert.equal((await api.GET()).status, 401);
  assert.equal((await record.GET()).status, 401);
  assert.equal((await api.POST(request(input()))).status, 401);
  assert.equal(rows.studio_document_executions.length, 0);
});
test('cross-origin requests, bad codes, expired invitations, and forged sessions fail closed', async () => {
  assert.equal((await session.POST(request({ code }, { origin: 'https://other.test' }))).status, 403);
  assert.equal((await session.POST(request({ code: 'wrong'.repeat(12) }))).status, 401);
  jar.set(server.SESSION_COOKIE, `${Date.now() + 60000}.${'a'.repeat(64)}`);
  assert.equal((await api.GET()).status, 401);
  process.env.LEORA_SIGNING_EXPIRES_AT = new Date(Date.now() - 1).toISOString();
  assert.equal((await session.POST(request({ code }))).status, 503);
});
test('disabled signing does not fabricate success', async () => {
  process.env.LEORA_SIGNING_ENABLED = 'false';
  assert.equal((await session.POST(request({ code }))).status, 503);
  assert.equal((await api.POST(request(input()))).status, 503);
});
test('rate limit and streaming body size bounds are enforced', async () => {
  rateAllowed = false;
  assert.equal((await session.POST(request({ code }))).status, 429);
  rateAllowed = true;
  await authenticate();
  assert.equal((await api.POST(request({ junk: 'a'.repeat(300001) }))).status, 413);
});
test('successful submission records server timestamp, PDF snapshot, consent, private signature, and awaits countersignature', async () => {
  await authenticate();
  const response = await api.POST(request(input()));
  assert.equal(response.status, 201);
  assert.match(response.headers.get('x-robots-tag'), /noindex/);
  assert.match(response.headers.get('cache-control'), /no-store/);
  const { receipt } = await response.json();
  assert.equal(receipt.status, 'awaiting_countersignature');
  assert.equal(receipt.signatory, 'TEST SIGNATORY');
  const stored = rows.studio_document_executions[0];
  assert.equal(crypto.createHash('sha256').update(Buffer.from(stored.issued_pdf_base64, 'base64')).digest('hex'), LEORA_DOCUMENT.sha256);
  assert.ok(stored.consent_text.includes('authorised'));
  assert.equal(rows.studio_document_countersignatures.length, 0);
  assert.ok(stored.signed_at);
  const download = await record.GET();
  assert.equal(download.status, 200);
  assert.match(download.headers.get('content-disposition'), /execution.json/);
  assert.ok((await download.json()).execution.signature);
});
test('retry and concurrent requests never overwrite or duplicate a signed record', async () => {
  await authenticate();
  const responses = await Promise.all([api.POST(request(input())), api.POST(request(input()))]);
  assert.ok(responses.every(response => [200,201].includes(response.status)));
  assert.equal(rows.studio_document_executions.length, 1);
  const response = await api.POST(request(input({ name: 'CHANGED NAME' })));
  assert.equal((await response.json()).receipt.signatory, 'TEST SIGNATORY');
});
test('failed persistence never shows a completion receipt', async () => {
  await authenticate(); insertFailure = true;
  const response = await api.POST(request(input()));
  assert.equal(response.status, 503);
  assert.equal((await response.json()).receipt, undefined);
  assert.equal(rows.studio_document_executions.length, 0);
});
test('fully executed is derived only from separate countersignature evidence', async () => {
  await authenticate(); await api.POST(request(input()));
  rows.studio_document_countersignatures.push({ id: crypto.randomUUID(), execution_id: rows.studio_document_executions[0].id });
  assert.equal((await (await api.GET()).json()).receipt.status, 'fully_executed');
});
test('rotating the signing code invalidates existing sessions', async () => {
  await authenticate();
  process.env.LEORA_SIGNING_CODE_SHA256 = 'b'.repeat(64);
  assert.equal((await api.GET()).status, 401);
});
