-- Herufi email platform: contacts, consent, audiences, sync jobs and campaigns.
--
-- Apply once in the Supabase SQL editor, or with `supabase db push`.
-- The migration is idempotent (create ... if not exists) and does not touch the
-- existing newsletter_subscribers or approved_members tables.
--
-- Security model: every table has row level security enabled and NO policies,
-- so the anon and authenticated roles can neither read nor write them. Only the
-- server, using the service role key, can access this data.

-- ---------------------------------------------------------------------------
-- Audiences. The user facing source of truth, mapped to Listmonk lists.
-- ---------------------------------------------------------------------------
create table if not exists email_audiences (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  slug             text not null unique,
  description      text,
  listmonk_list_id integer unique,
  -- Optional rules that add imported contacts to this audience automatically,
  -- for example {"organisation_type": ["DFI"], "category": [], "tags": []}.
  -- Membership created this way never counts as consent.
  auto_rules       jsonb not null default '{}'::jsonb,
  -- Offered as a choice on the public subscription form.
  public_signup    boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  archived_at      timestamptz
);

-- ---------------------------------------------------------------------------
-- Contacts. Canonical record, independent of Listmonk's database.
-- ---------------------------------------------------------------------------
create table if not exists email_contacts (
  id                      uuid primary key default gen_random_uuid(),
  email                   text not null,
  first_name              text,
  last_name               text,
  organisation            text,
  job_title               text,
  country                 text,
  organisation_type       text,
  category                text,
  tags                    text[] not null default '{}',
  notes                   text,
  external_id             text,
  source_spreadsheet_id   text,
  source_worksheet        text,
  source_row              integer,

  status                  text not null default 'imported_pending_consent'
    check (status in (
      'imported_pending_consent', 'pending_confirmation', 'subscribed',
      'unsubscribed', 'bounced', 'complained', 'suppressed', 'invalid'
    )),
  status_changed_at       timestamptz not null default now(),

  -- Verified consent evidence. Only ever set by a confirmed double opt in or by
  -- an administrator recording evidence of consent obtained elsewhere.
  consent_given_at        timestamptz,
  consent_source          text,
  consent_purpose         text,
  consent_wording_version text,
  consent_evidence        text,

  -- Consent that an imported spreadsheet CLAIMS. Never treated as permission
  -- until an administrator accepts it.
  claimed_consent         jsonb,

  listmonk_subscriber_id  integer,
  listmonk_synced_at      timestamptz,
  needs_listmonk_sync     boolean not null default false,

  last_imported_at        timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  archived_at             timestamptz,

  constraint email_contacts_email_lowercase check (email = lower(email))
);

create unique index if not exists email_contacts_email_key
  on email_contacts (email);
create unique index if not exists email_contacts_source_key
  on email_contacts (source_spreadsheet_id, external_id)
  where external_id is not null;
create index if not exists email_contacts_status_idx
  on email_contacts (status);
create index if not exists email_contacts_needs_sync_idx
  on email_contacts (needs_listmonk_sync) where needs_listmonk_sync;

-- Membership of a contact in an audience. `consented` is what makes a member
-- eligible to receive that audience's email. Consent is per audience because
-- it is given for a specific purpose.
create table if not exists email_contact_audiences (
  contact_id           uuid not null references email_contacts (id) on delete cascade,
  audience_id          uuid not null references email_audiences (id) on delete cascade,
  consented            boolean not null default false,
  consent_confirmed_at timestamptz,
  added_via            text not null default 'manual'
    check (added_via in ('import_rule', 'public_form', 'manual', 'external_consent')),
  created_at           timestamptz not null default now(),
  primary key (contact_id, audience_id)
);
create index if not exists email_contact_audiences_audience_idx
  on email_contact_audiences (audience_id) where consented;

-- ---------------------------------------------------------------------------
-- Consent audit trail. Append only.
-- ---------------------------------------------------------------------------
create table if not exists email_consent_events (
  id              uuid primary key default gen_random_uuid(),
  contact_id      uuid references email_contacts (id) on delete set null,
  email           text not null,
  event_type      text not null,
  from_status     text,
  to_status       text,
  purpose         text,
  source          text,
  wording_version text,
  evidence        text,
  audience_ids    uuid[] not null default '{}',
  actor           text not null,
  correlation_id  text,
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);
create index if not exists email_consent_events_contact_idx
  on email_consent_events (contact_id, created_at desc);
