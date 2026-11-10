import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  FileText,
  FolderKanban,
  Layers,
  Plus,
  Users,
} from 'lucide-react'
import { requireAdmin } from '@/lib/admin/auth'
import {
  adminClients,
  adminPageTimestamps,
  adminProjects,
  adminServices,
  adminSettings,
  adminTeam,
} from '@/lib/admin/queries'
import { cn } from '@/lib/utils'
import { Card, formatUpdated } from '@/components/admin/ui'
import { CountUp } from '@/components/admin/count-up'

export const metadata: Metadata = { title: 'Overview' }

function greeting() {
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Africa/Lagos' }).format(
      new Date(),
    ),
  )
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
}

function ProgressRing({ value }: { value: number }) {
  const radius = 26
  const circumference = 2 * Math.PI * radius
  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90" aria-hidden="true">
        <circle cx="32" cy="32" r={radius} fill="none" strokeWidth="6" className="stroke-secondary" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          className="stroke-accent transition-[stroke-dashoffset] duration-1000 ease-out"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value)}
          style={{ animation: 'ring-fill 1.1s cubic-bezier(0.16,1,0.3,1) both' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-foreground">
        {Math.round(value * 100)}%
      </span>
      <style>{`@keyframes ring-fill { from { stroke-dashoffset: ${circumference}; } }`}</style>
    </div>
  )
}

const TYPE_STYLES: Record<string, string> = {
  Project: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  Service: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  Client: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Team: 'bg-accent/10 text-accent',
  Page: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
}

