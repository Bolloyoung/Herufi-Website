import { db } from '@/lib/server/db'
import { adminRoute } from '@/lib/server/http'
import { getJob, latestJobs, unresolvedRowNumbers } from '@/lib/services/sync-jobs'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Recent sync jobs, one job's row errors (?jobId=), and the rows still failing for a sheet (?spreadsheetId=&worksheet=). */
export const GET = adminRoute(async ({ req }) => {
  const p = new URL(req.url).searchParams
  const jobId = p.get('jobId')
  const spreadsheetId = p.get('spreadsheetId')
  const worksheet = p.get('worksheet')
  return {
    // Only sheet imports belong on the Imports screen. Other jobs show on the overview.
    jobs: await latestJobs(db(), { kind: 'sheet_import', limit: 20 }),
    job: jobId ? await getJob(db(), jobId) : null,
    unresolvedRows: spreadsheetId && worksheet ? await unresolvedRowNumbers(db(), spreadsheetId, worksheet) : [],
  }
})
