import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/admin/auth'
import { PageHeader } from '@/components/admin/ui'
import { ClientForm } from '@/components/admin/forms/client-form'

export const metadata: Metadata = { title: 'Add client' }

export default async function NewClientPage() {
  await requireAdmin()
  return (
    <>
      <PageHeader title="Add client" back={{ label: 'Clients', href: '/admin/clients' }} />
      <ClientForm />
    </>
  )
}
