import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'Herufi | Research and Analytics for African Markets, Ventures and Performance',
    template: '%s | Herufi',
  },
  description:
    'Herufi produces structured research, original frameworks, and data-backed insights for investors, founders, institutions, and sports organisations working across African markets.',
  metadataBase: new URL('https://herufi.org'),
  openGraph: {
    siteName: 'Herufi',
    locale: 'en_US',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
