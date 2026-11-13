import { readFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import { Client } from 'pg'
import { closePool } from '@/lib/server/db'

/**
 * Integration test support. These tests need the dev stack:
 *   docker compose -f deploy/listmonk/docker-compose.dev.yml --env-file deploy/listmonk/.env.dev up -d
 * Each test file gets its own throwaway database, which is dropped afterwards.
 */

export function devEnv(): Record<string, string> {
  const out: Record<string, string> = {}
  for (const line of readFileSync(new URL('../../deploy/listmonk/.env.dev', import.meta.url), 'utf8').split('\n')) {
    const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim())
    if (m) out[m[1]] = m[2]
  }
  return out
}

const MIGRATION = new URL('../../supabase/migrations/20261111000000_email_platform.sql', import.meta.url)

export async function createTestDatabase(): Promise<{ name: string; url: string; drop: () => Promise<void> }> {
  const env = devEnv()
  const admin = `postgres://herufi:${env.APPDB_PASSWORD}@127.0.0.1:5434/herufi`
  const name = `herufi_it_${randomBytes(5).toString('hex')}`
  const a = new Client({ connectionString: admin })
  await a.connect()
  await a.query(`create database ${name}`)
  await a.end()

  const url = `postgres://herufi:${env.APPDB_PASSWORD}@127.0.0.1:5434/${name}`
  const c = new Client({ connectionString: url })
  await c.connect()
  await c.query(readFileSync(MIGRATION, 'utf8'))
  await c.end()

  process.env.DATABASE_URL = url
  process.env.DATABASE_SSL = 'disable'
  process.env.APP_BASE_URL = 'https://herufi.test'
  process.env.APP_ENV = 'development'
  process.env.EMAIL_TOKEN_SECRET = 'integration-test-secret-'.padEnd(48, 'x')

  return {
    name,
    url,
    drop: async () => {
      await closePool()
      const d = new Client({ connectionString: admin })
      await d.connect()
      await d.query(`drop database if exists ${name} with (force)`)
      await d.end()
    },
  }
}

/** A direct connection for assertions that look at rows the services wrote. */
export async function sql(url: string, text: string, params: unknown[] = []) {
  const c = new Client({ connectionString: url })
  await c.connect()
  try {
    return (await c.query(text, params)).rows
  } finally {
    await c.end()
  }
}
