import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getSettings } from '@/lib/content'
import { getPage } from '@/lib/pages/get'
import { navLinks } from '@/lib/site-data'
import { getPosts } from '@/lib/content'
import { isFilled } from '@/lib/seo'

// Public pages are static and refreshed instantly when content is saved in the
// admin (see revalidatePath in lib/admin/actions.ts). This hourly refresh is a
// safety net only.
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const [site, settings] = await Promise.all([getPage('site'), getSettings()])
  return {
    // Fallbacks for pages without their own; every page sets its own title.
    title: { default: site['seo.title'], template: `%s | ${settings.shortName}` },
    description: site['seo.description'],
    applicationName: settings.shortName,
    verification: {
      ...(isFilled(settings.googleVerification) ? { google: settings.googleVerification } : {}),
      ...(isFilled(settings.bingVerification)
        ? { other: { 'msvalidate.01': settings.bingVerification } }
        : {}),
    },
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, site, posts] = await Promise.all([getSettings(), getPage('site'), getPosts()])
  // Insights appears in the menu once there is something to read.
  const links = navLinks
    .filter(({ key }) => key !== 'nav.insights' || posts.length > 0)
    .map(({ key, href }) => ({ label: site[key], href }))

  return (
    <>
      <SiteHeader companyName={settings.name} links={links} ctaLabel={site['header.cta']} />
      <main id="main">{children}</main>
      <SiteFooter links={links} />
    </>
  )
}
