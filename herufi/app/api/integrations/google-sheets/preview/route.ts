import { z } from 'zod'
import { columnMappingSchema } from '@/lib/integrations/google-sheets/schemas'
import { previewImport } from '@/lib/services/imports'
import { getSheets } from '@/lib/server/factory'
import { adminRoute, readJson } from '@/lib/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const body = z.object({ spreadsheetId: z.string(), worksheet: z.string(), mapping: columnMappingSchema.optional(), tagDelimiter: z.string().optional() })

/** What an import would do, row by row. Writes nothing. */
export const POST = adminRoute(async ({ req }) => previewImport(await readJson(req, body), getSheets()))
