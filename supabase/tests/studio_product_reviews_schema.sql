-- Synthetic rows are always rolled back. Never creates real client/review data.
begin;
do $$
declare
  v_client_id uuid := gen_random_uuid();
  v_other_client_id uuid := gen_random_uuid();
  v_product_id uuid := gen_random_uuid();
  v_review_id uuid := gen_random_uuid();
  v_other_review_id uuid := gen_random_uuid();
  v_journey_id uuid := gen_random_uuid();
  v_other_journey_id uuid := gen_random_uuid();
  v_finding_id uuid := gen_random_uuid();
  v_assumption_id uuid := gen_random_uuid();
  v_blocked boolean;
begin
  insert into public.studio_clients (id, name) values (v_client_id, 'TEST ONLY Client');
  insert into public.studio_clients (id, name) values (v_other_client_id, 'TEST ONLY Other Client');

  -- Duplicate client name (case-insensitive) is rejected.
  v_blocked := false;
  begin
    insert into public.studio_clients (name) values ('test only client');
  exception when unique_violation then v_blocked := true;
  end;
  if not v_blocked then raise exception 'Duplicate client name protection failed'; end if;

  insert into public.studio_products (id, client_id, name) values (v_product_id, v_client_id, 'TEST ONLY Product');

  -- Deleting a client that owns a product is blocked (restrict).
  v_blocked := false;
  begin
    delete from public.studio_clients where id = v_client_id;
  exception when foreign_key_violation then v_blocked := true;
  end;
  if not v_blocked then raise exception 'Client delete-restrict protection failed'; end if;

  insert into public.studio_reviews (
    id, reference, product_id, review_question, engagement_type, scope, environment,
    start_date, end_date, time_spent_minutes,
    commercial_value_amount, commercial_value_currency, commercial_notes, limitations, notes
  ) values (
    v_review_id, 'TEST-ONLY-REVIEW-001', v_product_id, 'Can a new user complete checkout unassisted?', 'paid',
    'Checkout and onboarding flows', 'Production, desktop + mobile web',
    '2026-09-01', '2026-09-10', 480,
    45000, 'ZAR', 'Reduces support load for a top-3 ticket driver',
    'Desktop Safari not covered', 'TEST ONLY'
  );
  insert into public.studio_reviews (id, reference, product_id, review_question, engagement_type, scope, environment)
    values (v_other_review_id, 'TEST-ONLY-REVIEW-002', v_product_id, 'Other review', 'pilot', 'Other scope', 'Staging');

  -- Default currency applies when omitted.
  if (select commercial_value_currency from public.studio_reviews where id = v_other_review_id) <> 'ZAR' then
    raise exception 'Default commercial_value_currency did not apply';
  end if;

  -- Bad date range is rejected.
  v_blocked := false;
  begin
    insert into public.studio_reviews (reference, product_id, review_question, engagement_type, scope, environment, start_date, end_date)
      values ('TEST-ONLY-BAD-DATES', v_product_id, 'q', 'paid', 's', 'e', '2026-09-10', '2026-09-01');
  exception when check_violation then v_blocked := true;
  end;
  if not v_blocked then raise exception 'Review date-range protection failed'; end if;

  -- Invalid engagement_type enum value is rejected.
  v_blocked := false;
  begin
    insert into public.studio_reviews (reference, product_id, review_question, engagement_type, scope, environment)
      values ('TEST-ONLY-BAD-ENGAGEMENT', v_product_id, 'q', 'discounted', 's', 'e');
  exception when check_violation then v_blocked := true;
  end;
  if not v_blocked then raise exception 'Review engagement_type enum protection failed'; end if;

  -- Invalid classification enum value is rejected.
  v_blocked := false;
  begin
    insert into public.studio_findings (
      review_id, title, lens, observation, consequence, recommendation,
      classification, horizon, evidence_status, confidence
    ) values (
      v_review_id, 'x', 'x', 'x', 'x', 'x', 'Severe', 'Now', 'Observed', 'High'
    );
  exception when check_violation then v_blocked := true;
  end;
  if not v_blocked then raise exception 'Finding classification enum protection failed'; end if;

  insert into public.studio_findings (
    id, review_id, title, lens, observation, consequence, recommendation,
    classification, horizon, evidence_status, confidence
  ) values (
    v_finding_id, v_review_id, 'TEST ONLY Finding', 'New user, mobile web',
    'Checkout button is below the fold on small screens',
    'Users abandon before completing purchase',
    'Move primary CTA above the fold',
    'Critical', 'Now', 'Reproduced', 'High'
  );

  insert into public.studio_review_journeys (id, review_id, name) values (v_journey_id, v_review_id, 'TEST ONLY Journey A');
  insert into public.studio_review_journeys (id, review_id, name) values (v_other_journey_id, v_other_review_id, 'TEST ONLY Journey B');

  insert into public.studio_finding_journeys (finding_id, journey_id) values (v_finding_id, v_journey_id);

  -- Linking a finding to a journey from a different review is rejected.
  v_blocked := false;
  begin
    insert into public.studio_finding_journeys (finding_id, journey_id) values (v_finding_id, v_other_journey_id);
  exception when raise_exception then v_blocked := true;
  end;
  if not v_blocked then raise exception 'Cross-review finding/journey protection failed'; end if;

  insert into public.studio_evidence (finding_id, kind, title, url)
    values (v_finding_id, 'screenshot', 'TEST ONLY Evidence 1', 'https://example.com/evidence-1.png');
  insert into public.studio_evidence (finding_id, kind, title, storage_path)
    values (v_finding_id, 'video', 'TEST ONLY Evidence 2', 'studio-evidence/test-only.mp4');
  -- No file or URL: a substantive description alone is enough.
  insert into public.studio_evidence (finding_id, kind, title, description)
    values (v_finding_id, 'note', 'TEST ONLY Evidence 3', 'Observed directly during the session; not captured.');

  if (select count(*) from public.studio_evidence where finding_id = v_finding_id) <> 3 then
    raise exception 'A finding did not accept multiple evidence records';
  end if;

  -- Evidence needs at least one substantive source: description, url or storage_path.
  v_blocked := false;
  begin
    insert into public.studio_evidence (finding_id, kind, title) values (v_finding_id, 'note', 'TEST ONLY Evidence 4');
  exception when check_violation then v_blocked := true;
  end;
  if not v_blocked then raise exception 'Evidence source protection failed (all sources null)'; end if;

  -- A blank/whitespace-only description does not count as substantiation.
  v_blocked := false;
  begin
    insert into public.studio_evidence (finding_id, kind, title, description) values (v_finding_id, 'note', 'TEST ONLY Evidence 5', '   ');
  exception when check_violation then v_blocked := true;
  end;
  if not v_blocked then raise exception 'Evidence source protection failed (blank description)'; end if;

  -- Assumptions Register: review-scoped, no finding linkage. ----------------
  insert into public.studio_review_assumptions (id, review_id, reference, statement, status, confidence)
    values (
      v_assumption_id, v_review_id, 'TEST-A01',
      'TEST ONLY: decision-makers understand dense finance/compliance terminology',
      'Questionable', 'High'
    );
  insert into public.studio_review_assumptions (review_id, reference, statement, status, confidence)
    values (v_review_id, 'TEST-A02', 'TEST ONLY', 'Needs validation', 'Medium');
  insert into public.studio_review_assumptions (review_id, reference, statement, status, confidence)
    values (v_review_id, 'TEST-A03', 'TEST ONLY', 'Operational dependency', 'Low');

  -- Invalid status enum value is rejected.
  v_blocked := false;
  begin
    insert into public.studio_review_assumptions (review_id, reference, statement, status, confidence)
      values (v_review_id, 'TEST-A04', 'x', 'Confirmed', 'High');
  exception when check_violation then v_blocked := true;
  end;
  if not v_blocked then raise exception 'Assumption status enum protection failed'; end if;

  -- Invalid confidence enum value is rejected.
  v_blocked := false;
  begin
    insert into public.studio_review_assumptions (review_id, reference, statement, status, confidence)
      values (v_review_id, 'TEST-A05', 'x', 'Questionable', 'Very High');
  exception when check_violation then v_blocked := true;
  end;
  if not v_blocked then raise exception 'Assumption confidence enum protection failed'; end if;

  -- Duplicate reference within the same review is rejected (exact case).
  v_blocked := false;
  begin
    insert into public.studio_review_assumptions (review_id, reference, statement, status, confidence)
      values (v_review_id, 'TEST-A01', 'duplicate reference', 'Questionable', 'High');
  exception when unique_violation then v_blocked := true;
  end;
  if not v_blocked then raise exception 'Assumption duplicate reference protection failed'; end if;

  -- Duplicate reference within the same review is rejected case-insensitively:
  -- 'TEST-A01' and 'TEST-a01' cannot coexist in one review.
  v_blocked := false;
  begin
    insert into public.studio_review_assumptions (review_id, reference, statement, status, confidence)
      values (v_review_id, 'TEST-a01', 'case-varied duplicate reference', 'Questionable', 'High');
  exception when unique_violation then v_blocked := true;
  end;
  if not v_blocked then raise exception 'Assumption case-insensitive duplicate reference protection failed'; end if;

  -- The same reference (including case variants) is allowed again under a different review.
  insert into public.studio_review_assumptions (review_id, reference, statement, status, confidence)
    values (v_other_review_id, 'TEST-A01', 'same reference, different review', 'Questionable', 'High');
  if not exists (
    select 1 from public.studio_review_assumptions
    where review_id = v_other_review_id and reference = 'TEST-A01'
  ) then
    raise exception 'Assumption reference incorrectly blocked across different reviews';
  end if;

  -- updated_at trigger fires on update.
  update public.studio_review_assumptions set notes = 'TEST ONLY note' where id = v_assumption_id;
  if (select updated_at <= created_at from public.studio_review_assumptions where id = v_assumption_id) then
    raise exception 'Assumption updated_at trigger did not advance the timestamp';
  end if;

  insert into public.studio_reports (review_id, version) values (v_review_id, 1);
  insert into public.studio_reports (review_id, version) values (v_review_id, 2);

  -- Duplicate version for the same review is rejected.
  v_blocked := false;
  begin
    insert into public.studio_reports (review_id, version) values (v_review_id, 1);
  exception when unique_violation then v_blocked := true;
  end;
  if not v_blocked then raise exception 'Report version uniqueness protection failed'; end if;

  -- updated_at trigger fires on update.
  update public.studio_findings set status = 'confirmed' where id = v_finding_id;
  if (select updated_at <= created_at from public.studio_findings where id = v_finding_id) then
    raise exception 'updated_at trigger did not advance the timestamp';
  end if;

  -- Deleting the review cascades to its journeys/findings/evidence/reports,
  -- but the product and client (Studio-wide reusable data) survive.
  delete from public.studio_reviews where id = v_review_id;
  if exists (select 1 from public.studio_review_journeys where id = v_journey_id) then raise exception 'Journey cascade failed'; end if;
  if exists (select 1 from public.studio_findings where id = v_finding_id) then raise exception 'Finding cascade failed'; end if;
  if exists (select 1 from public.studio_evidence where finding_id = v_finding_id) then raise exception 'Evidence cascade failed'; end if;
  if exists (select 1 from public.studio_review_assumptions where review_id = v_review_id) then raise exception 'Assumption cascade failed'; end if;
  if not exists (select 1 from public.studio_review_assumptions where review_id = v_other_review_id and reference = 'TEST-A01') then
    raise exception 'Assumption incorrectly cascaded from an unrelated review';
  end if;
  if exists (select 1 from public.studio_reports where review_id = v_review_id) then raise exception 'Report cascade failed'; end if;
  if not exists (select 1 from public.studio_products where id = v_product_id) then raise exception 'Product incorrectly cascaded'; end if;
  if not exists (select 1 from public.studio_clients where id = v_client_id) then raise exception 'Client incorrectly cascaded'; end if;

  -- Privilege isolation: no anon/authenticated access anywhere; RLS is on.
  if has_table_privilege('anon', 'public.studio_clients', 'SELECT')
    or has_table_privilege('authenticated', 'public.studio_clients', 'SELECT')
    or has_table_privilege('anon', 'public.studio_reviews', 'INSERT')
    or has_table_privilege('authenticated', 'public.studio_reviews', 'INSERT')
    or has_table_privilege('anon', 'public.studio_findings', 'SELECT')
    or has_table_privilege('authenticated', 'public.studio_evidence', 'SELECT')
    or has_table_privilege('anon', 'public.studio_reports', 'SELECT')
    or has_table_privilege('anon', 'public.studio_review_assumptions', 'SELECT')
    or has_table_privilege('authenticated', 'public.studio_review_assumptions', 'SELECT')
    or has_function_privilege('anon', 'public.studio_set_updated_at()', 'EXECUTE')
    or has_function_privilege('anon', 'public.studio_finding_journey_same_review()', 'EXECUTE') then
    raise exception 'Privilege isolation failed';
  end if;
  if not (
    has_table_privilege('service_role', 'public.studio_clients', 'INSERT')
    and has_table_privilege('service_role', 'public.studio_products', 'UPDATE')
    and has_table_privilege('service_role', 'public.studio_reviews', 'DELETE')
    and has_table_privilege('service_role', 'public.studio_review_journeys', 'SELECT')
    and has_table_privilege('service_role', 'public.studio_findings', 'INSERT')
    and has_table_privilege('service_role', 'public.studio_finding_journeys', 'SELECT')
    and has_table_privilege('service_role', 'public.studio_evidence', 'INSERT')
    and has_table_privilege('service_role', 'public.studio_reports', 'INSERT')
    and has_table_privilege('service_role', 'public.studio_review_assumptions', 'INSERT')
  ) then
    raise exception 'service_role is missing expected CRUD grants';
  end if;
  if (
    select count(*) from pg_class
    where relname in (
      'studio_clients', 'studio_products', 'studio_reviews', 'studio_review_journeys',
      'studio_findings', 'studio_finding_journeys', 'studio_evidence', 'studio_reports',
      'studio_review_assumptions'
    ) and relrowsecurity
  ) <> 9 then
    raise exception 'RLS missing on one or more Product Reviews tables';
  end if;
  -- No cleanup delete needed: the outer transaction is rolled back below.
end;
$$;

set local role anon;
do $$
declare v_blocked boolean := false;
begin
  begin perform id from public.studio_clients;
  exception when insufficient_privilege then v_blocked := true; end;
  if not v_blocked then raise exception 'Anonymous client read was allowed'; end if;

  v_blocked := false;
  begin perform id from public.studio_findings;
  exception when insufficient_privilege then v_blocked := true; end;
  if not v_blocked then raise exception 'Anonymous finding read was allowed'; end if;

  v_blocked := false;
  begin insert into public.studio_reports (review_id, version) values (gen_random_uuid(), 1);
  exception when insufficient_privilege then v_blocked := true; end;
  if not v_blocked then raise exception 'Anonymous report insert was allowed'; end if;

  v_blocked := false;
  begin perform id from public.studio_review_assumptions;
  exception when insufficient_privilege then v_blocked := true; end;
  if not v_blocked then raise exception 'Anonymous assumption read was allowed'; end if;
end;
$$;
reset role;
select 'PASS: clients/products reuse, review lifecycle, finding/journey/evidence/report/assumption relations, cross-review guard, cascades, updated_at, RLS, grants' as result;
rollback;
