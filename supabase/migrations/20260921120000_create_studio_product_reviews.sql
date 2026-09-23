-- Studio Product Reviews data model.
--
-- Client -> Product are Studio-wide reusable master data. Review -> Journeys
-- -> Findings -> Evidence are owned by a single review; a Finding may touch
-- several Journeys (many-to-many) and may carry several Evidence records.
-- Reports is a versioning skeleton only: no content/rendering columns and no
-- generation logic are added in this migration.
--
-- Access model matches the rest of /studio: RLS is enabled everywhere, all
-- privileges are revoked from anon/authenticated/service_role and then
-- narrowly re-granted to service_role only. There is no browser-facing
-- Data API access; every read/write goes through the Studio server routes'
-- service-role client, which must call requireStudioAdmin() first. No RLS
-- policy references auth.uid(), matching how requireStudioAdmin() is
-- currently used purely for identity, never as a Postgres role a policy
-- would key off.

create function public.studio_set_updated_at() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  -- clock_timestamp(), not now(): now() is frozen for the whole transaction,
  -- so it would not advance when a row is updated in the same transaction
  -- it was inserted in.
  new.updated_at := clock_timestamp();
  return new;
end;
$$;
revoke all on function public.studio_set_updated_at() from public, anon, authenticated;

-- Clients: Studio-wide reusable, not review-specific. ----------------------
create table public.studio_clients (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 200),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index studio_clients_name_key on public.studio_clients (lower(name));
create trigger studio_clients_set_updated_at before update on public.studio_clients
  for each row execute function public.studio_set_updated_at();

