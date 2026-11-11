import type { Metadata } from 'next'
import { adminSettings } from '@/lib/admin/queries'
import { PageHeader } from '@/components/admin/ui'
import { ServiceForm } from '@/components/admin/forms/service-form'

export const metadata: Metadata = { title: 'New service' }

export default async function NewServicePage() {
  const settings = await adminSettings()
  return (
    <>
      <PageHeader title="New service" back={{ label: 'Services', href: '/admin/services' }} />
      <ServiceForm shortName={settings.shortName} />
    </>
  )
}
