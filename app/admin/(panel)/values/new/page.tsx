import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/admin/auth'
import { PageHeader } from '@/components/admin/ui'
import { ValueForm } from '@/components/admin/forms/value-form'

export const metadata: Metadata = { title: 'New core value' }

export default async function NewValuePage() {
  await requireAdmin()
  return (
    <>
      <PageHeader title="New core value" back={{ label: 'Core values', href: '/admin/values' }} />
      <ValueForm />
    </>
  )
}
