import type { Metadata } from 'next'
import { adminProject } from '@/lib/admin/queries'
import { PageHeader } from '@/components/admin/ui'
import { ProjectForm } from '@/components/admin/forms/project-form'

export const metadata: Metadata = { title: 'Edit project' }

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await adminProject(id)
  return (
    <>
      <PageHeader title={project.title} back={{ label: 'Projects', href: '/admin/projects' }} />
      <ProjectForm project={project} />
    </>
  )
}
