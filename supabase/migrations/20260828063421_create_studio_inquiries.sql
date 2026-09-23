create table if not exists public.studio_inquiries (
  id uuid primary key,
  created_at timestamptz not null default now(),
  enquiry_type text not null,
  current_problems jsonb,
  other_problem_note text,
  audiences jsonb,
  desired_outcomes jsonb,
  project_stage text,
  additional_context text,
  timeline text,
  budget text,
  name text not null,
  email text not null,
  phone text,
  organisation text,
  status text not null default 'new' check (status in ('new', 'reviewed', 'contacted', 'closed')),
  internal_summary text,
  summary text not null default '',
  constraint current_problems_is_array check (current_problems is null or jsonb_typeof(current_problems) = 'array'),
  constraint audiences_is_array check (audiences is null or jsonb_typeof(audiences) = 'array'),
  constraint desired_outcomes_is_array check (desired_outcomes is null or jsonb_typeof(desired_outcomes) = 'array')
);

create index if not exists studio_inquiries_created_at_idx on public.studio_inquiries (created_at desc);
create index if not exists studio_inquiries_status_idx on public.studio_inquiries (status);

alter table public.studio_inquiries enable row level security;

-- Defence in depth: the browser-facing database roles receive no table
-- privileges, in addition to RLS having no public policies.
revoke all on table public.studio_inquiries from anon, authenticated;

comment on table public.studio_inquiries is
  'Structured enquiries submitted through the AiForm Studio server-side intake endpoint. No public Data API access.';

-- No policies are defined for anon/authenticated roles: this table has no
-- public read or write access at all. Inquiries are only ever inserted by
-- the server-side API route (src/app/api/inquiries/route.ts), which uses
-- the service role key and therefore bypasses RLS entirely. If an admin
-- view is added later, grant it a narrowly-scoped policy rather than
-- opening this table up broadly.
