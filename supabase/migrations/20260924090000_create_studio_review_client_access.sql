-- Client access to an issued Product Review (/reviews portal).
--
-- One credential row per review. Access codes are never stored: code_hash
-- holds only a salted scrypt digest, and its check constraint rejects any
-- value that is not in that exact format, so a plaintext code cannot be
-- persisted by mistake. Resetting a code replaces code_hash, which also
-- invalidates every client session issued under the previous code (the
-- session MAC is bound to it). Revoking sets is_active = false and is
-- enforced on every report request, not only at sign-in.
--
-- Access model matches the rest of Product Reviews: RLS is enabled, all
-- privileges are revoked from anon/authenticated/service_role and then
-- narrowly re-granted to service_role only. There is deliberately no
-- delete grant: revocation is an update, keeping the row as a record.

create table public.studio_review_client_access (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.studio_reviews(id) on delete cascade,
  code_hash text not null
    check (code_hash ~ '^scrypt\$16384\$8\$1\$[A-Za-z0-9_-]{22}\$[A-Za-z0-9_-]{43}$'),
  is_active boolean not null default true,
  expires_at timestamptz,
  last_accessed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (review_id)
);
create trigger studio_review_client_access_set_updated_at before update on public.studio_review_client_access
  for each row execute function public.studio_set_updated_at();

alter table public.studio_review_client_access enable row level security;

revoke all on public.studio_review_client_access from public, anon, authenticated, service_role;

grant select, insert, update on public.studio_review_client_access to service_role;

comment on table public.studio_review_client_access is
  'Client access credential for one issued Product Review. Stores only a salted scrypt hash of the access code, never the code. No public Data API access; read by the /reviews unlock route and report guard, and managed only by the Studio server''s service-role client behind requireStudioAdmin().';
