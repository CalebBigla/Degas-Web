import type { Metadata } from 'next'
import Link from 'next/link'
import { adminPosts } from '@/lib/admin/queries'
import {
  Badge,
  DataTable,
  EmptyState,
  PageHeader,
  StatusBadge,
  Td,
  Thumb,
  formatUpdated,
} from '@/components/admin/ui'
import { RowActions } from '@/components/admin/row-actions'
import { formatDate } from '@/lib/format'

export const metadata: Metadata = { title: 'Insights' }

export default async function PostsPage() {
  const posts = await adminPosts()

  return (
    <>
      <PageHeader
        title="Insights"
        description="Articles on the Insights page, newest first. The menu link appears once one is published."
        action={{ label: 'New article', href: '/admin/insights/new' }}
      />
      {posts.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
          <EmptyState
            title="No articles yet"
            description="Useful guides that answer clients’ real questions help the site get found on Google."
            action={{ label: 'Write the first article', href: '/admin/insights/new' }}
          />
        </div>
      ) : (
        <DataTable
          columns={[
            { label: 'Article' },
            { label: 'Date', hideOnMobile: true },
            { label: 'Status' },
            { label: 'Updated', hideOnMobile: true },
            { label: 'Actions', className: 'text-right' },
          ]}
        >
          {posts.map((post) => (
            <tr key={post.id} className="transition-colors hover:bg-secondary/40">
              <Td>
                <Link href={`/admin/insights/${post.id}`} className="group flex items-center gap-3">
                  <Thumb src={post.coverImage} alt="" fallback={post.title.slice(0, 2).toUpperCase()} />
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-foreground group-hover:text-accent">
                      {post.title}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">/insights/{post.slug}</span>
                  </span>
                </Link>
              </Td>
              <Td hideOnMobile className="whitespace-nowrap text-muted-foreground">
                {formatDate(post.publishedAt) ?? '—'}
              </Td>
              <Td>
                <div className="flex flex-wrap gap-1.5">
                  <StatusBadge published={post.published} />
                  {post.noindex && <Badge tone="warning">Hidden from Google</Badge>}
                </div>
              </Td>
              <Td hideOnMobile className="whitespace-nowrap text-muted-foreground">
                {formatUpdated(post.updatedAt)}
              </Td>
              <Td>
                <RowActions
                  table="posts"
                  id={post.id}
                  name={post.title}
                  editHref={`/admin/insights/${post.id}`}
                  viewHref={post.published ? `/insights/${post.slug}` : undefined}
                  isFirst
                  isLast
                  sortable={false}
                />
              </Td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  )
}
