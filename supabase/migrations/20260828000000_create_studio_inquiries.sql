create table if not exists studio_inquiries (
  id uuid primary key,
  created_at timestamptz not null default now(),
  inquiry_type text not null,
  collaboration_type jsonb,
  problem_description text,
  project_description text,
  desired_outcome text,
  current_stage text,
  existing_url text,
  current_state_note text,
  reference_notes text,
  help_types jsonb,
  timing text,
  budget_range text,
  name text not null,
  email text not null,
  phone text,
  organisation text,
  role text,
  preferred_contact text,
  status text not null default 'new',
  internal_summary text
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
