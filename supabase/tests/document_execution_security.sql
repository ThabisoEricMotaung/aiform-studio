-- Synthetic evidence is always rolled back. Never creates a real signature.
begin;
do $$
declare
  test_id uuid := gen_random_uuid();
  blocked boolean;
begin
  insert into public.studio_document_executions (
    id, document_id, document_version, document_reference, document_hash, issued_pdf_base64,
    signatory_name, business, address, signing_as, capacity, signature, signature_format,
    signature_hash, consent, consent_text, consent_version, authentication_method
  ) values (
    test_id, 'TEST-ONLY-ROLLBACK', 'test-v1', 'TEST-ONLY', encode(sha256(convert_to('TEST', 'UTF8')), 'hex'), encode(convert_to('TEST', 'UTF8'), 'base64'),
    'TEST ONLY', 'TEST ONLY', 'TEST ADDRESS ONLY', 'individual', 'TEST ONLY', '[[{"x":0.1,"y":0.2},{"x":0.5,"y":0.6}]]',
    'normalized-strokes-v1', repeat('a',64), true, 'TEST CONSENT ONLY', 'test-v1', 'separately-issued-signing-code'
  );
  blocked := false;
  begin
    update public.studio_document_executions set signatory_name = 'OVERWRITE' where id = test_id;
  exception when raise_exception then blocked := true;
  end;
  if not blocked then raise exception 'Immutability failed'; end if;

  blocked := false;
  begin
    delete from public.studio_document_executions where id = test_id;
  exception when raise_exception then blocked := true;
  end;
  if not blocked then raise exception 'Delete protection failed'; end if;

  blocked := false;
  begin
    insert into public.studio_document_executions select (jsonb_populate_record(null::public.studio_document_executions,
      to_jsonb(e) || jsonb_build_object('id',gen_random_uuid()))).* from public.studio_document_executions e where id = test_id;
  exception when unique_violation then blocked := true;
  end;
  if not blocked then raise exception 'Duplicate execution protection failed'; end if;

  blocked := false;
  begin
    insert into public.studio_document_executions select (jsonb_populate_record(null::public.studio_document_executions,
      to_jsonb(e) || jsonb_build_object('id',gen_random_uuid(),'document_version','wrong-hash','document_hash',repeat('b',64)))).*
      from public.studio_document_executions e where id = test_id;
  exception when check_violation then blocked := true;
  end;
  if not blocked then raise exception 'PDF hash protection failed'; end if;

  if has_table_privilege('anon','public.studio_document_executions','SELECT')
    or has_table_privilege('authenticated','public.studio_document_executions','SELECT')
    or has_table_privilege('anon','public.studio_document_countersignatures','INSERT')
    or has_table_privilege('service_role','public.studio_document_countersignatures','INSERT')
    or has_table_privilege('service_role','public.studio_document_executions','UPDATE')
    or has_table_privilege('service_role','public.studio_document_executions','DELETE')
    or has_function_privilege('anon','public.studio_signing_rate_limit(text,integer)','EXECUTE') then
    raise exception 'Privilege isolation failed';
  end if;
  if (select count(*) from pg_class where relname in ('studio_document_executions','studio_document_countersignatures','studio_signing_rate_limits') and relrowsecurity) <> 3 then
    raise exception 'RLS missing';
  end if;
end;
$$;

set local role service_role;
do $$
declare test_key text := encode(sha256(convert_to(gen_random_uuid()::text,'UTF8')),'hex');
begin
  if not public.studio_signing_rate_limit(test_key,2) then raise exception 'First attempt failed'; end if;
  if not public.studio_signing_rate_limit(test_key,2) then raise exception 'Second attempt failed'; end if;
  if public.studio_signing_rate_limit(test_key,2) then raise exception 'Rate limit failed'; end if;
  if (select count(*) from public.studio_document_executions where document_id = 'TEST-ONLY-ROLLBACK') <> 1 then raise exception 'Service read failed'; end if;
end;
$$;
reset role;
set local role anon;
do $$
declare blocked boolean := false;
begin
  begin perform id from public.studio_document_executions;
  exception when insufficient_privilege then blocked := true; end;
  if not blocked then raise exception 'Anonymous access was allowed'; end if;
end;
$$;
reset role;
select 'PASS: insert, read, hash binding, duplicates, immutability, RLS, grants, shared rate limit' as result;
rollback;
