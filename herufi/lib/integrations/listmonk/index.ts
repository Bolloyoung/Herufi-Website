import { listmonkConfig } from '@/lib/server/env'
import type { Logger } from '@/lib/server/logger'
import { ListmonkClient } from './client'
import { WRAPPER_TEMPLATE_HTML, WRAPPER_TEMPLATE_NAME } from './mapper'

export function listmonkFromEnv(log?: Logger): ListmonkClient {
  const { baseUrl, username, token, proxyToken } = listmonkConfig()
  return new ListmonkClient({ baseUrl, username, token, proxyToken, log })
}

const memo = new Map<string, number>()

/**
 * The id of Herufi's wrapper template in Listmonk, created on first use. Found by
 * name, so it survives restarts and works if the bootstrap script has already run.
 */
export async function ensureWrapperTemplate(lm: ListmonkClient, cacheKey = 'default'): Promise<number> {
  const cached = memo.get(cacheKey)
  if (cached) return cached
  const existing = (await lm.getTemplates()).find((t) => t.name === WRAPPER_TEMPLATE_NAME)
  const id = existing ? existing.id : (await lm.createTemplate({ name: WRAPPER_TEMPLATE_NAME, body: WRAPPER_TEMPLATE_HTML })).id
  memo.set(cacheKey, id)
  return id
}

export function clearTemplateCache(): void {
  memo.clear()
}
