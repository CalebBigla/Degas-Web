import type { Metadata } from 'next'
import { adminServices, adminSettings } from '@/lib/admin/queries'
import { PageHeader } from '@/components/admin/ui'
import { ProjectForm } from '@/components/admin/forms/project-form'

export const metadata: Metadata = { title: 'New project' }

export default async function NewProjectPage() {
  const [services, settings] = await Promise.all([adminServices(), adminSettings()])
  return (
    <>
      <PageHeader title="New project" back={{ label: 'Projects', href: '/admin/projects' }} />
      <ProjectForm services={services} shortName={settings.shortName} />
    </>
  )
}
