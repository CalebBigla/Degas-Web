import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/admin/auth'
import { PageHeader } from '@/components/admin/ui'
import { ServiceForm } from '@/components/admin/forms/service-form'

export const metadata: Metadata = { title: 'New service' }

export default async function NewServicePage() {
  await requireAdmin()
  return (
    <>
      <PageHeader title="New service" back={{ label: 'Services', href: '/admin/services' }} />
      <ServiceForm />
    </>
  )
}
