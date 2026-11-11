import { z } from 'zod'
import { columnMappingSchema } from '@/lib/integrations/google-sheets/schemas'
import { runImport } from '@/lib/services/imports'
import { getSheets } from '@/lib/server/factory'
import { adminRoute, readJson } from '@/lib/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const body = z.object({
  spreadsheetId: z.string(),
  worksheet: z.string(),
  mapping: columnMappingSchema.optional(),
  tagDelimiter: z.string().optional(),
  /** Import only these sheet rows (selected in the preview). */
  rowNumbers: z.array(z.number().int().positive()).max(50_000).optional(),
  /** Retry only these rows, typically the ones that failed last time. */
  onlyRows: z.array(z.number().int().positive()).max(50_000).optional(),
})

export const POST = adminRoute(async ({ req, actor, cid, log }) => runImport({ ...(await readJson(req, body)), actor, correlationId: cid }, getSheets(), log))
