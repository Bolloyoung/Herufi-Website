/** "2026-08-25" -> "25 August 2026". Leaves anything that is not an ISO date untouched. */
export function formatDate(value: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!m) return value
  const date = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])))
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}
