import { googleSheetsFromEnv } from '@/lib/integrations/google-sheets'
import { listmonkFromEnv } from '@/lib/integrations/listmonk'
import type { Logger } from './logger'

/** Provider clients are built per request from the environment, never at import time. */
export const getListmonk = (log?: Logger) => listmonkFromEnv(log)
export const getSheets = () => googleSheetsFromEnv()
