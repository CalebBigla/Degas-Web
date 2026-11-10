import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { adminPage } from '@/lib/admin/queries'
import { isPageSlug, pageDefaults, pageDefinitions, type PageDef, type PageValue } from '@/lib/pages/definitions'
import { mergeWithDefaults } from '@/lib/pages/get'
import { formatUpdated, PageHeader } from '@/components/admin/ui'
import { PageEditor } from '@/components/admin/forms/page-editor'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return { title: isPageSlug(slug) ? pageDefinitions[slug].label : 'Page' }
}

export default async function EditPagePage({ params }: Props) {
  const { slug } = await params
  if (!isPageSlug(slug)) notFound()

  const definition = pageDefinitions[slug] as PageDef
  const { content, updatedAt } = await adminPage(slug)
  const initial = mergeWithDefaults(slug, content) as Record<string, PageValue>

  return (
    <div className="max-w-6xl">
      <PageHeader
        title={definition.label}
        description={
          updatedAt
            ? `${definition.description} Last saved ${formatUpdated(updatedAt)}.`
            : `${definition.description} Showing the original text; nothing has been changed yet.`
        }
        back={{ label: 'Pages', href: '/admin/pages' }}
      />
      {/* Remount after each save so the form starts from the saved content. */}
      <PageEditor
        key={updatedAt ?? 'original'}
        slug={slug}
        definition={definition}
        initial={initial}
        defaults={pageDefaults[slug] as Record<string, PageValue>}
      />
    </div>
  )
}
