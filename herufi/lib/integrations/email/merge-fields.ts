/** Merge fields available in subjects and bodies. Browser safe, so the editor can list them. */
export const MERGE_FIELDS = [
  'first_name',
  'last_name',
  'name',
  'organisation',
  'job_title',
  'country',
  'organisation_type',
] as const
export type MergeField = (typeof MERGE_FIELDS)[number]

export const MERGE_FIELD_LABELS: Record<MergeField, string> = {
  first_name: 'First name',
  last_name: 'Last name',
  name: 'Full name',
  organisation: 'Organisation',
  job_title: 'Job title',
  country: 'Country',
  organisation_type: 'Organisation type',
}
