import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, FileText, Globe } from 'lucide-react'
import { adminPageTimestamps } from '@/lib/admin/queries'
import { PAGE_SLUGS, pageDefinitions } from '@/lib/pages/definitions'
import { Badge, formatUpdated, PageHeader } from '@/components/admin/ui'

export const metadata: Metadata = { title: 'Pages' }

export default async function PagesPage() {
  const saved = await adminPageTimestamps()

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="Pages"
        description="Edit the text of every page on the site: headings, introductions, buttons, process steps, legal pages, navigation and footer."
      />

      <ul className="admin-stagger overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
        {PAGE_SLUGS.map((slug, index) => {
          const page = pageDefinitions[slug]
          const updated = saved[slug]
          const Icon = page.path ? FileText : Globe
          return (
            <li key={slug} className={index > 0 ? 'border-t border-border' : undefined}>
              <Link
                href={`/admin/pages/${slug}`}
                className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/50"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary/60 text-muted-foreground transition-[transform,color,background-color] duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-accent/10 group-hover:text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-foreground">{page.label}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {page.path ?? 'All pages'}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-muted-foreground">
                    {page.description}
                  </span>
                </span>
                <span className="hidden shrink-0 text-right sm:block">
                  {updated ? (
                    <span className="text-xs text-muted-foreground">
                      Edited {formatUpdated(updated)}
                    </span>
                  ) : (
                    <Badge>Original text</Badge>
                  )}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
