export const CONTACT_STATUSES = [
  'imported_pending_consent',
  'pending_confirmation',
  'subscribed',
  'unsubscribed',
  'bounced',
  'complained',
  'suppressed',
  'invalid',
] as const
export type ContactStatus = (typeof CONTACT_STATUSES)[number]

export const SUPPRESSION_REASONS = ['unsubscribed', 'bounced', 'complained', 'manual', 'invalid'] as const
export type SuppressionReason = (typeof SUPPRESSION_REASONS)[number]

export const STATUS_LABELS: Record<ContactStatus, string> = {
  imported_pending_consent: 'Imported, no consent',
  pending_confirmation: 'Awaiting confirmation',
  subscribed: 'Subscribed',
  unsubscribed: 'Unsubscribed',
  bounced: 'Bounced',
  complained: 'Complained',
  suppressed: 'Suppressed',
  invalid: 'Invalid',
}

/** The profile fields that come from a spreadsheet and are shown to staff. */
export type ContactProfile = {
  first_name: string | null
  last_name: string | null
  organisation: string | null
  job_title: string | null
  country: string | null
  organisation_type: string | null
  category: string | null
  notes: string | null
}

export const PROFILE_FIELDS = [
  'first_name',
  'last_name',
  'organisation',
  'job_title',
  'country',
  'organisation_type',
  'category',
  'notes',
] as const satisfies ReadonlyArray<keyof ContactProfile>

export type ContactRecord = ContactProfile & {
  id: string
  email: string
  tags: string[]
  external_id: string | null
  source_spreadsheet_id: string | null
  source_worksheet: string | null
  source_row: number | null
  status: ContactStatus
  status_changed_at: string
  consent_given_at: string | null
  consent_source: string | null
  consent_purpose: string | null
  consent_wording_version: string | null
  consent_evidence: string | null
  claimed_consent: ClaimedConsent | null
  listmonk_subscriber_id: number | null
  listmonk_synced_at: string | null
  needs_listmonk_sync: boolean
  last_imported_at: string | null
  created_at: string
  updated_at: string
  archived_at: string | null
}

export type ClaimedConsent = {
  status: 'given' | 'withdrawn' | 'unknown'
  rawStatus: string
  date: string | null
  source: string | null
  purpose: string | null
  evidence: string | null
  /** True only when status is given and date, source, purpose and evidence are all present. */
  complete: boolean
  problems: string[]
}

export type AudienceRecord = {
  id: string
  name: string
  slug: string
  description: string | null
  listmonk_list_id: number | null
  auto_rules: AutoRules
  public_signup: boolean
  created_at: string
  updated_at: string
  archived_at: string | null
}

export type AutoRules = {
  organisation_type?: string[]
  category?: string[]
  tags?: string[]
}

export const CAMPAIGN_STATUSES = [
  'draft',
  'test',
  'scheduled',
  'sending',
  'sent',
  'paused',
  'failed',
  'cancelled',
] as const
export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number]
