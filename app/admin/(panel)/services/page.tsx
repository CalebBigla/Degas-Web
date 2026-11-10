import type { Metadata } from 'next'
import Link from 'next/link'
import { adminServices } from '@/lib/admin/queries'
import { getIcon } from '@/lib/icons'
import {
  DataTable,
  EmptyState,
  PageHeader,
  StatusBadge,
  Td,
  formatUpdated,
} from '@/components/admin/ui'
import { RowActions } from '@/components/admin/row-actions'

export const metadata: Metadata = { title: 'Services' }

export default async function ServicesPage() {
  const services = await adminServices()

  return (
    <>
      <PageHeader
        title="Services"
        description="Shown on the home page and the Services page, in this order."
        action={{ label: 'New service', href: '/admin/services/new' }}
      />
      {services.length === 0 ? (
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <EmptyState
            title="No services yet"
            description="Add the services you offer."
            action={{ label: 'New service', href: '/admin/services/new' }}
          />
        </div>
      ) : (
        <DataTable
          columns={[
            { label: 'Service' },
            { label: 'Summary', hideOnMobile: true },
            { label: 'Status' },
            { label: 'Updated', hideOnMobile: true },
            { label: 'Actions', className: 'text-right' },
          ]}
        >
          {services.map((service, i) => {
            const Icon = getIcon(service.icon)
            return (
              <tr key={service.id} className="transition-colors hover:bg-secondary/40">
                <Td>
                  <Link href={`/admin/services/${service.id}`} className="group flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy text-navy-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-medium text-foreground group-hover:text-accent">
                      {service.title}
                    </span>
                  </Link>
                </Td>
                <Td hideOnMobile className="max-w-xs truncate text-muted-foreground">
                  {service.summary}
                </Td>
                <Td>
                  <StatusBadge published={service.published} />
                </Td>
                <Td hideOnMobile className="whitespace-nowrap text-muted-foreground">
                  {formatUpdated(service.updatedAt)}
                </Td>
                <Td>
                  <RowActions
                    table="services"
                    id={service.id}
                    name={service.title}
                    editHref={`/admin/services/${service.id}`}
                    viewHref={service.published ? `/services#${service.slug}` : undefined}
                    isFirst={i === 0}
                    isLast={i === services.length - 1}
                  />
                </Td>
              </tr>
            )
          })}
        </DataTable>
      )}
    </>
  )
}
