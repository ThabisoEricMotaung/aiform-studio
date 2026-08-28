create table if not exists studio_inquiries (
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
  status text not null default 'new',
  internal_summary text,
  summary text not null default ''
);

create index if not exists studio_inquiries_created_at_idx on studio_inquiries (created_at desc);
create index if not exists studio_inquiries_status_idx on studio_inquiries (status);

alter table studio_inquiries enable row level security;

-- No policies are defined for anon/authenticated roles: this table has no
-- public read or write access at all. Inquiries are only ever inserted by
-- the server-side API route (src/app/api/inquiries/route.ts), which uses
-- the service role key and therefore bypasses RLS entirely. If an admin
-- view is added later, grant it a narrowly-scoped policy rather than
-- opening this table up broadly.
