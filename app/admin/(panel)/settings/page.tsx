import type { Metadata } from 'next'
import { adminSettings } from '@/lib/admin/queries'
import { PageHeader } from '@/components/admin/ui'
import { SettingsForm } from '@/components/admin/forms/settings-form'

export const metadata: Metadata = { title: 'Company info' }

export default async function SettingsPage() {
  const settings = await adminSettings()
  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Company info"
        description="Contact details and business information used across the site."
      />
      <SettingsForm settings={settings} />
    </div>
  )
}
