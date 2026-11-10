import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getSettings } from '@/lib/content'

// Public pages are static and refreshed instantly when content is saved in the
// admin (see revalidatePath in lib/admin/actions.ts). This hourly refresh is a
// safety net only.
export const revalidate = 3600

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  return (
    <>
      <SiteHeader companyName={settings.name} />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  )
}
