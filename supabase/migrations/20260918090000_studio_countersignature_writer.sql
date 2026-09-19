-- Completes the countersignature evidence schema to match its sibling
-- executions table, and grants the narrowly scoped writer the previous
-- migration deferred: the application server role may now INSERT
-- countersignature evidence (never UPDATE/DELETE — the append-only trigger
-- from the previous migration still blocks that). Table has zero rows, so
-- adding NOT NULL columns is safe.
alter table public.studio_document_countersignatures
  add column signature_hash text not null check (signature_hash ~ '^[a-f0-9]{64}$'),
  add column consent_version text not null check (length(trim(consent_version)) > 0);

grant insert on public.studio_document_countersignatures to service_role;

comment on table public.studio_document_countersignatures is 'Separate Studio countersignature evidence, inserted only by the authenticated Studio countersigning workflow (studio-countersign-server.ts). Presence means fully executed; absence after a client signature means awaiting countersignature.';
