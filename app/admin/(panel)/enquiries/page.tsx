import type { Metadata } from 'next'
import Link from 'next/link'
import { Archive, Inbox } from 'lucide-react'
import { adminEnquiries } from '@/lib/admin/queries'
import { EmptyState, PageHeader } from '@/components/admin/ui'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Enquiries' }

/** "14:05" today, "Mon" this week, otherwise "3 Nov 2026". */
function received(iso: string) {
  const date = new Date(iso)
  const now = new Date()
  const sameDay = date.toDateString() === now.toDateString()
  const tz = 'Africa/Lagos'
  if (sameDay) return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz }).format(date)
  if (now.getTime() - date.getTime() < 6 * 86_400_000)
    return new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: tz }).format(date)
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: tz }).format(date)
}

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>
}) {
  const view = (await searchParams).view === 'archived' ? 'archived' : 'inbox'
  const enquiries = await adminEnquiries(view)
  const unread = enquiries?.filter((e) => e.status === 'new').length ?? 0

  return (
    <>
      <PageHeader
        title="Enquiries"
        description="Messages sent through the contact form on the website, newest first."
      />

      {enquiries === null ? (
        <div className="rounded-2xl border border-amber-300/50 bg-amber-50 p-6 text-sm dark:border-amber-400/20 dark:bg-amber-400/5">
          <p className="font-semibold text-foreground">The enquiries inbox isn’t set up in the database yet.</p>
          <p className="mt-1 leading-relaxed text-muted-foreground">
            In Supabase, open <strong>SQL Editor</strong>, paste the contents of{' '}
            <code className="rounded bg-secondary px-1 py-0.5 text-xs">supabase/schema.sql</code> and click{' '}
            <strong>Run</strong>. Messages sent through the contact form will then appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 inline-flex rounded-xl border border-border bg-card p-1 text-sm">
            {(
              [
                { key: 'inbox', label: 'Inbox', href: '/admin/enquiries', icon: Inbox },
                { key: 'archived', label: 'Archived', href: '/admin/enquiries?view=archived', icon: Archive },
              ] as const
            ).map(({ key, label, href, icon: Icon }) => (
              <Link
                key={key}
                href={href}
                aria-current={view === key ? 'page' : undefined}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 font-medium transition-colors',
                  view === key ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
                {key === 'inbox' && view === 'inbox' && unread > 0 && (
                  <span className="rounded-full bg-accent px-1.5 text-[11px] font-semibold text-accent-foreground">
                    {unread}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
            {enquiries.length === 0 ? (
              <EmptyState
                title={view === 'archived' ? 'Nothing archived' : 'No enquiries yet'}
                description={
                  view === 'archived'
                    ? 'Enquiries you archive are kept here.'
                    : 'When someone sends a message through the contact form, it will appear here.'
                }
              />
            ) : (
              <ul className="admin-stagger divide-y divide-border">
                {enquiries.map((enquiry) => {
                  const isNew = enquiry.status === 'new'
                  return (
                    <li key={enquiry.id}>
                      <Link
                        href={`/admin/enquiries/${enquiry.id}`}
                        className="group flex items-start gap-4 px-5 py-4 transition-colors hover:bg-secondary/50"
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            'mt-2 h-2 w-2 shrink-0 rounded-full',
                            isNew ? 'bg-accent' : 'bg-transparent',
                          )}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline justify-between gap-3">
                            <span
                              className={cn(
                                'truncate text-sm',
                                isNew ? 'font-semibold text-foreground' : 'font-medium text-foreground/85',
                              )}
                            >
                              {enquiry.name}
                              {enquiry.company && (
                                <span className="font-normal text-muted-foreground"> · {enquiry.company}</span>
                              )}
                              {isNew && <span className="sr-only"> (unread)</span>}
                            </span>
                            <time
                              dateTime={enquiry.createdAt}
                              className={cn('shrink-0 text-xs tabular-nums', isNew ? 'font-semibold text-accent' : 'text-muted-foreground')}
                            >
                              {received(enquiry.createdAt)}
                            </time>
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">{enquiry.email}</span>
                          <span
                            className={cn(
                              'mt-1 line-clamp-2 text-sm leading-relaxed',
                              isNew ? 'text-foreground/90' : 'text-muted-foreground',
                            )}
                          >
                            {enquiry.message}
                          </span>
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </>
  )
}
