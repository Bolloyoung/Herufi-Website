import { googleConfig } from '@/lib/server/env'
import { GoogleSheetsClient } from './client'

export function googleSheetsFromEnv(): GoogleSheetsClient {
  const { clientEmail, privateKey } = googleConfig()
  return new GoogleSheetsClient({ clientEmail, privateKey })
}
