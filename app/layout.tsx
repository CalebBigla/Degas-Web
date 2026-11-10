import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Manrope } from 'next/font/google'
import { siteUrl } from '@/lib/site-data'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Degas Concepts Limited — Simplicity and Excellence',
    template: '%s — Degas Concepts Limited',
  },
  description:
    'Degas Concepts Limited is a CAC-registered tech solutions company. We simplify solutions across the tech space with simplicity and excellence — design, web, mobile, and product engineering.',
  keywords: [
    'Degas Concepts',
    'tech solutions',
    'web development',
    'UI/UX design',
    'mobile app development',
    'WordPress development',
    'product design',
    'Nigeria software company',
    'remote development team',
    'offshore software development',
  ],
  generator: 'v0.app',
  openGraph: {
    title: 'Degas Concepts Limited — Simplicity and Excellence',
    description:
      'A CAC-registered tech solutions company simplifying solutions across the tech space.',
    siteName: 'Degas Concepts Limited',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#14192b',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} bg-background`}>
      <body className="font-sans antialiased">
        <noscript>
          <style>{`[data-reveal='hidden']{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
