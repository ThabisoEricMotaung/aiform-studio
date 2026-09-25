-- Synthetic rows are always rolled back. Never creates real client/review data.
begin;
do $$
declare
  v_client_id uuid := gen_random_uuid();
  v_product_id uuid := gen_random_uuid();
  v_review_id uuid := gen_random_uuid();
  v_hash text := 'scrypt$16384$8$1$' || repeat('a', 22) || '$' || repeat('b', 43);
  v_blocked boolean;
  v_updated timestamptz;
begin
  insert into public.studio_clients (id, name) values (v_client_id, 'TEST ONLY Access Client');
  insert into public.studio_products (id, client_id, name) values (v_product_id, v_client_id, 'TEST ONLY Access Product');
  insert into public.studio_reviews (id, reference, product_id, review_question, engagement_type, scope, environment)
    values (v_review_id, 'TEST-ONLY-ACCESS-001', v_product_id, 'q', 'pilot', 's', 'e');

  -- A plaintext-looking code is rejected by the hash format constraint.
  v_blocked := false;
  begin
    insert into public.studio_review_client_access (review_id, code_hash) values (v_review_id, 'ABCD-EFGH-JKMN-PQRS');
  exception when check_violation then v_blocked := true;
  end;
  if not v_blocked then raise exception 'Plaintext code_hash protection failed'; end if;

  insert into public.studio_review_client_access (review_id, code_hash) values (v_review_id, v_hash);
  if not (select is_active from public.studio_review_client_access where review_id = v_review_id) then
    raise exception 'is_active default did not apply';
  end if;

  -- Only one credential row per review.
  v_blocked := false;
  begin
    insert into public.studio_review_client_access (review_id, code_hash) values (v_review_id, v_hash);
  exception when unique_violation then v_blocked := true;
  end;
  if not v_blocked then raise exception 'One-credential-per-review protection failed'; end if;

  select updated_at into v_updated from public.studio_review_client_access where review_id = v_review_id;
  update public.studio_review_client_access set is_active = false where review_id = v_review_id;
  if (select updated_at from public.studio_review_client_access where review_id = v_review_id) <= v_updated then
    raise exception 'updated_at trigger did not advance';
  end if;

  -- No Data API role can read the table; service_role cannot delete.
  if has_table_privilege('anon', 'public.studio_review_client_access', 'select')
     or has_table_privilege('authenticated', 'public.studio_review_client_access', 'select')
     or has_table_privilege('service_role', 'public.studio_review_client_access', 'delete') then
    raise exception 'Unexpected privilege on studio_review_client_access';
  end if;

  -- Deleting the review cascades to its credential.
  delete from public.studio_reviews where id = v_review_id;
  if exists (select 1 from public.studio_review_client_access where review_id = v_review_id) then
    raise exception 'Credential did not cascade with its review';
  end if;
end;
$$;
rollback;
