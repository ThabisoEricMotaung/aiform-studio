/* eslint-disable @typescript-eslint/no-require-imports -- Isolated server-module test harness. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const crypto = require('node:crypto');

const canonical = { reference: 'PR-2026-001', version: 1, status: 'issued', findings: Array.from({ length: 7 }, (_, i) => ({ title: `F-00${i + 1}` })) };
function load(review, approveFixture = false) {
  let source = fs.readFileSync(path.join(__dirname, '../src/lib/plain-language-product-review.ts'), 'utf8');
  // Approve only the test fixture, without changing production's source fingerprint.
  if (approveFixture) source = source.replace(/sourceHash: "[a-f0-9]+"/, `sourceHash: "${crypto.createHash('sha256').update(JSON.stringify(canonical)).digest('hex')}"`);
  const exports = {};
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
    exports, require(name) {
      if (name === 'server-only') return {};
      if (name === 'node:crypto') return crypto;
      if (name === 'react') return { cache: fn => fn };
      if (name === '@/lib/public-product-review') return { getPublicProductReview: async () => review };
      throw new Error(`Unexpected dependency ${name}`);
    },
  });
  return exports.getPlainLanguageProductReview;
}

test('missing/ineligible references and changed source content fail closed', async () => {
  assert.equal(await load(null)('PR-2026-001'), null);
  assert.equal(await load(canonical, true)('PR-2026-002'), null);
  assert.equal(await load(canonical)('PR-2026-001'), null);
  assert.equal(await load({ ...canonical, version: 2 }, true)('PR-2026-001'), null);
  assert.equal(await load({ ...canonical, limitations: 'Changed limitation' }, true)('PR-2026-001'), null);
});

test('editorial copy covers all findings, assumptions and limitations', async () => {
  const result = await load(canonical, true)('PR-2026-001');
  const { copy } = result;
  assert.equal(result.review, canonical);
  assert.equal(copy.findings.length, 7);
  copy.findings.forEach((finding, index) => {
    assert.equal(finding.reference, `F-00${index + 1}`);
    for (const field of ['title', 'priority', 'found', 'matters', 'action', 'known']) assert(finding[field].length > 0);
  });
  assert.equal(copy.assumptions.length, 6);
  assert.equal(copy.limitations.length, 9);
  const limits = copy.limitations.join(' ');
  for (const topic of ['successful booking', 'partly completed', 'WhatsApp', 'mobile', 'database', 'source code', 'security testing', 'POPIA', 'caused the session', 'real people']) assert(limits.includes(topic));
});

test('copy preserves the critical uncertainty and excludes private operational fields', async () => {
  const { copy } = await load(canonical, true)('PR-2026-001');
  assert.match(copy.findings[0].matters, /does not establish a POPIA violation/);
  assert.match(copy.findings[1].action, /no evidence here to call it a data leak/);
  assert.match(copy.findings[2].found, /calculations we tested were correct/);
  assert.match(copy.findings[4].known, /Seen once; needs confirmation/);
  assert.match(copy.findings[4].known, /cause has not been established/);
  assert.match(copy.findings[5].action, /before changing the animations/);
  assert(!/commercial_value|commercial_notes|engagement_type|Estimated, not billed|\/studio\//.test(JSON.stringify(copy)));
});
