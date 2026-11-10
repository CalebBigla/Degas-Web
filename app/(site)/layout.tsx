import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getSettings } from '@/lib/content'
import { getPage } from '@/lib/pages/get'
import { navLinks } from '@/lib/site-data'

// Public pages are static and refreshed instantly when content is saved in the
// admin (see revalidatePath in lib/admin/actions.ts). This hourly refresh is a
// safety net only.
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const [site, settings] = await Promise.all([getPage('site'), getSettings()])
  return {
    title: { default: site['seo.title'], template: `%s — ${settings.name}` },
    description: site['seo.description'],
    openGraph: {
      title: site['seo.title'],
      description: site['seo.description'],
      siteName: settings.name,
      type: 'website',
    },
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, site] = await Promise.all([getSettings(), getPage('site')])
  const links = navLinks.map(({ key, href }) => ({ label: site[key], href }))

  return (
    <>
      <SiteHeader companyName={settings.name} links={links} ctaLabel={site['header.cta']} />
      <main id="main">{children}</main>
      <SiteFooter links={links} />
    </>
  )
}
