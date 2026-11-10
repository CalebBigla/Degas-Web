import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { LegalBody } from '@/components/legal'
import { getPage } from '@/lib/pages/get'

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPage('privacy')
  return { title: copy['seo.title'], description: copy['seo.description'] }
}

// Edited in the admin under Pages. Review with a lawyer before relying on it.
export default async function PrivacyPage() {
  const copy = await getPage('privacy')
  return (
    <>
      <PageHero
        eyebrow={copy['hero.eyebrow']}
        title={copy['hero.title']}
        description={copy['hero.description']}
      />
      <LegalBody copy={copy} />
    </>
  )
}
