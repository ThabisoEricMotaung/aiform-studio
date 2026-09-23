-- One-time data ingestion for Product Review PR-2026-001 (Volve Media /
-- Executive Decision Portal / Credit Builder Flow). No DDL: this file only
-- inserts rows into the existing Product Reviews schema and is idempotent
-- — if studio_reviews.reference = 'PR-2026-001' already exists, the guard
-- at the top aborts the whole transaction before touching anything,
-- including the client/product lookups.

begin;

do $$
declare
  v_client_id uuid;
  v_product_id uuid;
  v_review_id uuid;
  v_j01 uuid; v_j02 uuid; v_j03 uuid; v_j04 uuid; v_j05 uuid; v_j06 uuid; v_j07 uuid;
  v_f001 uuid; v_f002 uuid; v_f003 uuid; v_f004 uuid; v_f005 uuid; v_f006 uuid; v_f007 uuid;
begin
  -- Review guard: abort visibly if PR-2026-001 already exists. No insert/update/delete follows.
  select id into v_review_id from public.studio_reviews where reference = 'PR-2026-001';
  if v_review_id is not null then
    raise exception 'ABORT: studio_reviews.reference = PR-2026-001 already exists (id=%). No rows were inserted, updated or deleted.', v_review_id;
  end if;

  -- Client: reuse if present (case-insensitive), else create. No update to an existing row.
  select id into v_client_id from public.studio_clients where lower(name) = lower('Volve Media');
  if v_client_id is null then
    insert into public.studio_clients (name) values ('Volve Media') returning id into v_client_id;
  end if;

  -- Product: reuse if present under this client, else create. No update to an existing row.
  select id into v_product_id from public.studio_products
    where client_id = v_client_id and lower(name) = lower('Executive Decision Portal / Credit Builder Flow');
  if v_product_id is null then
    insert into public.studio_products (client_id, name, description) values (
      v_client_id,
      'Executive Decision Portal / Credit Builder Flow',
      'A personalised six-step dealership decision journey: Scope → Solution → Case Studies & Timelines → Risk & Protection → Revenue & ROI → Agreement & Onboarding.'
    ) returning id into v_product_id;
  end if;

  insert into public.studio_reviews (
    reference, product_id, review_question, status, engagement_type, scope, environment,
    start_date, end_date, time_spent_minutes,
    commercial_value_amount, commercial_value_currency, commercial_notes, limitations, notes
  ) values (
    'PR-2026-001', v_product_id,
    'Does the Executive Decision Portal support a credible, coherent decision journey for a dealership prospect, and where do implementation details weaken the trust or conversion experience?',
    'completed', 'pilot',
    'Six-step desktop decision journey, case-study experience, ROI calculator, booking validation, navigation/state behaviour, agreement specimen and limited implementation/error-state behaviour.',
    'Live web application, desktop',
    '2026-09-21', '2026-09-21', null,
    10000, 'ZAR', 'Estimated, not billed.',
    $lim$- Successful booking submission was not tested.
- Partial invalid form states were not tested.
- WhatsApp contact was not tested.
- Genuine mobile/narrow viewport behaviour was not verified.
- Backend/database/source code were not inspected.
- No penetration/security testing was performed.
- No formal POPIA/legal compliance assessment was performed.
- Root causes for session degradation and reveal behaviour were not established.
- Whether case-study names represent real individuals was not established.$lim$,
    $notes$POSITIVE OBSERVATIONS
- Six-step no-login narrative structure is appropriate to the product.
- ROI calculations tested were internally consistent.
- Back/forward navigation and hard refresh behaved reliably.
- Calculator state survived hard refresh.
- Fee structure is clearly communicated.
- MSA specimen is clearly labelled.
- Empty booking submission correctly failed closed.

RECOMMENDED DIRECTION
Protect the trust created by the narrative. The six-step commercial structure is coherent and should remain intact. Concentrate the next round of work on implementation details that contradict or weaken that confidence, particularly confidentiality, personalisation and the final conversion journey.

WHAT TO LEAVE ALONE
Six-step narrative structure; clear fee communication; specimen-document labelling; working ROI calculation/state handling; vendor-framed comparison structure where claims remain supportable.$notes$
  ) returning id into v_review_id;

  -- Journeys (7)
  insert into public.studio_review_journeys (review_id, name) values (v_review_id, 'J01 Understand the proposition') returning id into v_j01;
  insert into public.studio_review_journeys (review_id, name) values (v_review_id, 'J02 Evaluate the proposed solution') returning id into v_j02;
  insert into public.studio_review_journeys (review_id, name) values (v_review_id, 'J03 Assess case-study evidence') returning id into v_j03;
  insert into public.studio_review_journeys (review_id, name) values (v_review_id, 'J04 Assess risk and protection') returning id into v_j04;
  insert into public.studio_review_journeys (review_id, name) values (v_review_id, 'J05 Evaluate commercial return') returning id into v_j05;
  insert into public.studio_review_journeys (review_id, name) values (v_review_id, 'J06 Move toward agreement / booking') returning id into v_j06;
  insert into public.studio_review_journeys (review_id, name) values (v_review_id, 'J07 Navigate and resume the experience') returning id into v_j07;

  -- Findings (7)
  insert into public.studio_findings (
    review_id, title, lens, observation, consequence, recommendation,
    classification, horizon, evidence_status, confidence, status
  ) values (
    v_review_id, 'F-001 — Case-study URLs contradict the visible redaction claim', 'Assumptions',
    'Case-study URLs contain apparent personal names while the product states that personal identifiers have been redacted.',
    'This creates a confidentiality/trust contradiction. It is not established that the names identify real people, so do not characterize this as a POPIA violation.',
    'Confirm whether the names relate to real individuals and replace identifying URL/file naming with anonymous case identifiers where appropriate.',
    'Important', 'Now', 'Reproduced', 'High', 'confirmed'
  ) returning id into v_f001;

  insert into public.studio_findings (
    review_id, title, lens, observation, consequence, recommendation,
    classification, horizon, evidence_status, confidence, status
  ) values (
    v_review_id, 'F-002 — Personalisation is inconsistent on Case File #001', 'Product',
    'Case File #001 repeatedly displays “Apex Auto Group” while the surrounding personalised experience identifies “Volkswagen Auto Group.”',
    'Inconsistent personalisation can weaken confidence in an experience designed to feel prospect-specific.',
    'Trace the content/personalisation source and determine whether this is a placeholder/content-scoping issue or a broader implementation problem. Do not describe it as a data leak without evidence.',
    'Important', 'Now', 'Reproduced', 'High', 'confirmed'
  ) returning id into v_f002;

  insert into public.studio_findings (
    review_id, title, lens, observation, consequence, recommendation,
    classification, horizon, evidence_status, confidence, status
  ) values (
    v_review_id, 'F-003 — ROI slider interaction is unreliable', 'Function',
    'Slider click-and-drag did not work as expected; dragging selected text and the extreme-right maximum had a dead zone. Track-click interaction worked and tested calculations were correct.',
    'Friction occurs at a commercially important decision point.',
    'Repair slider interaction while preserving the existing calculation logic.',
    'Important', 'Next', 'Reproduced', 'High', 'confirmed'
  ) returning id into v_f003;

  insert into public.studio_findings (
    review_id, title, lens, observation, consequence, recommendation,
    classification, horizon, evidence_status, confidence, status
  ) values (
    v_review_id, 'F-004 — Booking validation lacks visible feedback', 'Experience',
    'Submitting the booking form empty produced no visible inline error/toast/state change; focus shifted and no network request occurred.',
    'Users may not understand why progression stopped.',
    'Add clear visible validation close to the affected fields while retaining fail-closed behaviour.',
    'Important', 'Next', 'Observed', 'High', 'confirmed'
  ) returning id into v_f004;

  insert into public.studio_findings (
    review_id, title, lens, observation, consequence, recommendation,
    classification, horizon, evidence_status, confidence, status
  ) values (
    v_review_id, 'F-005 — Long-session degradation requires investigation', 'Function',
    'During one sequential six-step session, the page became unresponsive at Step 6. A fresh tab worked.',
    'If reproducible, this could affect users completing the full intended journey.',
    'Reproduce under controlled conditions and profile the session before assigning a root cause.',
    'Observation', 'Investigate', 'Requires verification', 'Medium', 'confirmed'
  ) returning id into v_f005;

  insert into public.studio_findings (
    review_id, title, lens, observation, consequence, recommendation,
    classification, horizon, evidence_status, confidence, status
  ) values (
    v_review_id, 'F-006 — Scroll-reveal behaviour can temporarily leave content blank', 'Experience',
    'Fast scrolling sometimes exposed blank space before reveal animations completed.',
    'Can make the experience feel less responsive.',
    'Reproduce across devices/browsers before changing animation behaviour.',
    'Opportunity', 'Investigate', 'Observed', 'Medium', 'confirmed'
  ) returning id into v_f006;

  insert into public.studio_findings (
    review_id, title, lens, observation, consequence, recommendation,
    classification, horizon, evidence_status, confidence, status
  ) values (
    v_review_id, 'F-007 — Route/error-state polish is inconsistent', 'Product',
    'Visible step numbering and route numbering are inconsistent, and an invalid route produced the default hosting-platform 404.',
    'Minor implementation details reduce finish/polish.',
    'Align route conventions where practical and introduce a branded error state.',
    'Opportunity', 'Later', 'Observed', 'Medium', 'confirmed'
  ) returning id into v_f007;

  -- Finding <-> Journey links (8)
  insert into public.studio_finding_journeys (finding_id, journey_id) values
    (v_f001, v_j03),
    (v_f002, v_j03),
    (v_f003, v_j05),
    (v_f004, v_j06),
    (v_f005, v_j06),
    (v_f005, v_j07),
    (v_f006, v_j07),
    (v_f007, v_j07);

  -- Evidence: one textual 'note' record per finding, description = that finding's Observation verbatim.
  insert into public.studio_evidence (finding_id, kind, title, description) values
    (v_f001, 'note', 'F-001 — Observation record',
      'Case-study URLs contain apparent personal names while the product states that personal identifiers have been redacted.'),
    (v_f002, 'note', 'F-002 — Observation record',
      'Case File #001 repeatedly displays “Apex Auto Group” while the surrounding personalised experience identifies “Volkswagen Auto Group.”'),
    (v_f003, 'note', 'F-003 — Observation record',
      'Slider click-and-drag did not work as expected; dragging selected text and the extreme-right maximum had a dead zone. Track-click interaction worked and tested calculations were correct.'),
    (v_f004, 'note', 'F-004 — Observation record',
      'Submitting the booking form empty produced no visible inline error/toast/state change; focus shifted and no network request occurred.'),
    (v_f005, 'note', 'F-005 — Observation record',
      'During one sequential six-step session, the page became unresponsive at Step 6. A fresh tab worked.'),
    (v_f006, 'note', 'F-006 — Observation record',
      'Fast scrolling sometimes exposed blank space before reveal animations completed.'),
    (v_f007, 'note', 'F-007 — Observation record',
      'Visible step numbering and route numbering are inconsistent, and an invalid route produced the default hosting-platform 404.');

  -- Assumptions Register (6)
  insert into public.studio_review_assumptions (review_id, reference, statement, status, confidence) values
    (v_review_id, 'A01', 'Decision-makers understand dense finance/compliance terminology.', 'Questionable', 'Medium'),
    (v_review_id, 'A02', 'Visible-body redaction is sufficient to protect case-study confidentiality.', 'Questionable', 'High'),
    (v_review_id, 'A03', 'Default ROI calculator inputs are appropriate/understood anchors.', 'Needs validation', 'Medium'),
    (v_review_id, 'A04', 'Desktop is the primary review/use environment.', 'Needs validation', 'Low'),
    (v_review_id, 'A05', 'The intended full journey remains stable during a long sequential session.', 'Operational dependency', 'Medium'),
    (v_review_id, 'A06', 'Focus movement alone provides sufficient booking-validation feedback.', 'Questionable', 'High');

  -- Report
  insert into public.studio_reports (review_id, version, status) values (v_review_id, 1, 'issued');

  raise notice 'PR-2026-001 ingested: client=%, product=%, review=%', v_client_id, v_product_id, v_review_id;
end;
$$;

commit;
