/* eslint-disable @typescript-eslint/no-require-imports -- Isolated server-module test harness. */
// Run: node --test tests/pre-meeting-product-review.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const crypto = require('node:crypto');

const canonical = { reference: 'PR-2026-002', version: 1, status: 'issued', findings: Array.from({ length: 12 }, (_, i) => ({ title: `R-${String(i + 1).padStart(2, '0')}` })) };
function load(review, approveFixture = false) {
  let source = fs.readFileSync(path.join(__dirname, '../src/lib/pre-meeting-product-review.ts'), 'utf8');
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
  return exports;
}

test('only PR-2026-002 requires the reviewed report; PR-2026-001 keeps its existing rendering', () => {
  const { requiresPreMeetingReport } = load(canonical, true);
  assert.equal(requiresPreMeetingReport('PR-2026-002'), true);
  assert.equal(requiresPreMeetingReport('PR-2026-001'), false);
  assert.equal(requiresPreMeetingReport('pr-2026-002'), false);
});

test('missing/ineligible references and changed source content fail closed', async () => {
  assert.equal(await load(null, true).getPreMeetingProductReview('PR-2026-002'), null);
  assert.equal(await load(canonical, true).getPreMeetingProductReview('PR-2026-001'), null);
  assert.equal(await load(canonical).getPreMeetingProductReview('PR-2026-002'), null);
  assert.equal(await load({ ...canonical, version: 2 }, true).getPreMeetingProductReview('PR-2026-002'), null);
  assert.equal(await load({ ...canonical, findings: canonical.findings.slice(1) }, true).getPreMeetingProductReview('PR-2026-002'), null);
});

test('report copy carries the supplied reference, sections and all twelve findings', async () => {
  const result = await load(canonical, true).getPreMeetingProductReview('PR-2026-002');
  const { copy } = result;
  assert.equal(result.review, canonical);
  assert.equal(copy.title, 'Credit Builder Flow — Pre-Meeting Website Review');
  assert.equal(copy.preparedFor, 'Kea / Volve Media');
  assert.equal(copy.date, '10 October 2026');
  assert.equal(copy.engagement, 'Complimentary');
  assert.equal(copy.website, 'https://recovery.creditbuilderflow.co.za/');
  assert.equal(copy.executive.length, 2);
  assert.deepEqual([...copy.actions.map(group => group.horizon)], ['Now', 'Next', 'Investigate']);
  assert.equal(copy.clarifications.length, 8);
  assert.deepEqual([...copy.journey.map(item => item.stage)], ['Entry', 'Understanding', 'Evidence', 'Objections', 'Action']);
  assert.equal(copy.perspectives.length, 2);
  assert.equal(copy.findings.length, 12);
  copy.findings.forEach((finding, index) => {
    assert.equal(finding.reference, `R-${String(index + 1).padStart(2, '0')}`);
    for (const field of ['title', 'priority', 'horizon', 'basis', 'confidence', 'recommendation']) assert(finding[field].length > 0);
    assert(['Critical', 'Important', 'Opportunity', 'Observation'].includes(finding.priority));
  });
  assert(!copy.findings.some(finding => finding.priority === 'Critical'));
  assert.equal(copy.improvements.length, 2);
  assert.deepEqual([...copy.coverage.map(group => group.title)], ['Testing completed', 'Supplementary evidence', 'Review boundaries']);
  assert.equal(copy.questions.length, 4);
  assert.deepEqual([...copy.sequence.map(item => item.step)], ['First', 'Second', 'Third']);
});

test('observed behaviour, client statements and inferred consequences stay distinct and are not strengthened', async () => {
  const { copy } = (await load(canonical, true).getPreMeetingProductReview('PR-2026-002'));
  const byRef = Object.fromEntries(copy.findings.map(finding => [finding.reference, finding]));
  // R-01 is a client clarification, not an observed defect.
  assert.equal(byRef['R-01'].observed, undefined);
  assert.match(byRef['R-01'].clarification, /not an accidental naming defect/);
  // Findings without a client statement carry no clarification.
  for (const ref of ['R-05', 'R-09', 'R-10', 'R-11', 'R-12']) assert.equal(byRef[ref].clarification, undefined);
  assert.match(byRef['R-02'].clarification, /Exact milestone mapping remains unconfirmed/);
  assert.match(byRef['R-03'].clarification, /precise interval remains unidentified/);
  assert.match(byRef['R-04'].clarification, /does not establish lender approval or delivery/);
  assert.match(byRef['R-05'].recommendation, /16,883 ÷ 17,500 is approximately 96\.5%/);
  assert.match(byRef['R-05'].recommendation, /\(4,265 \+ 2,735\) ÷ 17,500 is 40%/);
  assert.match(byRef['R-09'].recommendation, /not independent measurements/);
  assert.equal(byRef['R-11'].note, 'No missing consent or POPIA violation is established.');
  assert.equal(byRef['R-12'].note, 'This report makes no legal determination.');
  assert.match(copy.findingsNote, /analytical inferences, not measured customer responses/);
  assert.match(copy.perspectivesNote, /not interviews, actual customer testimony or measured behaviour/);
  assert.match(copy.executive[1], /No Critical defect was established/);
  const clarifications = copy.clarifications.join(' ');
  assert.match(clarifications, /client-reported terms, not a verified published tariff/);
  assert.match(clarifications, /must not be attributed to this product/);
  assert.match(clarifications, /were not independently verified/);
  const boundaries = copy.coverage.flatMap(group => group.items).join(' ');
  for (const topic of ['Schedule Event was not pressed', 'not independently reproduced mobile tests', 'Agreement between models is not verification', 'No lost sales or conversion effects were measured', 'penetration test'])
    assert(boundaries.includes(topic), topic);
  assert.match(copy.status, /does not establish client approval/);
});

test('copy excludes private operational fields', async () => {
  const { copy } = await load(canonical, true).getPreMeetingProductReview('PR-2026-002');
  assert(!/commercial_value|commercial_notes|engagement_type|time_spent|\/studio\/|[0-9a-f]{8}-[0-9a-f]{4}-/.test(JSON.stringify(copy)));
});

test('production fingerprint is pinned, not the unreviewed placeholder', () => {
  const source = fs.readFileSync(path.join(__dirname, '../src/lib/pre-meeting-product-review.ts'), 'utf8');
  const [, hash] = source.match(/sourceHash: "([a-f0-9]{64})"/) ?? [];
  assert.ok(hash);
  assert.notEqual(hash, '0'.repeat(64));
});
