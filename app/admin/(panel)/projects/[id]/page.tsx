import type { Metadata } from 'next'
import { adminProject, adminServices, adminSettings } from '@/lib/admin/queries'
import { PageHeader } from '@/components/admin/ui'
import { ProjectForm } from '@/components/admin/forms/project-form'

export const metadata: Metadata = { title: 'Edit project' }

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [project, services, settings] = await Promise.all([
    adminProject(id),
    adminServices(),
    adminSettings(),
  ])
  return (
    <>
      <PageHeader title={project.title} back={{ label: 'Projects', href: '/admin/projects' }} />
      <ProjectForm project={project} services={services} shortName={settings.shortName} />
    </>
  )
}
