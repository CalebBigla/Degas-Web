import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { LegalBody } from '@/components/legal'
import { getPage } from '@/lib/pages/get'
import { buildMetadata } from '@/lib/seo'
import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld'

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPage('terms')
  return buildMetadata({
    title: copy['seo.title'],
    description: copy['seo.description'],
    path: '/terms',
    noindex: copy['seo.noindex'],
  })
}

// Edited in the admin under Pages. Review with a lawyer before relying on it.
export default async function TermsPage() {
  const copy = await getPage('terms')
  return (
    <>
      <BreadcrumbJsonLd trail={[{ name: copy['hero.title'], path: '/terms' }]} />
      <PageHero
        eyebrow={copy['hero.eyebrow']}
        title={copy['hero.title']}
        description={copy['hero.description']}
      />
      <LegalBody copy={copy} />
    </>
  )
}
