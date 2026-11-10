import type { Metadata } from 'next'
import Link from 'next/link'
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  FolderKanban,
  Layers,
  Users,
} from 'lucide-react'
import {
  adminClients,
  adminProjects,
  adminServices,
  adminSettings,
  adminTeam,
} from '@/lib/admin/queries'
import { Card, formatUpdated } from '@/components/admin/ui'

export const metadata: Metadata = { title: 'Overview' }

export default async function OverviewPage() {
  const [projects, services, clients, team, settings] = await Promise.all([
    adminProjects(),
    adminServices(),
    adminClients(),
    adminTeam(),
    adminSettings(),
  ])

  const stats = [
    { label: 'Projects', icon: FolderKanban, href: '/admin/projects', items: projects },
    { label: 'Services', icon: Layers, href: '/admin/services', items: services },
    { label: 'Clients', icon: Building2, href: '/admin/clients', items: clients },
    { label: 'Team members', icon: Users, href: '/admin/team', items: team },
  ]

  // Things a visitor would notice as missing or placeholder.
  const placeholder = /\[[A-Z_]+\]/
  const settingsPlaceholders = Object.values(settings).filter((v) => placeholder.test(v)).length
  const projectsWithoutCover = projects.filter((p) => p.published && !p.coverImage).length
  const tasks = [
    {
      done: settingsPlaceholders === 0,
      label:
        settingsPlaceholders === 0
          ? 'Company details are complete'
          : `Replace ${settingsPlaceholders} placeholder${settingsPlaceholders > 1 ? 's' : ''} in company info (e.g. RC number)`,
      href: '/admin/settings',
    },
    {
      done: clients.some((c) => c.published),
      label: clients.some((c) => c.published)
        ? 'Client logo strip is live'
        : 'Add client logos — the home page strip stays hidden until you do',
      href: '/admin/clients',
    },
    {
      done: projectsWithoutCover === 0,
      label:
        projectsWithoutCover === 0
          ? 'Every published project has a cover image'
          : `Add cover images to ${projectsWithoutCover} published project${projectsWithoutCover > 1 ? 's' : ''}`,
      href: '/admin/projects',
    },
    {
      done: team.every((m) => m.image),
      label: team.every((m) => m.image)
        ? 'Every team member has a photo'
        : 'Add photos for team members (initials are shown meanwhile)',
      href: '/admin/team',
    },
  ]

  const recent = [
    ...projects.map((p) => ({ name: p.title, type: 'Project', href: `/admin/projects/${p.id}`, updatedAt: p.updatedAt })),
    ...services.map((s) => ({ name: s.title, type: 'Service', href: `/admin/services/${s.id}`, updatedAt: s.updatedAt })),
    ...clients.map((c) => ({ name: c.name, type: 'Client', href: `/admin/clients/${c.id}`, updatedAt: c.updatedAt })),
    ...team.map((m) => ({ name: m.name, type: 'Team', href: `/admin/team/${m.id}`, updatedAt: m.updatedAt })),
  ]
    .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))
    .slice(0, 6)

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Changes you save are published to the site straight away.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, icon: Icon, href, items }) => {
          const published = items.filter((i) => i.published).length
          return (
            <Link
              key={label}
              href={href}
              className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-[box-shadow,border-color] hover:border-accent/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{label}</span>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 font-heading text-3xl font-bold text-foreground">{items.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {published} published
                {items.length - published > 0 && ` · ${items.length - published} draft`}
              </p>
            </Link>
          )
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Card title="Needs attention" className="lg:col-span-3">
          <ul className="-my-2 divide-y divide-border">
            {tasks.map((task) => (
              <li key={task.label}>
                <Link
                  href={task.href}
                  className="group flex items-center gap-3 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {task.done ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                  ) : (
                    <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
                  )}
                  <span className={task.done ? 'text-muted-foreground' : 'font-medium text-foreground'}>
                    {task.label}
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Recently updated" className="lg:col-span-2">
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing yet.</p>
          ) : (
            <ul className="-my-2 divide-y divide-border">
              {recent.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between gap-3 py-3 text-sm hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-foreground">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.type}</span>
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatUpdated(item.updatedAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  )
}
