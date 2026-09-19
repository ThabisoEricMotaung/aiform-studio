/* eslint-disable @typescript-eslint/no-require-imports -- Node's dependency-free CommonJS test harness intercepts module loading. */
// Run: node --test tests/studio-countersign.test.cjs
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
        if (rows[table].some(item => item.document_id === row.document_id && item.document_version === row.document_version && (table !== 'studio_document_countersignatures' || item.execution_id === row.execution_id))
          || (table === 'studio_document_countersignatures' && rows[table].some(item => item.execution_id === row.execution_id))) {
          return { error: { code: '23505' } };
        }
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
const { LEORA_DOCUMENT, STUDIO_COUNTERSIGNATORY } = require('../src/lib/leora-document.ts');
const server = require('../src/lib/leora-signing-server.ts');
const studioServer = require('../src/lib/studio-countersign-server.ts');
const nda = require('../src/app/api/documents/leora-group/nda/route.ts');
const ndaSession = require('../src/app/api/documents/leora-group/nda/session/route.ts');
const executed = require('../src/app/api/documents/leora-group/nda/executed/route.ts');
const countersign = require('../src/app/api/documents/leora-group/nda/countersign/route.ts');
const countersignSession = require('../src/app/api/documents/leora-group/nda/countersign/session/route.ts');
const countersignDocument = require('../src/app/api/documents/leora-group/nda/countersign/document/route.ts');
const countersignExecuted = require('../src/app/api/documents/leora-group/nda/countersign/executed/route.ts');

const clientCode = crypto.randomBytes(32).toString('hex');
const studioCode = crypto.randomBytes(32).toString('hex');
const origin = 'https://studio.test';
function ndaInput(overrides = {}) {
  return { documentId: LEORA_DOCUMENT.id, documentVersion: LEORA_DOCUMENT.version, documentHash: LEORA_DOCUMENT.sha256,
    name: 'TEST SIGNATORY', business: 'TEST BUSINESS', address: 'TEST ADDRESS ONLY', signingAs: 'individual', entityName: '', registrationNumber: '', capacity: '',
    signature: [[{ x: .1, y: .2 }, { x: .3, y: .7 }, { x: .8, y: .4 }]], consent: true, ...overrides };
}
function req(url, body, extra = {}) {
  return new Request(`${origin}${url}`, { method: 'POST', headers: { origin, 'content-type': 'application/json', ...extra }, body: JSON.stringify(body) });
}
test.beforeEach(() => {
  jar.clear(); Object.values(rows).forEach(list => list.splice(0)); rateAllowed = true;
  process.env.LEORA_SIGNING_ENABLED = 'true';
  process.env.LEORA_SIGNING_CODE_SHA256 = crypto.createHash('sha256').update(clientCode).digest('hex');
  process.env.DOCUMENT_SIGNING_SESSION_SECRET = crypto.randomBytes(32).toString('hex');
  process.env.LEORA_SIGNING_EXPIRES_AT = new Date(Date.now() + 86400000).toISOString();
  process.env.STUDIO_COUNTERSIGN_ENABLED = 'true';
  process.env.STUDIO_COUNTERSIGN_CODE_SHA256 = crypto.createHash('sha256').update(studioCode).digest('hex');
  process.env.STUDIO_COUNTERSIGN_SESSION_SECRET = crypto.randomBytes(32).toString('hex');
});
async function authenticateClient() {
  const response = await ndaSession.POST(req('/api/documents/leora-group/nda/session', { code: clientCode }));
  assert.equal(response.status, 200);
}
async function authenticateStudio() {
  const response = await countersignSession.POST(req('/api/documents/leora-group/nda/countersign/session', { code: studioCode }));
  assert.equal(response.status, 200);
}
function countersignInput(overrides = {}) {
  const execution = rows.studio_document_executions[0];
  return { documentId: LEORA_DOCUMENT.id, documentVersion: LEORA_DOCUMENT.version, documentHash: LEORA_DOCUMENT.sha256,
    executionId: execution?.id, signatoryName: STUDIO_COUNTERSIGNATORY.name, capacity: STUDIO_COUNTERSIGNATORY.capacity,
    signature: [[{ x: .2, y: .3 }, { x: .5, y: .6 }, { x: .7, y: .2 }]], consent: true, ...overrides };
}

test('Studio countersigning requires its own authentication, separate from the client code', async () => {
  assert.equal((await countersign.GET()).status, 401);
  assert.equal((await countersign.POST(req('/api/documents/leora-group/nda/countersign', countersignInput()))).status, 401);
  // The client's valid signing-code session must not satisfy the Studio check.
  await authenticateClient();
  assert.equal((await countersign.GET()).status, 401);
  assert.equal((await ndaSession.POST(req('/api/documents/leora-group/nda/session', { code: studioCode }))).status, 401);
});

test('cross-origin and wrong-code Studio session requests fail closed', async () => {
  assert.equal((await countersignSession.POST(req('/api/documents/leora-group/nda/countersign/session', { code: studioCode }, { origin: 'https://other.test' }))).status, 403);
  assert.equal((await countersignSession.POST(req('/api/documents/leora-group/nda/countersign/session', { code: 'wrong'.repeat(12) }))).status, 401);
});

test('a Studio session cannot access the client signing flow, and vice versa', async () => {
  await authenticateStudio();
  assert.equal((await nda.GET()).status, 401);
  jar.clear();
  await authenticateClient();
  assert.equal((await countersign.GET()).status, 401);
});

test('Studio cannot countersign before the client has signed', async () => {
  await authenticateStudio();
  const { execution } = await (await countersign.GET()).json();
  assert.equal(execution, null);
  assert.equal((await countersign.POST(req('/api/documents/leora-group/nda/countersign', countersignInput({ executionId: crypto.randomUUID() })))).status, 409);
});