export default async function OverviewPage() {
  const [{ user }, projects, services, clients, team, settings, pages] = await Promise.all([
    requireAdmin(),
    adminProjects(),
    adminServices(),
    adminClients(),
    adminTeam(),
    adminSettings(),
    adminPageTimestamps(),
  ])

  const stats = [
    { label: 'Projects', icon: FolderKanban, href: '/admin/projects', items: projects, tint: 'from-sky-500/20' },
    { label: 'Services', icon: Layers, href: '/admin/services', items: services, tint: 'from-violet-500/20' },
    { label: 'Clients', icon: Building2, href: '/admin/clients', items: clients, tint: 'from-amber-500/20' },
    { label: 'Team members', icon: Users, href: '/admin/team', items: team, tint: 'from-emerald-500/20' },
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
    {
      done: Boolean(pages.privacy && pages.terms),
      label:
        pages.privacy && pages.terms
          ? 'Privacy policy and terms have been updated'
          : 'Review the Privacy Policy and Terms (they still contain placeholders)',
      href: '/admin/pages/privacy',
    },
  ]
  const completed = tasks.filter((t) => t.done).length

  const recent = [
    ...projects.map((p) => ({ name: p.title, type: 'Project', href: `/admin/projects/${p.id}`, updatedAt: p.updatedAt })),
    ...services.map((s) => ({ name: s.title, type: 'Service', href: `/admin/services/${s.id}`, updatedAt: s.updatedAt })),
    ...clients.map((c) => ({ name: c.name, type: 'Client', href: `/admin/clients/${c.id}`, updatedAt: c.updatedAt })),
    ...team.map((m) => ({ name: m.name, type: 'Team', href: `/admin/team/${m.id}`, updatedAt: m.updatedAt })),
    ...Object.entries(pages).map(([slug, updatedAt]) => ({
      name: `${slug.charAt(0).toUpperCase()}${slug.slice(1)} page`,
      type: 'Page',
      href: `/admin/pages/${slug}`,
      updatedAt,
    })),
  ]
    .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))
    .slice(0, 6)

  const name = (user.email ?? '').split('@')[0]?.split(/[._-]/)[0] ?? ''
  const quickActions = [
    { label: 'New project', href: '/admin/projects/new', icon: Plus },
    { label: 'Edit home page', href: '/admin/pages/home', icon: FileText },
    { label: 'Add a client', href: '/admin/clients/new', icon: Building2 },
  ]

  return (
    <>
      {/* Header */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-border bg-card px-6 py-7 sm:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_85%_-20%,color-mix(in_oklch,var(--accent)_22%,transparent),transparent_55%),radial-gradient(circle_at_10%_120%,color-mix(in_oklch,var(--navy)_18%,transparent),transparent_50%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]"
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">{greeting()}</p>
            <h1 className="mt-2 text-2xl font-semibold capitalize text-foreground sm:text-3xl">
              {name ? `Welcome back, ${name}` : 'Welcome back'}
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Everything you save here is published to degasconcepts.com straight away.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickActions.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background/70 px-3.5 text-sm font-medium text-foreground shadow-sm backdrop-blur transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
              >
                <Icon className="h-4 w-4 text-accent transition-transform duration-300 group-hover:rotate-90" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, icon: Icon, href, items, tint }) => {
          const published = items.filter((i) => i.published).length
          const share = items.length ? published / items.length : 0
          return (
            <Link
              key={label}
              href={href}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_12px_32px_-12px_rgb(0_0_0/0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100',
                  tint,
                )}
              />
              <div className="relative flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{label}</span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary/60 text-foreground transition-[transform,background-color,color] duration-300 group-hover:rotate-[-6deg] group-hover:scale-110 group-hover:bg-accent/10 group-hover:text-accent">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
              </div>
              <p className="relative mt-3 text-3xl font-semibold tracking-tight text-foreground">
                <CountUp value={items.length} />
              </p>
              <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                <span
                  className="block h-full origin-left rounded-full bg-accent transition-transform duration-700"
                  style={{ transform: `scaleX(${share})`, animation: 'bar-grow 900ms cubic-bezier(0.16,1,0.3,1) both' }}
                />
              </div>
              <p className="relative mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {published} published
                  {items.length - published > 0 && ` · ${items.length - published} draft`}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 translate-y-1 opacity-0 transition-[transform,opacity] duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
              </p>
            </Link>
          )
        })}
      </div>
      <style>{`@keyframes bar-grow { from { transform: scaleX(0); } }`}</style>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Setup checklist */}
        <Card className="lg:col-span-3">
          <div className="-mx-6 -mt-6 mb-2 flex items-center gap-4 border-b border-border px-6 py-5">
            <ProgressRing value={completed / tasks.length} />
            <div>
              <h2 className="text-[15px] font-semibold text-foreground">Launch checklist</h2>
              <p className="mt-0.5 text-[13px] text-muted-foreground">
                {completed === tasks.length
                  ? 'All done. The site is fully set up.'
                  : `${completed} of ${tasks.length} done. Finish these before going live.`}
              </p>
            </div>
          </div>
          <ul className="admin-stagger -mb-2">
            {tasks.map((task) => (
              <li key={task.label}>
                <Link
                  href={task.href}
                  className="group -mx-3 flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <span
                    className={cn(
                      'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                      task.done
                        ? 'border-accent bg-accent text-accent-foreground'
                        : 'border-dashed border-amber-500/70 text-transparent group-hover:border-solid',
                    )}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className={task.done ? 'text-muted-foreground line-through decoration-muted-foreground/40' : 'font-medium text-foreground'}>
                    {task.label}
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 -translate-x-1 text-muted-foreground opacity-0 transition-[transform,opacity] duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        {/* Activity */}
        <Card title="Recent activity" className="lg:col-span-2">
          {recent.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Nothing edited yet.</p>
          ) : (
            <ol className="admin-stagger relative -my-1">
              <span aria-hidden="true" className="absolute bottom-4 left-[15px] top-4 w-px bg-border" />
              {recent.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group relative -mx-2 flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm transition-colors hover:bg-secondary/60"
                  >
                    <span
                      className={cn(
                        'relative inline-flex h-[30px] min-w-[30px] items-center justify-center rounded-lg text-[10px] font-bold uppercase ring-4 ring-card transition-transform duration-200 group-hover:scale-110',
                        TYPE_STYLES[item.type],
                      )}
                    >
                      {item.type.slice(0, 2)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-foreground transition-colors group-hover:text-accent">
                        {item.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.type} · {formatUpdated(item.updatedAt)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>
    </>
  )
}
