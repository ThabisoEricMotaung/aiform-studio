-- Signatures and the exact issued PDF are private database records, never public storage objects.
create table public.studio_document_executions (
  id uuid primary key,
  document_id text not null,
  document_version text not null,
  document_reference text not null,
  document_hash text not null check (document_hash ~ '^[a-f0-9]{64}$'),
  issued_pdf_base64 text not null check (length(issued_pdf_base64) between 1 and 2000000),
  signatory_name text not null check (length(trim(signatory_name)) between 2 and 200),
  business text not null check (length(trim(business)) between 2 and 200),
  address text not null check (length(trim(address)) between 10 and 1000),
  signing_as text not null check (signing_as in ('individual', 'company')),
  entity_name text,
  registration_number text,
  capacity text not null check (length(trim(capacity)) between 1 and 150),
  signature jsonb not null check (jsonb_typeof(signature) = 'array' and jsonb_array_length(signature) between 1 and 80 and octet_length(signature::text) <= 300000),
  signature_format text not null check (signature_format = 'normalized-strokes-v1'),
  signature_hash text not null check (signature_hash ~ '^[a-f0-9]{64}$'),
  consent boolean not null check (consent),
  consent_text text not null,
  consent_version text not null,
  authentication_method text not null check (authentication_method = 'separately-issued-signing-code'),
  signed_at timestamptz not null default clock_timestamp(),
  unique (document_id, document_version),
  check (document_hash = encode(sha256(decode(issued_pdf_base64, 'base64')), 'hex')),
  check (signing_as <> 'company' or (length(trim(entity_name)) > 0 and entity_name is not null
    and length(trim(registration_number)) > 0 and registration_number is not null))
);

-- Separate, append-only evidence. Creating a client execution never inserts here.
-- An authenticated Studio countersigning workflow must be implemented before use.
create table public.studio_document_countersignatures (
  id uuid primary key,
  execution_id uuid not null unique references public.studio_document_executions(id) on delete restrict,
  signatory_name text not null check (length(trim(signatory_name)) between 2 and 200),
  capacity text not null check (length(trim(capacity)) between 1 and 150),
  signature jsonb not null check (jsonb_typeof(signature) = 'array' and jsonb_array_length(signature) between 1 and 80 and octet_length(signature::text) <= 300000),
  signature_format text not null check (signature_format = 'normalized-strokes-v1'),
  consent boolean not null check (consent),
  consent_text text not null,
  authenticated_actor text not null check (length(trim(authenticated_actor)) > 0),
  signed_at timestamptz not null default clock_timestamp()
);

create function public.studio_execution_immutable() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  raise exception 'Execution evidence is append-only';
end;
$$;
create trigger studio_execution_immutable before update or delete on public.studio_document_executions
  for each row execute function public.studio_execution_immutable();
create trigger studio_countersignature_immutable before update or delete on public.studio_document_countersignatures
  for each row execute function public.studio_execution_immutable();
revoke all on function public.studio_execution_immutable() from public, anon, authenticated;

create table public.studio_signing_rate_limits (
  key text not null check (key ~ '^[a-f0-9]{64}$'),
  window_start timestamptz not null,
  attempts integer not null check (attempts > 0),
  primary key (key, window_start)
);
create index studio_signing_rate_limits_expiry_idx on public.studio_signing_rate_limits(window_start);

-- Shared atomic limiter; unlike the existing inquiry limiter, survives cold starts.
create function public.studio_signing_rate_limit(p_key text, p_limit integer) returns boolean
language plpgsql security invoker set search_path = '' as $$
declare
  bucket timestamptz := to_timestamp(floor(extract(epoch from clock_timestamp()) / 900) * 900);
  current_attempts integer;
begin
  if p_limit < 1 or p_limit > 20 then raise exception 'Invalid request limit'; end if;
  delete from public.studio_signing_rate_limits where window_start < clock_timestamp() - interval '1 day';
  insert into public.studio_signing_rate_limits(key, window_start, attempts) values (p_key, bucket, 1)
  on conflict (key, window_start) do update set attempts = least(public.studio_signing_rate_limits.attempts + 1, p_limit + 1)
  returning attempts into current_attempts;
  return current_attempts <= p_limit;
end;
$$;
revoke all on function public.studio_signing_rate_limit(text, integer) from public, anon, authenticated;
grant execute on function public.studio_signing_rate_limit(text, integer) to service_role;

alter table public.studio_document_executions enable row level security;
alter table public.studio_document_countersignatures enable row level security;
alter table public.studio_signing_rate_limits enable row level security;
revoke all on public.studio_document_executions, public.studio_document_countersignatures, public.studio_signing_rate_limits from public, anon, authenticated, service_role;
grant select, insert on public.studio_document_executions to service_role;
-- The application can only read countersignatures; a future Studio signing path needs a separate writer.
grant select on public.studio_document_countersignatures to service_role;
grant select, insert, update, delete on public.studio_signing_rate_limits to service_role;
comment on table public.studio_document_executions is 'Immutable electronic execution evidence. No anonymous/authenticated Data API access. Original PDF snapshot is hashed by a database constraint.';
comment on table public.studio_document_countersignatures is 'Separate Studio countersignature evidence. Presence means fully executed; absence after a client signature means awaiting countersignature.';