test('countersignature requires actual signature ink and explicit consent', async () => {
  await authenticateClient(); await nda.POST(req('/api/documents/leora-group/nda', ndaInput()));
  await authenticateStudio();
  assert.equal((await countersign.POST(req('/api/documents/leora-group/nda/countersign', countersignInput({ signature: [] })))).status, 400);
  assert.equal((await countersign.POST(req('/api/documents/leora-group/nda/countersign', countersignInput({ signature: [[{ x: .2, y: .2 }, { x: .2, y: .2 }]] })))).status, 400);
  assert.equal((await countersign.POST(req('/api/documents/leora-group/nda/countersign', countersignInput({ consent: false })))).status, 400);
  assert.equal(rows.studio_document_countersignatures.length, 0);
});

test('countersigning requires the confirmed name and capacity; anything else is rejected', async () => {
  await authenticateClient(); await nda.POST(req('/api/documents/leora-group/nda', ndaInput()));
  await authenticateStudio();
  assert.equal((await countersign.POST(req('/api/documents/leora-group/nda/countersign', countersignInput({ signatoryName: 'Someone Else' })))).status, 400);
  assert.equal((await countersign.POST(req('/api/documents/leora-group/nda/countersign', countersignInput({ capacity: 'CEO' })))).status, 400);
});

test('a valid countersignature makes the execution fully executed, and duplicates are rejected', async () => {
  await authenticateClient(); await nda.POST(req('/api/documents/leora-group/nda', ndaInput()));
  await authenticateStudio();
  const response = await countersign.POST(req('/api/documents/leora-group/nda/countersign', countersignInput()));
  assert.equal(response.status, 201);
  const { execution } = await response.json();
  assert.equal(execution.alreadyCountersigned, true);
  assert.equal(rows.studio_document_countersignatures.length, 1);
  assert.equal(rows.studio_document_countersignatures[0].signatory_name, STUDIO_COUNTERSIGNATORY.name);
  assert.ok(rows.studio_document_countersignatures[0].signature_hash);
  assert.ok(rows.studio_document_countersignatures[0].consent_text.includes('Registration'));

  // Client's own status view now reports fully executed.
  jar.clear(); await authenticateClient();
  const receipt = (await (await nda.GET()).json()).receipt;
  assert.equal(receipt.status, 'fully_executed');

  // A second countersignature attempt is rejected.
  jar.clear(); await authenticateStudio();
  const duplicate = await countersign.POST(req('/api/documents/leora-group/nda/countersign', countersignInput()));
  assert.equal(duplicate.status, 409);
  assert.equal(rows.studio_document_countersignatures.length, 1);
});

test('the fully executed PDF is only available after countersignature evidence exists, to both parties, via authenticated routes with no query parameters', async () => {
  await authenticateClient();
  assert.equal((await executed.GET()).status, 409);
  await nda.POST(req('/api/documents/leora-group/nda', ndaInput()));
  jar.clear(); await authenticateStudio();
  assert.equal((await countersignExecuted.GET()).status, 409);
  await countersign.POST(req('/api/documents/leora-group/nda/countersign', countersignInput()));

  const studioPdf = await countersignExecuted.GET();
  assert.equal(studioPdf.status, 200);
  assert.equal(studioPdf.headers.get('content-type'), 'application/pdf');
  const studioBytes = Buffer.from(await studioPdf.arrayBuffer());
  assert.ok(studioBytes.length > 0);

  jar.clear(); await authenticateClient();
  const clientPdf = await executed.GET();
  assert.equal(clientPdf.status, 200);
  const clientBytes = Buffer.from(await clientPdf.arrayBuffer());
  assert.deepEqual(clientBytes, studioBytes);
  const original = fs.readFileSync(path.join(root, 'public', LEORA_DOCUMENT.pdfPath));
  assert.equal(crypto.createHash('sha256').update(original).digest('hex'), LEORA_DOCUMENT.sha256);
  const { PDFDocument } = require('pdf-lib');
  const originalPages = (await PDFDocument.load(original)).getPageCount();
  const executedPages = (await PDFDocument.load(clientBytes)).getPageCount();
  assert.equal(executedPages, originalPages + 1, 'the executed PDF appends exactly one certificate page to the original');
});

test('the Studio review PDF route requires the Studio session, not the client one', async () => {
  assert.equal((await countersignDocument.GET()).status, 401);
  await authenticateClient();
  assert.equal((await countersignDocument.GET()).status, 401);
  jar.clear(); await authenticateStudio();
  assert.equal((await countersignDocument.GET()).status, 200);
});

test('rotating the Studio code invalidates existing Studio sessions without touching the client flow', async () => {
  await authenticateClient(); await nda.POST(req('/api/documents/leora-group/nda', ndaInput()));
  jar.clear(); await authenticateStudio();
  process.env.STUDIO_COUNTERSIGN_CODE_SHA256 = 'b'.repeat(64);
  assert.equal((await countersign.GET()).status, 401);
  jar.clear(); await authenticateClient();
  assert.equal((await nda.GET()).status, 200);
});

test('Studio countersigning is disabled independently of client signing', async () => {
  process.env.STUDIO_COUNTERSIGN_ENABLED = 'false';
  assert.equal((await countersignSession.POST(req('/api/documents/leora-group/nda/countersign/session', { code: studioCode }))).status, 503);
  assert.equal((await ndaSession.POST(req('/api/documents/leora-group/nda/session', { code: clientCode }))).status, 200);
});
void server; void studioServer;
