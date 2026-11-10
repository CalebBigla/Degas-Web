import type { Metadata } from 'next'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { adminProjects } from '@/lib/admin/queries'
import {
  Badge,
  DataTable,
  EmptyState,
  PageHeader,
  StatusBadge,
  Td,
  Thumb,
  formatUpdated,
} from '@/components/admin/ui'
import { RowActions } from '@/components/admin/row-actions'

export const metadata: Metadata = { title: 'Projects' }

export default async function ProjectsPage() {
  const projects = await adminProjects()

  return (
    <>
      <PageHeader
        title="Projects"
        description="Case studies on the Work page. Featured projects also appear on the home page, in this order."
        action={{ label: 'New project', href: '/admin/projects/new' }}
      />
      {projects.length === 0 ? (
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <EmptyState
            title="No projects yet"
            description="Add your first case study to show it on the Work page."
            action={{ label: 'New project', href: '/admin/projects/new' }}
          />
        </div>
      ) : (
        <DataTable
          columns={[
            { label: 'Project' },
            { label: 'Category', hideOnMobile: true },
            { label: 'Status' },
            { label: 'Updated', hideOnMobile: true },
            { label: 'Actions', className: 'text-right' },
          ]}
        >
          {projects.map((project, i) => (
            <tr key={project.id} className="transition-colors hover:bg-secondary/40">
              <Td>
                <Link href={`/admin/projects/${project.id}`} className="group flex items-center gap-3">
                  <Thumb
                    src={project.coverImage}
                    alt=""
                    fallback={project.title.slice(0, 2).toUpperCase()}
                  />
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-foreground group-hover:text-accent">
                      {project.title}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      /work/{project.slug}
                    </span>
                  </span>
                </Link>
              </Td>
              <Td hideOnMobile className="text-muted-foreground">
                {project.category}
              </Td>
              <Td>
                <div className="flex flex-wrap gap-1.5">
                  <StatusBadge published={project.published} />
                  {project.featured && (
                    <Badge tone="accent">
                      <Star className="h-3 w-3" aria-hidden="true" />
                      Featured
                    </Badge>
                  )}
                </div>
              </Td>
              <Td hideOnMobile className="whitespace-nowrap text-muted-foreground">
                {formatUpdated(project.updatedAt)}
              </Td>
              <Td>
                <RowActions
                  table="projects"
                  id={project.id}
                  name={project.title}
                  editHref={`/admin/projects/${project.id}`}
                  viewHref={project.published ? `/work/${project.slug}` : undefined}
                  isFirst={i === 0}
                  isLast={i === projects.length - 1}
                />
              </Td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  )
}
