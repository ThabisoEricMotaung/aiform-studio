-- Assumptions Register for Studio Product Reviews.
--
-- Adds studio_review_assumptions as a first-class, review-scoped entity:
-- premises the reviewed journey depends on that were not conclusively
-- tested. Deliberately a different shape from studio_findings (no
-- observation/consequence/recommendation, no classification/horizon/
-- evidence_status) because an assumption is a premise, not an observed
-- product behaviour with a fix recommendation.
--
-- Scoped to a single review only (cascade-deleted with it), not reused
-- across reviews like studio_clients/studio_products. No linkage to
-- studio_findings in this migration. No evidence, journey, resolution,
-- recommendation or owner fields.
--
-- Access model matches the rest of Product Reviews: RLS is enabled, all
-- privileges are revoked from anon/authenticated/service_role and then
-- narrowly re-granted to service_role only.

create table public.studio_review_assumptions (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.studio_reviews(id) on delete cascade,
  reference text not null check (length(trim(reference)) between 1 and 100),
  statement text not null check (length(trim(statement)) > 0),
  status text not null
    check (status in ('Questionable', 'Needs validation', 'Operational dependency')),
  confidence text not null check (confidence in ('High', 'Medium', 'Low')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index studio_review_assumptions_review_id_idx on public.studio_review_assumptions (review_id);
create unique index studio_review_assumptions_review_reference_key
  on public.studio_review_assumptions (review_id, lower(reference));
create trigger studio_review_assumptions_set_updated_at before update on public.studio_review_assumptions
  for each row execute function public.studio_set_updated_at();

alter table public.studio_review_assumptions enable row level security;

revoke all on public.studio_review_assumptions from public, anon, authenticated, service_role;

grant select, insert, update, delete on public.studio_review_assumptions to service_role;

comment on table public.studio_review_assumptions is
  'Assumptions Register entries for a single review: premises the reviewed journey depends on that were not conclusively tested. Review-scoped only (not reused across reviews), with no finding linkage. No public Data API access; managed only by the Studio server''s service-role client behind requireStudioAdmin().';
