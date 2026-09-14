import type { Metadata } from 'next'
import { Inter, Merriweather, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-merriweather',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Herufi | Research and Analytics for African Markets and Ventures',
    template: '%s | Herufi',
  },
  description:
    'Herufi produces structured research, original frameworks and insights grounded in data for investors, founders and institutions working across African markets.',
  metadataBase: new URL('https://herufi.org'),
  keywords: ['African markets research', 'venture strategy Africa', 'African investment intelligence', 'Herufi'],
  openGraph: {
    siteName: 'Herufi',
    locale: 'en_US',
    type: 'website',
    title: 'Herufi | Research and Analytics for African Markets',
    description: 'Structured research, original frameworks and insights grounded in data for decision makers working across African markets.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Herufi | Research and Analytics for African Markets',
    description: 'Structured research and analytics for investors, founders and institutions in African markets.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable} ${plexMono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
