import type { Metadata } from 'next'
import { adminClient } from '@/lib/admin/queries'
import { PageHeader } from '@/components/admin/ui'
import { ClientForm } from '@/components/admin/forms/client-form'

export const metadata: Metadata = { title: 'Edit client' }

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const client = await adminClient(id)
  return (
    <>
      <PageHeader title={client.name} back={{ label: 'Clients', href: '/admin/clients' }} />
      <ClientForm client={client} />
    </>
  )
}
