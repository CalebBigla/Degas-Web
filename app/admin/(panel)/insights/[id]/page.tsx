import type { Metadata } from 'next'
import { adminPost, adminSettings } from '@/lib/admin/queries'
import { PageHeader } from '@/components/admin/ui'
import { PostForm } from '@/components/admin/forms/post-form'

export const metadata: Metadata = { title: 'Edit article' }

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [post, settings] = await Promise.all([adminPost(id), adminSettings()])
  return (
    <>
      <PageHeader title={post.title} back={{ label: 'Insights', href: '/admin/insights' }} />
      <PostForm post={post} shortName={settings.shortName} />
    </>
  )
}
