import type { Metadata } from 'next'
import Link from 'next/link'
import { adminTeam } from '@/lib/admin/queries'
import {
  DataTable,
  EmptyState,
  PageHeader,
  StatusBadge,
  Td,
  formatUpdated,
  initials,
} from '@/components/admin/ui'
import { RowActions } from '@/components/admin/row-actions'

export const metadata: Metadata = { title: 'Team' }

export default async function TeamPage() {
  const team = await adminTeam()

  return (
    <>
      <PageHeader
        title="Team"
        description="People shown on the About page, in this order."
        action={{ label: 'Add member', href: '/admin/team/new' }}
      />
      {team.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
          <EmptyState
            title="No team members yet"
            description="Introduce the people behind the work."
            action={{ label: 'Add member', href: '/admin/team/new' }}
          />
        </div>
      ) : (
        <DataTable
          columns={[
            { label: 'Name' },
            { label: 'Role', hideOnMobile: true },
            { label: 'Status' },
            { label: 'Updated', hideOnMobile: true },
            { label: 'Actions', className: 'text-right' },
          ]}
        >
          {team.map((member, i) => (
            <tr key={member.id} className="transition-colors hover:bg-secondary/40">
              <Td>
                <Link href={`/admin/team/${member.id}`} className="group flex items-center gap-3">
                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy text-xs font-bold text-white">
                    {member.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={member.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      initials(member.name)
                    )}
                  </span>
                  <span className="font-medium text-foreground group-hover:text-accent">
                    {member.name}
                  </span>
                </Link>
              </Td>
              <Td hideOnMobile className="max-w-xs truncate text-muted-foreground">
                {member.role}
              </Td>
              <Td>
                <StatusBadge published={member.published} />
              </Td>
              <Td hideOnMobile className="whitespace-nowrap text-muted-foreground">
                {formatUpdated(member.updatedAt)}
              </Td>
              <Td>
                <RowActions
                  table="team_members"
                  id={member.id}
                  name={member.name}
                  editHref={`/admin/team/${member.id}`}
                  isFirst={i === 0}
                  isLast={i === team.length - 1}
                />
              </Td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  )
}
