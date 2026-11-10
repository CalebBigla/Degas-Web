import type { Metadata } from 'next'
import { adminValue } from '@/lib/admin/queries'
import { PageHeader } from '@/components/admin/ui'
import { ValueForm } from '@/components/admin/forms/value-form'

export const metadata: Metadata = { title: 'Edit core value' }

export default async function EditValuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const value = await adminValue(id)
  return (
    <>
      <PageHeader title={value.title} back={{ label: 'Core values', href: '/admin/values' }} />
      <ValueForm value={value} />
    </>
  )
}
