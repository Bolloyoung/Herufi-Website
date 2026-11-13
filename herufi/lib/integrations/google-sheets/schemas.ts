import { z } from 'zod'

export const CANONICAL_FIELDS = [
  'email',
  'first_name',
  'last_name',
  'organisation',
  'job_title',
  'country',
  'organisation_type',
  'category',
  'tags',
  'consent_status',
  'consent_date',
  'consent_source',
  'consent_purpose',
  'consent_evidence',
  'notes',
  'external_id',
] as const
export type CanonicalField = (typeof CANONICAL_FIELDS)[number]

/** Canonical field name to the spreadsheet column heading that holds it. */
export type ColumnMapping = Partial<Record<CanonicalField, string>>

export const columnMappingSchema = z
  .object(
    Object.fromEntries(CANONICAL_FIELDS.map((f) => [f, z.string().min(1).max(200).optional()])) as Record<
      CanonicalField,
      z.ZodOptional<z.ZodString>
    >,
  )
  .strict()

export const FIELD_LABELS: Record<CanonicalField, string> = {
  email: 'Email',
  first_name: 'First name',
  last_name: 'Last name',
  organisation: 'Organisation',
  job_title: 'Job title',
  country: 'Country',
  organisation_type: 'Organisation type',
  category: 'Category',
  tags: 'Tags',
  consent_status: 'Consent status',
  consent_date: 'Consent date',
  consent_source: 'Consent source',
  consent_purpose: 'Consent purpose',
  consent_evidence: 'Consent evidence',
  notes: 'Notes (internal only)',
  external_id: 'External ID',
}

export const spreadsheetRefSchema = z.object({
  spreadsheetId: z
    .string()
    .min(10)
    .max(200)
    .regex(/^[A-Za-z0-9_-]+$/, 'Spreadsheet ID may only contain letters, numbers, dashes and underscores'),
  worksheet: z.string().min(1).max(100),
})
export type SpreadsheetRef = z.infer<typeof spreadsheetRefSchema>

/** Only the parts of the Google Sheets API responses that we rely on. */
export const valuesResponseSchema = z.object({
  range: z.string().optional(),
  majorDimension: z.string().optional(),
  values: z.array(z.array(z.union([z.string(), z.number(), z.boolean()]))).optional(),
})

export const spreadsheetMetaSchema = z.object({
  properties: z.object({ title: z.string() }).optional(),
  sheets: z
    .array(z.object({ properties: z.object({ title: z.string(), sheetId: z.number().optional() }) }))
    .optional(),
})

export const tokenResponseSchema = z.object({
  access_token: z.string().min(10),
  expires_in: z.number().optional(),
  token_type: z.string().optional(),
})