create index if not exists email_consent_events_campaign_idx
  on email_consent_events ((metadata ->> 'campaign_uuid'))
  where event_type = 'unsubscribed';

-- Double opt in tokens. Only a SHA-256 hash is stored, never the token.
create table if not exists email_confirmation_tokens (
  id               uuid primary key default gen_random_uuid(),
  token_hash       text not null unique,
  contact_id       uuid not null references email_contacts (id) on delete cascade,
  audience_ids     uuid[] not null default '{}',
  purpose          text not null,
  wording_version  text not null,
  source           text not null,
  expires_at       timestamptz not null,
  used_at          timestamptz,
  created_at       timestamptz not null default now()
);
create index if not exists email_confirmation_tokens_contact_idx
  on email_confirmation_tokens (contact_id, created_at desc);

-- Global suppression list, keyed by address so it survives contact changes.
create table if not exists email_suppressions (
  email        text primary key check (email = lower(email)),
  reason       text not null
    check (reason in ('unsubscribed', 'bounced', 'complained', 'manual', 'invalid')),
  source       text,
  detail       text,
  created_at   timestamptz not null default now(),
  cleared_at   timestamptz,
  cleared_by   text,
  clear_reason text
);

-- ---------------------------------------------------------------------------
-- Google Sheets sync.
-- ---------------------------------------------------------------------------
create table if not exists email_sync_jobs (
  id             uuid primary key default gen_random_uuid(),
  kind           text not null
    check (kind in ('sheet_import', 'listmonk_sync', 'reconcile')),
  spreadsheet_id text,
  worksheet      text,
  status         text not null default 'running'
    check (status in ('running', 'succeeded', 'partial', 'failed')),
  stats          jsonb not null default '{}'::jsonb,
  error          text,
  correlation_id text,
  started_by     text,
  started_at     timestamptz not null default now(),
  heartbeat_at   timestamptz not null default now(),
  finished_at    timestamptz
);
-- At most one running job per kind and sheet, so concurrent syncs cannot overlap.
create unique index if not exists email_sync_jobs_one_running
  on email_sync_jobs (kind, coalesce(spreadsheet_id, ''), coalesce(worksheet, ''))
  where status = 'running';

create table if not exists email_sync_row_errors (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid not null references email_sync_jobs (id) on delete cascade,
  row_number  integer,
  email       text,
  code        text not null,
  message     text not null,
  raw         jsonb,
  resolved    boolean not null default false,
  retried_at  timestamptz,
  created_at  timestamptz not null default now()
);
create index if not exists email_sync_row_errors_job_idx
  on email_sync_row_errors (job_id);

create table if not exists email_column_mappings (
  id             uuid primary key default gen_random_uuid(),
  spreadsheet_id text not null,
  worksheet      text not null,
  mapping        jsonb not null,
  tag_delimiter  text not null default ',',
  updated_by     text,
  updated_at     timestamptz not null default now(),
  unique (spreadsheet_id, worksheet)
);

-- ---------------------------------------------------------------------------
-- Sender identities, templates and campaigns.
-- ---------------------------------------------------------------------------
create table if not exists email_sender_identities (
  id             uuid primary key default gen_random_uuid(),
  from_name      text not null,
  from_email     text not null unique check (from_email = lower(from_email)),
  reply_to       text,
  signature_html text,
  -- Set by an administrator once the sending domain is verified with the
  -- delivery provider. Campaigns can only use verified identities.
  verified       boolean not null default false,
  is_default     boolean not null default false,
  created_at     timestamptz not null default now()
);

create table if not exists email_templates (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text,
  subject      text,
  preview_text text,
  body_html    text not null,
  created_by   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  archived_at  timestamptz
);

