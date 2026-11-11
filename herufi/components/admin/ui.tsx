import type { ReactNode } from 'react'

export function PageTitle({ title, children, intro }: { title: string; children?: ReactNode; intro?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h1 className="font-serif text-2xl md:text-3xl font-normal text-charcoal">{title}</h1>
        {intro && <p className="mt-2 text-sm text-charcoal/65 leading-relaxed">{intro}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  )
}

export function Panel({ title, children, action, className = '' }: { title?: string; children: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <section className={`bg-white border border-border-soft rounded-lg ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-border-soft">
          {title && <h2 className="text-sm font-semibold text-charcoal">{title}</h2>}
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  )
}

const NOTICE = {
  info: 'bg-forest/5 border-forest/20 text-charcoal',
  warn: 'bg-gold/10 border-gold/40 text-charcoal',
  error: 'bg-red-50 border-red-200 text-red-900',
  success: 'bg-forest/10 border-forest/30 text-forest',
} as const

export function Notice({ kind = 'info', children }: { kind?: keyof typeof NOTICE; children: ReactNode }) {
  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className={`rounded-md border px-4 py-3 text-sm leading-relaxed ${NOTICE[kind]}`}>
      {children}
    </div>
  )
}

const BADGE: Record<string, string> = {
  subscribed: 'bg-forest/10 text-forest',
  sent: 'bg-forest/10 text-forest',
  succeeded: 'bg-forest/10 text-forest',
  sending: 'bg-gold/20 text-charcoal',
  scheduled: 'bg-gold/20 text-charcoal',
  running: 'bg-gold/20 text-charcoal',
  pending_confirmation: 'bg-gold/20 text-charcoal',
  partial: 'bg-gold/20 text-charcoal',
  test: 'bg-charcoal/10 text-charcoal',
  draft: 'bg-charcoal/10 text-charcoal',
  imported_pending_consent: 'bg-charcoal/10 text-charcoal',
  paused: 'bg-gold/20 text-charcoal',
  unsubscribed: 'bg-red-50 text-red-800',
  bounced: 'bg-red-50 text-red-800',
  complained: 'bg-red-100 text-red-900',
  suppressed: 'bg-red-100 text-red-900',
  invalid: 'bg-red-50 text-red-800',
  failed: 'bg-red-100 text-red-900',
  cancelled: 'bg-charcoal/10 text-charcoal/70',
}

const LABEL: Record<string, string> = {
  imported_pending_consent: 'No consent yet',
  pending_confirmation: 'Awaiting confirmation',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${BADGE[status] ?? 'bg-charcoal/10 text-charcoal'}`}>
      {LABEL[status] ?? status.replace(/_/g, ' ')}
    </span>
  )
}

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-charcoal/60 py-6" role="status">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-forest border-t-transparent" aria-hidden />
      {label}
    </div>
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="py-8 text-center text-sm text-charcoal/55">{children}</p>
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-md border border-border-soft bg-white px-4 py-3">
      <p className="text-xs text-charcoal/55">{label}</p>
      <p className="mt-1 font-mono text-xl text-charcoal">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-charcoal/50">{hint}</p>}
    </div>
  )
}

export function Th({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return <th scope="col" className={`px-3 py-2 text-left text-xs font-medium text-charcoal/55 ${className}`}>{children}</th>
}

export function Td({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return <td className={`px-3 py-2.5 text-sm text-charcoal align-top ${className}`}>{children}</td>
}

export function TableWrap({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto"><table className="w-full border-collapse">{children}</table></div>
}

export function Field({ label, hint, children, htmlFor }: { label: string; hint?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="field-label">{label}</label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-charcoal/55">{hint}</p>}
    </div>
  )
}
