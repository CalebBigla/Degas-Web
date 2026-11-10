import type { Metadata } from 'next'
import { adminService } from '@/lib/admin/queries'
import { PageHeader } from '@/components/admin/ui'
import { ServiceForm } from '@/components/admin/forms/service-form'

export const metadata: Metadata = { title: 'Edit service' }

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const service = await adminService(id)
  return (
    <>
      <PageHeader title={service.title} back={{ label: 'Services', href: '/admin/services' }} />
      <ServiceForm service={service} />
    </>
  )
}
