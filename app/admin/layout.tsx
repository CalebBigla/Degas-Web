import type { Metadata } from 'next'

// Admin pages depend on the signed-in user: never prerender or cache them.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    default: 'Admin',
    template: '%s — Degas Concepts Admin',
  },
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children
}
