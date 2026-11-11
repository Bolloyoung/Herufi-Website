import type { Metadata } from 'next'
import ConfirmSubscription from '@/components/email/ConfirmSubscription'

export const metadata: Metadata = { title: 'Confirm subscription', robots: { index: false, follow: false } }

export default function ConfirmPage({ searchParams }: { searchParams: { token?: string } }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-cream flex items-start justify-center px-6 py-20">
      <div className="w-full max-w-lg bg-white border border-border-soft rounded-lg p-8">
        <ConfirmSubscription token={searchParams.token ?? ''} />
      </div>
    </div>
  )
}