-- Products: Studio-wide reusable, each belongs to exactly one client. ------
create table public.studio_products (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.studio_clients(id) on delete restrict,
  name text not null check (length(trim(name)) between 1 and 200),
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index studio_products_client_id_idx on public.studio_products (client_id);
create unique index studio_products_client_name_key on public.studio_products (client_id, lower(name));
create trigger studio_products_set_updated_at before update on public.studio_products
  for each row execute function public.studio_set_updated_at();

-- Reviews: one review engagement against one product. -----------------------
create table public.studio_reviews (
  id uuid primary key default gen_random_uuid(),
  reference text not null check (length(trim(reference)) between 1 and 100),
  product_id uuid not null references public.studio_products(id) on delete restrict,
  review_question text not null check (length(trim(review_question)) > 0),
  status text not null default 'draft'
    check (status in ('draft', 'in_progress', 'completed', 'archived')),
  engagement_type text not null
    check (engagement_type in ('paid', 'complimentary', 'internal', 'pilot')),
  scope text not null check (length(trim(scope)) > 0),
  environment text not null check (length(trim(environment)) > 0),
  start_date date,
  end_date date,
  time_spent_minutes integer check (time_spent_minutes is null or time_spent_minutes >= 0),
  commercial_value_amount numeric check (commercial_value_amount is null or commercial_value_amount >= 0),
  commercial_value_currency text not null default 'ZAR' check (length(trim(commercial_value_currency)) = 3),
  commercial_notes text,
  limitations text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (reference),
  check (start_date is null or end_date is null or end_date >= start_date)
);
create index studio_reviews_product_id_idx on public.studio_reviews (product_id);
create index studio_reviews_status_idx on public.studio_reviews (status);
create trigger studio_reviews_set_updated_at before update on public.studio_reviews
  for each row execute function public.studio_set_updated_at();

-- Journeys: scoped to a single review, not reused across reviews. ----------
create table public.studio_review_journeys (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.studio_reviews(id) on delete cascade,
  name text not null check (length(trim(name)) between 1 and 200),
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index studio_review_journeys_review_id_idx on public.studio_review_journeys (review_id);
create unique index studio_review_journeys_review_name_key on public.studio_review_journeys (review_id, lower(name));
create trigger studio_review_journeys_set_updated_at before update on public.studio_review_journeys
  for each row execute function public.studio_set_updated_at();

-- Findings: recorded during a review. ---------------------------------------
create table public.studio_findings (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.studio_reviews(id) on delete cascade,
  title text not null check (length(trim(title)) between 1 and 200),
  lens text not null check (length(trim(lens)) between 1 and 200),
  observation text not null check (length(trim(observation)) > 0),
  consequence text not null check (length(trim(consequence)) > 0),
  recommendation text not null check (length(trim(recommendation)) > 0),
  classification text not null
    check (classification in ('Critical', 'Important', 'Opportunity', 'Observation')),
  horizon text not null
    check (horizon in ('Now', 'Next', 'Later', 'Investigate')),
  evidence_status text not null
    check (evidence_status in ('Observed', 'Reproduced', 'Inferred', 'Requires verification')),
  confidence text not null
    check (confidence in ('High', 'Medium', 'Low')),
  status text not null default 'draft'
    check (status in ('draft', 'confirmed', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index studio_findings_review_id_idx on public.studio_findings (review_id);
create index studio_findings_status_idx on public.studio_findings (status);
create index studio_findings_classification_idx on public.studio_findings (classification);
create trigger studio_findings_set_updated_at before update on public.studio_findings
  for each row execute function public.studio_set_updated_at();

-- Finding <-> Journey: a finding may touch several journeys. ---------------
create table public.studio_finding_journeys (
  finding_id uuid not null references public.studio_findings(id) on delete cascade,
  journey_id uuid not null references public.studio_review_journeys(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (finding_id, journey_id)
);
create index studio_finding_journeys_journey_id_idx on public.studio_finding_journeys (journey_id);

-- Both sides of the link must belong to the same review; a finding cannot
-- be tagged against another review's journey.
create function public.studio_finding_journey_same_review() returns trigger
language plpgsql security invoker set search_path = '' as $$
declare
  finding_review uuid;
  journey_review uuid;
begin
  select review_id into finding_review from public.studio_findings where id = new.finding_id;
  select review_id into journey_review from public.studio_review_journeys where id = new.journey_id;
  if finding_review is distinct from journey_review then
    raise exception 'A finding can only be linked to journeys from its own review';
  end if;
  return new;
end;
$$;
revoke all on function public.studio_finding_journey_same_review() from public, anon, authenticated;
create trigger studio_finding_journeys_same_review before insert or update on public.studio_finding_journeys
  for each row execute function public.studio_finding_journey_same_review();

-- Evidence: a finding may have multiple evidence records. -------------------
create table public.studio_evidence (
  id uuid primary key default gen_random_uuid(),
  finding_id uuid not null references public.studio_findings(id) on delete cascade,
  kind text not null check (length(trim(kind)) between 1 and 100),
  title text not null check (length(trim(title)) between 1 and 200),
  description text,
  url text,
  storage_path text,
  captured_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (description is not null and length(trim(description)) > 0)
    or url is not null
    or storage_path is not null
  )
);
create index studio_evidence_finding_id_idx on public.studio_evidence (finding_id);
create trigger studio_evidence_set_updated_at before update on public.studio_evidence
  for each row execute function public.studio_set_updated_at();

-- Reports: versioning skeleton only. No content or generation logic here. --
create table public.studio_reports (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.studio_reviews(id) on delete cascade,
  version integer not null check (version > 0),
  status text not null default 'draft'
    check (status in ('draft', 'issued', 'superseded')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (review_id, version)
);
create index studio_reports_review_id_idx on public.studio_reports (review_id);
create trigger studio_reports_set_updated_at before update on public.studio_reports
  for each row execute function public.studio_set_updated_at();

-- RLS + grants: no public/anon/authenticated Data API access anywhere; the
-- Studio server's service-role client is the only reader/writer.
alter table public.studio_clients enable row level security;
alter table public.studio_products enable row level security;
alter table public.studio_reviews enable row level security;
alter table public.studio_review_journeys enable row level security;
alter table public.studio_findings enable row level security;
alter table public.studio_finding_journeys enable row level security;
alter table public.studio_evidence enable row level security;
alter table public.studio_reports enable row level security;

revoke all on
  public.studio_clients,
  public.studio_products,
  public.studio_reviews,
  public.studio_review_journeys,
  public.studio_findings,
  public.studio_finding_journeys,
  public.studio_evidence,
  public.studio_reports
from public, anon, authenticated, service_role;

grant select, insert, update, delete on
  public.studio_clients,
  public.studio_products,
  public.studio_reviews,
  public.studio_review_journeys,
  public.studio_findings,
  public.studio_finding_journeys,
  public.studio_evidence,
  public.studio_reports
to service_role;

comment on table public.studio_clients is
  'Studio-wide reusable client directory for Product Reviews. No public Data API access; managed only by the Studio server''s service-role client behind requireStudioAdmin().';
comment on table public.studio_products is
  'Studio-wide reusable products, each owned by one client. No public Data API access.';
comment on table public.studio_reviews is
  'A single Product Review engagement against one product. No public Data API access.';
comment on table public.studio_review_journeys is
  'Journeys examined within one review; not reused across reviews. No public Data API access.';
comment on table public.studio_findings is
  'Findings recorded during a review, optionally linked to one or more of its journeys via studio_finding_journeys. No public Data API access.';
comment on table public.studio_finding_journeys is
  'Many-to-many link between findings and the journeys they touch. A trigger enforces that both sides belong to the same review.';
comment on table public.studio_evidence is
  'Supporting evidence records for a finding; one finding may have many. Stores a link (external url and/or Supabase Storage path), not binary content. No public Data API access.';
comment on table public.studio_reports is
  'Versioning skeleton for report artifacts generated from a review (one row per version). Report content/rendering and generation logic are deliberately out of scope for this migration. No public Data API access.';