create table if not exists email_campaigns (
  id                     uuid primary key default gen_random_uuid(),
  name                   text not null,
  subject                text not null default '',
  preview_text           text,
  from_name              text,
  from_email             text,
  reply_to               text,
  audience_id            uuid references email_audiences (id),
  template_id            uuid references email_templates (id),
  body_html              text not null default '',
  body_text              text,
  status                 text not null default 'draft'
    check (status in (
      'draft', 'test', 'scheduled', 'sending', 'sent', 'paused', 'failed', 'cancelled'
    )),
  listmonk_campaign_id   integer,
  listmonk_campaign_uuid text,
  scheduled_at           timestamptz,
  timezone               text not null default 'Africa/Nairobi',
  eligible_count         integer,
  excluded_summary       jsonb,
  test_sent_at           timestamptz,
  test_recipients        text[] not null default '{}',
  submitted_at           timestamptz,
  submitted_by           text,
  idempotency_key        text unique,
  stats                  jsonb not null default '{}'::jsonb,
  last_reconciled_at     timestamptz,
  last_error             text,
  created_by             text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  archived_at            timestamptz
);
create index if not exists email_campaigns_status_idx on email_campaigns (status);
create index if not exists email_campaigns_updated_idx on email_campaigns (updated_at desc);

-- ---------------------------------------------------------------------------
-- Audit log, provider events and rate limiting.
-- ---------------------------------------------------------------------------
create table if not exists email_audit_log (
  id             uuid primary key default gen_random_uuid(),
  actor          text not null,
  action         text not null,
  entity_type    text,
  entity_id      text,
  correlation_id text,
  detail         jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now()
);
create index if not exists email_audit_log_created_idx
  on email_audit_log (created_at desc);
create index if not exists email_audit_log_entity_idx
  on email_audit_log (entity_type, entity_id);

-- Delivery events received from a provider webhook, deduplicated by event id.
create table if not exists email_provider_events (
  id           uuid primary key default gen_random_uuid(),
  provider     text not null,
  event_id     text not null,
  event_type   text not null,
  email        text,
  payload      jsonb not null default '{}'::jsonb,
  received_at  timestamptz not null default now(),
  processed_at timestamptz,
  unique (provider, event_id)
);

create table if not exists email_rate_limits (
  key          text primary key,
  window_start timestamptz not null default now(),
  hits         integer not null default 0
);

-- Atomic fixed window rate limiter. Returns true when the call is allowed.
create or replace function email_rate_limit_hit(
  p_key text, p_window_seconds integer, p_max integer
) returns boolean
language plpgsql
as $$
declare
  v_hits integer;
begin
  insert into email_rate_limits as r (key, window_start, hits)
  values (p_key, now(), 1)
  on conflict (key) do update
    set window_start = case
          when r.window_start < now() - make_interval(secs => p_window_seconds)
          then now() else r.window_start end,
        hits = case
          when r.window_start < now() - make_interval(secs => p_window_seconds)
          then 1 else r.hits + 1 end
  returning hits into v_hits;
  return v_hits <= p_max;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row level security: enabled everywhere, with no policies. Server only.
-- ---------------------------------------------------------------------------
alter table email_audiences            enable row level security;
alter table email_contacts             enable row level security;
alter table email_contact_audiences    enable row level security;
alter table email_consent_events       enable row level security;
alter table email_confirmation_tokens  enable row level security;
alter table email_suppressions         enable row level security;
alter table email_sync_jobs            enable row level security;
alter table email_sync_row_errors      enable row level security;
alter table email_column_mappings      enable row level security;
alter table email_sender_identities    enable row level security;
alter table email_templates            enable row level security;
alter table email_campaigns            enable row level security;
alter table email_audit_log            enable row level security;
alter table email_provider_events      enable row level security;
alter table email_rate_limits          enable row level security;

-- Defence in depth on top of RLS. Supabase grants new tables and functions to
-- anon and authenticated by default, so remove those grants explicitly and
-- leave access to the server (service_role) only. Written with role checks so
-- the migration also runs on a plain Postgres database.
do $$
declare
  t text;
  r text;
begin
  revoke all on function email_rate_limit_hit(text, integer, integer) from public;

  foreach r in array array['anon', 'authenticated'] loop
    if exists (select 1 from pg_roles where rolname = r) then
      execute format(
        'revoke all on function email_rate_limit_hit(text, integer, integer) from %I', r);
      for t in
        select tablename from pg_tables
        where schemaname = 'public' and tablename like 'email\_%'
      loop
        execute format('revoke all on table %I from %I', t, r);
      end loop;
    end if;
  end loop;

  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function email_rate_limit_hit(text, integer, integer) to service_role;
  end if;
end $$;
