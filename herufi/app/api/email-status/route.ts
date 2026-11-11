import { listAudiences } from '@/lib/services/audiences'
import { statusCounts } from '@/lib/services/contacts'
import { latestJobs } from '@/lib/services/sync-jobs'
import { appEnv, sendMode, testAllowlist } from '@/lib/server/env'
import { getListmonk } from '@/lib/server/factory'
import { adminRoute } from '@/lib/server/http'
import { db } from '@/lib/server/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const has = (n: string) => Boolean(process.env[n]?.trim())

/** Overview for the admin home: environment, which settings exist (never their values), Listmonk health and counts. */
export const GET = adminRoute(async ({ log }) => {
  let listmonk: { healthy: boolean; lists?: Array<{ id: number; name: string; subscriber_count?: number }>; error?: string } = { healthy: false }
  try {
    const lm = getListmonk(log)
    listmonk = { healthy: await lm.checkAuthenticated(), lists: (await lm.getLists()).map((l) => ({ id: l.id, name: l.name, subscriber_count: l.subscriber_count })) }
  } catch (err) {
    listmonk = { healthy: false, error: err instanceof Error ? err.message : 'unreachable' }
  }
  const [counts, audiences, jobs] = await Promise.all([statusCounts(), listAudiences(db()), latestJobs(db(), { limit: 5 })])
  return {
    environment: appEnv(),
    sendMode: sendMode(),
    allowlistEntries: testAllowlist().length,
    configured: {
      database: has('DATABASE_URL'), googleSheets: has('GOOGLE_SERVICE_ACCOUNT_EMAIL') && has('GOOGLE_PRIVATE_KEY'),
      listmonk: has('LISTMONK_BASE_URL') && has('LISTMONK_API_TOKEN'), tokenSecret: has('EMAIL_TOKEN_SECRET'),
      jobSecret: has('INTERNAL_JOB_SECRET'), webhookSecret: has('EMAIL_WEBHOOK_SECRET'), resend: has('RESEND_API_KEY'),
    },
    listmonk, counts, audiences: audiences.length, jobs,
  }
})
