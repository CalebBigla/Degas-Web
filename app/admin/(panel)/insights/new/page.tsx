import type { Metadata } from 'next'
import { adminSettings } from '@/lib/admin/queries'
import { PageHeader } from '@/components/admin/ui'
import { PostForm } from '@/components/admin/forms/post-form'

export const metadata: Metadata = { title: 'New article' }

export default async function NewPostPage() {
  const settings = await adminSettings()
  return (
    <>
      <PageHeader title="New article" back={{ label: 'Insights', href: '/admin/insights' }} />
      <PostForm shortName={settings.shortName} />
    </>
  )
}
