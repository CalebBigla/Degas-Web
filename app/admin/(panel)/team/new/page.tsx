import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/admin/auth'
import { PageHeader } from '@/components/admin/ui'
import { TeamForm } from '@/components/admin/forms/team-form'

export const metadata: Metadata = { title: 'Add team member' }

export default async function NewTeamMemberPage() {
  await requireAdmin()
  return (
    <>
      <PageHeader title="Add team member" back={{ label: 'Team', href: '/admin/team' }} />
      <TeamForm />
    </>
  )
}
