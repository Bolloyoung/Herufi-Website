'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

export class ApiError extends Error {
  constructor(message: string, public code: string, public status: number, public details?: unknown) {
    super(message)
  }
}

/** Call a Herufi admin endpoint with the signed in user's session token. */
export async function api<T = any>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  const res = await fetch(path, {
    method: init.method ?? (init.body !== undefined ? 'POST' : 'GET'),
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    cache: 'no-store',
  })
  const json = await res.json().catch(() => null)
  if (!res.ok) throw new ApiError(json?.error?.message ?? `Request failed (${res.status})`, json?.error?.code ?? 'error', res.status, json?.error?.details)
  return json?.data as T
}

/** Load data on mount and whenever `deps` change. */
export function useLoad<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const run = useRef(fn)
  run.current = fn
  const reload = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setData(await run.current())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void reload() }, deps)
  return { data, error, loading, reload, setData }
}

export const errMsg = (e: unknown) => (e instanceof Error ? e.message : 'Something went wrong')

export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return 'Not set'
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? 'Not set' : d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}
