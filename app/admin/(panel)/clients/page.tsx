import type { Metadata } from 'next'
import Link from 'next/link'
import { adminClients } from '@/lib/admin/queries'
import {
  DataTable,
  EmptyState,
  PageHeader,
  StatusBadge,
  Td,
  Thumb,
  formatUpdated,
  initials,
} from '@/components/admin/ui'
import { RowActions } from '@/components/admin/row-actions'

export const metadata: Metadata = { title: 'Clients' }

export default async function ClientsPage() {
  const clients = await adminClients()

  return (
    <>
      <PageHeader
        title="Clients"
        description="Logos in the “Trusted by” strip on the home page. The strip stays hidden while no clients are published."
        action={{ label: 'Add client', href: '/admin/clients/new' }}
      />
      {clients.length === 0 ? (
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <EmptyState
            title="No clients yet"
            description="Add clients you have built solutions for. Only list clients who have agreed to it."
            action={{ label: 'Add client', href: '/admin/clients/new' }}
          />
        </div>
      ) : (
        <DataTable
          columns={[
            { label: 'Client' },
            { label: 'Logo', hideOnMobile: true },
            { label: 'Status' },
            { label: 'Updated', hideOnMobile: true },
            { label: 'Actions', className: 'text-right' },
          ]}
        >
          {clients.map((client, i) => (
            <tr key={client.id} className="transition-colors hover:bg-secondary/40">
              <Td>
                <Link href={`/admin/clients/${client.id}`} className="group flex items-center gap-3">
                  <Thumb src={client.logo} alt="" fallback={initials(client.name)} contain />
                  <span className="font-medium text-foreground group-hover:text-accent">
                    {client.name}
                  </span>
                </Link>
              </Td>
              <Td hideOnMobile className="text-muted-foreground">
                {client.logo ? 'Uploaded' : 'Text only'}
              </Td>
              <Td>
                <StatusBadge published={client.published} />
              </Td>
              <Td hideOnMobile className="whitespace-nowrap text-muted-foreground">
                {formatUpdated(client.updatedAt)}
              </Td>
              <Td>
                <RowActions
                  table="clients"
                  id={client.id}
                  name={client.name}
                  editHref={`/admin/clients/${client.id}`}
                  isFirst={i === 0}
                  isLast={i === clients.length - 1}
                />
              </Td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  )
}
