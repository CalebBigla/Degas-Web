import type { Metadata } from 'next'
import SiteLayout from '@/app/(site)/layout'
import { NotFoundContent } from '@/components/not-found-content'

export const metadata: Metadata = { title: 'Page not found', robots: { index: false } }

/** Unknown URLs anywhere on the site: same header and footer as the public pages. */
export default function NotFound() {
  return (
    <SiteLayout>
      <NotFoundContent />
    </SiteLayout>
  )
}
