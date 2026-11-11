import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Sora } from 'next/font/google'
import { siteUrl } from '@/lib/site-data'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Degas Concepts Limited — Simplicity and Excellence',
    template: '%s | Degas Concepts',
  },
  description:
    'Degas Concepts builds websites, mobile apps and custom software for businesses.',
  formatDetection: { telephone: false, email: false, address: false },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0e0e0e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${sora.variable} bg-background`}>
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
