import type { Metadata } from 'next'
import { Building2, Mail, Reply } from 'lucide-react'
import { adminEnquiry, adminSettings } from '@/lib/admin/queries'
import { Badge, PageHeader, buttonClass } from '@/components/admin/ui'
import { CopyEmailButton, EnquiryActions, MarkReadOnOpen } from '@/components/admin/enquiry-actions'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Enquiry' }

function fullDate(iso: string) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Lagos',
    timeZoneName: 'short',
  }).format(new Date(iso))
}

export default async function EnquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [enquiry, settings] = await Promise.all([adminEnquiry(id), adminSettings()])

  // Pre-filled reply: subject plus the original message quoted below.
  const quoted = enquiry.message
    .split('\n')
    .map((line) => `> ${line}`)
    .join('\n')
  const replyHref = `mailto:${enquiry.email}?subject=${encodeURIComponent(
    `Re: Your enquiry to ${settings.shortName}`,
  )}&body=${encodeURIComponent(`Hi ${enquiry.name.split(' ')[0]},\n\n\n\n—\n${settings.shortName}\n\nOn ${fullDate(enquiry.createdAt)}, you wrote:\n${quoted}`)}`

  return (
    <>
      <MarkReadOnOpen id={enquiry.id} status={enquiry.status} />
      <PageHeader
        title={enquiry.name}
        back={
          enquiry.status === 'archived'
            ? { label: 'Archived enquiries', href: '/admin/enquiries?view=archived' }
            : { label: 'Enquiries', href: '/admin/enquiries' }
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgb(0_0_0/0.04)] lg:col-span-2 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <time dateTime={enquiry.createdAt}>{fullDate(enquiry.createdAt)}</time>
            {enquiry.status === 'archived' && <Badge>Archived</Badge>}
          </div>
          <p className="mt-5 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-foreground">
            {enquiry.message}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-border pt-6">
            <a href={replyHref} className={cn(buttonClass('primary'), 'h-9 px-4 text-xs')}>
              <Reply className="h-3.5 w-3.5" />
              Reply by email
            </a>
            <CopyEmailButton email={enquiry.email} />
          </div>
        </article>

        <aside className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
            <h2 className="text-sm font-semibold text-foreground">From</h2>
            <dl className="mt-4 flex flex-col gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Name</dt>
                <dd className="font-medium text-foreground">{enquiry.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Email</dt>
                <dd>
                  <a href={`mailto:${enquiry.email}`} className="inline-flex items-center gap-1.5 break-all font-medium text-accent hover:underline">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    {enquiry.email}
                  </a>
                </dd>
              </div>
              {enquiry.company && (
                <div>
                  <dt className="text-xs text-muted-foreground">Company</dt>
                  <dd className="inline-flex items-center gap-1.5 font-medium text-foreground">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    {enquiry.company}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Actions</h2>
            <EnquiryActions id={enquiry.id} name={enquiry.name} status={enquiry.status} />
          </div>
        </aside>
      </div>
    </>
  )
}
