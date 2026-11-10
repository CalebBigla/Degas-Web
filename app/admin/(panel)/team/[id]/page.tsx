import type { Metadata } from 'next'
import { adminTeamMember } from '@/lib/admin/queries'
import { PageHeader } from '@/components/admin/ui'
import { TeamForm } from '@/components/admin/forms/team-form'

export const metadata: Metadata = { title: 'Edit team member' }

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await adminTeamMember(id)
  return (
    <>
      <PageHeader title={member.name} back={{ label: 'Team', href: '/admin/team' }} />
      <TeamForm member={member} />
    </>
  )
}
