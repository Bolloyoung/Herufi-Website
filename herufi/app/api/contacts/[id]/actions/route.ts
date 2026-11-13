import { z } from 'zod'
import { clearSuppression, suppressContact } from '@/lib/services/consent'
import { archiveContact, restoreContact } from '@/lib/services/contacts'
import { adminRoute, parseWith, readJson } from '@/lib/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const body = z.object({ action: z.enum(['archive', 'restore', 'suppress', 'clear_suppression']), reason: z.string().max(300).optional() })

/** Auditable changes to a contact. Contacts are archived, never deleted. */
export const POST = adminRoute<{ id: string }>(async ({ req, params, actor, cid }) => {
  const id = parseWith(z.string().uuid(), params.id)
  const { action, reason = '' } = await readJson(req, body)
  if (action === 'archive') await archiveContact(actor, id, reason, cid)
  else if (action === 'restore') await restoreContact(actor, id, cid)
  else if (action === 'suppress') await suppressContact(actor, id, reason, cid)
  else await clearSuppression(actor, id, reason, cid)
  return { done: action }
})
