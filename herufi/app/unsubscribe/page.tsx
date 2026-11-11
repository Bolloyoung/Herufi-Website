import type { Metadata } from 'next'
import UnsubscribeForm from '@/components/email/UnsubscribeForm'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Unsubscribe', robots: { index: false, follow: false } }

export default function UnsubscribePage({ searchParams }: { searchParams: { t?: string; c?: string } }) {
  const token = searchParams.t ?? ''
  // The test email sent from the campaign screen carries a placeholder link.
  const isPlaceholder = token === 'test'
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-cream flex items-start justify-center px-6 py-20">
      <div className="w-full max-w-lg bg-white border border-border-soft rounded-lg p-8">
        {token && !isPlaceholder ? (
          <UnsubscribeForm token={token} campaign={searchParams.c} />
        ) : (
          <div>
            <h1 className="font-serif text-2xl text-charcoal mb-3">{isPlaceholder ? 'This is a test email link' : 'This link is incomplete'}</h1>
            <p className="text-sm text-charcoal/65 mb-6">
              {isPlaceholder
                ? 'In a real email this link unsubscribes the person who received it. Nothing has been changed.'
                : 'Open the unsubscribe link from one of our emails, or reply to the email and we will remove you.'}
            </p>
            <Link href="/" className="btn-secondary">Back to the home page</Link>
          </div>
        )}
      </div>
    </div>
  )
}
