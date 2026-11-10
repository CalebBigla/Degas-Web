import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/admin/auth'
import { PageHeader } from '@/components/admin/ui'
import { ProjectForm } from '@/components/admin/forms/project-form'

export const metadata: Metadata = { title: 'New project' }

export default async function NewProjectPage() {
  await requireAdmin()
  return (
    <>
      <PageHeader title="New project" back={{ label: 'Projects', href: '/admin/projects' }} />
      <ProjectForm />
    </>
  )
}
