import { googleConfig } from '@/lib/server/env'
import { getSheets } from '@/lib/server/factory'
import { adminRoute } from '@/lib/server/http'
import { ValidationError } from '@/lib/server/errors'
import { spreadsheetRefSchema } from '@/lib/integrations/google-sheets/schemas'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Who to share the spreadsheet with, the configured defaults, and optionally the tabs of a spreadsheet. */
export const GET = adminRoute(async ({ req }) => {
  const cfg = googleConfig()
  const spreadsheetId = new URL(req.url).searchParams.get('spreadsheetId')
  let worksheets: Array<{ title: string }> | undefined
  if (spreadsheetId) {
    const ok = spreadsheetRefSchema.shape.spreadsheetId.safeParse(spreadsheetId)
    if (!ok.success) throw new ValidationError(ok.error.issues[0].message)
    worksheets = await getSheets().listWorksheets(spreadsheetId)
  }
  return { serviceAccountEmail: cfg.clientEmail, defaultSpreadsheetId: cfg.defaultSpreadsheetId ?? null, defaultWorksheet: cfg.defaultWorksheet ?? null, worksheets }
})
