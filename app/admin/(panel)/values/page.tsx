import type { Metadata } from 'next'
import Link from 'next/link'
import { adminValues } from '@/lib/admin/queries'
import { getIcon } from '@/lib/icons'
import { DataTable, EmptyState, PageHeader, StatusBadge, Td } from '@/components/admin/ui'
import { RowActions } from '@/components/admin/row-actions'

export const metadata: Metadata = { title: 'Core values' }

export default async function ValuesPage() {
  const values = await adminValues()

  return (
    <>
      <PageHeader
        title="Core values"
        description="Shown under “Why Degas Concepts” on the home page and on the About page."
        action={{ label: 'New value', href: '/admin/values/new' }}
      />
      {values.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
          <EmptyState
            title="No core values yet"
            description="Add the principles that guide your work."
            action={{ label: 'New value', href: '/admin/values/new' }}
          />
        </div>
      ) : (
        <DataTable
          columns={[
            { label: 'Value' },
            { label: 'Description', hideOnMobile: true },
            { label: 'Status' },
            { label: 'Actions', className: 'text-right' },
          ]}
        >
          {values.map((value, i) => {
            const Icon = getIcon(value.icon)
            return (
              <tr key={value.id} className="transition-colors hover:bg-secondary/40">
                <Td>
                  <Link href={`/admin/values/${value.id}`} className="group flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-medium text-foreground group-hover:text-accent">
                      {value.title}
                    </span>
                  </Link>
                </Td>
                <Td hideOnMobile className="max-w-md truncate text-muted-foreground">
                  {value.description}
                </Td>
                <Td>
                  <StatusBadge published={value.published} />
                </Td>
                <Td>
                  <RowActions
                    table="core_values"
                    id={value.id}
                    name={value.title}
                    editHref={`/admin/values/${value.id}`}
                    isFirst={i === 0}
                    isLast={i === values.length - 1}
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
