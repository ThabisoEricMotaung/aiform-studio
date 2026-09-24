/* eslint-disable @typescript-eslint/no-require-imports -- Isolated server-module test harness. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const path = require('node:path');

function fixture() {
  return {
    studio_reviews: [{ id: 'private-review-id', product_id: 'private-product-id', reference: 'PR-2026-001', status: 'completed', review_question: 'Question', scope: 'Scope', environment: 'Desktop', start_date: '2026-09-21', end_date: '2026-09-21', limitations: 'Limitations', notes: 'PRIVATE PREAMBLE\nRECOMMENDED DIRECTION\nApproved direction\nINTERNAL NOTES\nPRIVATE OPERATIONS\nPOSITIVE OBSERVATIONS\nApproved positives\nWHAT TO LEAVE ALONE\nApproved preservation', commercial_notes: 'PRIVATE COMMERCIAL', commercial_value_amount: 12345, engagement_type: 'pilot' }],
    studio_reports: [{ review_id: 'private-review-id', version: 1, status: 'issued', notes: 'PRIVATE REPORT NOTES' }],
    studio_products: [{ id: 'private-product-id', client_id: 'private-client-id', name: 'Product' }],
    studio_clients: [{ id: 'private-client-id', name: 'Client' }],
    studio_review_journeys: [{ id: 'private-journey-id', review_id: 'private-review-id', name: 'J01 Journey' }],
    studio_findings: ['confirmed', 'draft', 'archived'].map(status => ({ id: `private-${status}-id`, review_id: 'private-review-id', status, title: `${status} finding`, lens: 'Experience', classification: 'Important', horizon: 'Next', observation: 'Observation', consequence: 'Consequence', recommendation: 'Recommendation', evidence_status: 'Observed', confidence: 'High' })),
    studio_finding_journeys: [{ finding_id: 'private-confirmed-id', journey_id: 'private-journey-id' }],
    studio_review_assumptions: [{ review_id: 'private-review-id', reference: 'A01', statement: 'Assumption', status: 'Needs validation', confidence: 'Medium' }],
  };
}

function load(rows, failTable) {
  const calls = [];
  const db = { from(table) {
    calls.push(table);
    assert.notEqual(table, 'studio_evidence');
    let result = rows[table] ?? [];
    let columns;
    let single = false;
    const query = {
      select(value) {
        assert(!value.includes('*'));
        assert(!/commercial|engagement_type|time_spent/.test(value));
        columns = value.split(',').map(column => column.trim()); return query;
      },
      eq(column, value) { result = result.filter(row => row[column] === value); return query; },
      in(column, values) { result = result.filter(row => values.includes(row[column])); return query; },
      order() { return query; },
      maybeSingle() { single = true; return query; },
      then(resolve, reject) {
        const selected = result.map(row => Object.fromEntries(columns.map(column => [column, row[column]])));
        return Promise.resolve({ data: single ? selected[0] ?? null : selected, error: table === failTable ? new Error('PRIVATE ERROR') : null }).then(resolve, reject);
      },
    };
    return query;
  } };
  const exports = {};
  const source = fs.readFileSync(path.join(__dirname, '../src/lib/public-product-review.ts'), 'utf8');
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
    exports,
    require(name) {
      if (name === 'server-only') return {};
      if (name === 'react') return { cache: fn => fn };
      if (name === '@/lib/supabase-admin') return { getSupabaseAdmin: () => db };
      throw new Error(`Unexpected import: ${name}`);
    },
  });
  return { get: exports.getPublicProductReview, calls };
}

test('public projection excludes private fields, IDs, unapproved notes, draft findings and raw evidence', async () => {
  const { get } = load(fixture());
  const report = await get('PR-2026-001');
  const serialized = JSON.stringify(report);
  assert(!/private|commercial|engagement|created_at|draft|archived/i.test(serialized));
  assert.equal(report.direction.length, 3);
  assert.equal(report.direction[0].body, 'Approved direction');
  assert.equal(report.findings.length, 1);
  assert.equal(report.findings[0].journeys[0], 'J01 Journey');
});

test('unknown references never query the database', async () => {
  const { get, calls } = load(fixture());
  assert.equal(await get('PR-2026-002'), null);
  assert.equal(await get('toString'), null);
  assert.equal(calls.length, 0);
});

test('missing, incomplete, draft, superseded or unapproved report versions are unavailable', async () => {
  for (const scenario of ['missing', 'incomplete', 'draft', 'superseded', 'version']) {
    const rows = fixture();
    if (scenario === 'missing') rows.studio_reviews = [];
    if (scenario === 'incomplete') rows.studio_reviews[0].status = 'in_progress';
    if (scenario === 'draft' || scenario === 'superseded') rows.studio_reports[0].status = scenario;
    if (scenario === 'version') rows.studio_reports[0].version = 2;
    assert.equal(await load(rows).get('PR-2026-001'), null);
  }
});

test('unlabelled and duplicate-labelled notes never fall back to public raw notes', async () => {
  for (const notes of ['PRIVATE NOTES', 'RECOMMENDED DIRECTION\nOne\nRECOMMENDED DIRECTION\nTwo', null]) {
    const rows = fixture(); rows.studio_reviews[0].notes = notes;
    assert.equal((await load(rows).get('PR-2026-001')).direction.length, 0);
  }
});

test('database failures fail closed without forwarding database error details', async () => {
  await assert.rejects(load(fixture(), 'studio_findings').get('PR-2026-001'), { message: 'Unable to load the issued review.' });
});
