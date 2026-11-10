import Link from 'next/link'
import { Inbox, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PageHeader({
  title,
  description,
  action,
  back,
}: {
  title: string
  description?: string
  action?: { label: string; href: string }
  back?: { label: string; href: string }
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back && (
          <Link
            href={back.href}
            className="group mb-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
            {back.label}
          </Link>
        )}
        <h1 className="text-[1.65rem] font-semibold leading-tight text-foreground">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link href={action.href} className={cn(buttonClass('primary'), 'group shrink-0')}>
          <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
          {action.label}
        </Link>
      )}
    </div>
  )
}

export function buttonClass(variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'secondary') {
  return cn(
    'inline-flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-[background-color,box-shadow,transform,filter,border-color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60',
    variant === 'primary' &&
      'bg-accent text-accent-foreground shadow-[0_1px_2px_rgb(0_0_0/0.12),inset_0_1px_0_rgb(255_255_255/0.18)] hover:-translate-y-px hover:shadow-[0_6px_16px_-4px_color-mix(in_oklch,var(--accent)_55%,transparent)] hover:brightness-105',
    variant === 'secondary' &&
      'border border-border bg-card text-foreground shadow-sm hover:border-foreground/20 hover:bg-secondary',
    variant === 'ghost' && 'text-muted-foreground hover:bg-secondary hover:text-foreground',
    variant === 'danger' &&
      'bg-destructive text-white shadow-sm hover:-translate-y-px hover:shadow-[0_6px_16px_-4px_color-mix(in_oklch,var(--destructive)_55%,transparent)]',
  )
}

export function Card({
  title,
  description,
  children,
  className,
}: {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-[border-color,box-shadow] duration-300',
        className,
      )}
    >
      {title && (
        <header className="border-b border-border px-6 py-4">
          <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
          {description && <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{description}</p>}
        </header>
      )}
      <div className="p-6">{children}</div>
    </section>
  )
}

export function Badge({
  tone = 'neutral',
  children,
}: {
  tone?: 'neutral' | 'success' | 'accent' | 'warning'
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium',
        tone === 'neutral' && 'border-border bg-secondary text-muted-foreground',
        tone === 'success' && 'border-accent/20 bg-accent/10 text-accent',
        tone === 'accent' && 'border-transparent bg-navy text-navy-foreground',
        tone === 'warning' &&
          'border-amber-300/50 bg-amber-100 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300',
      )}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ published }: { published: boolean }) {
  return published ? (
    <Badge tone="success">
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50 motion-reduce:hidden" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      Published
    </Badge>
  ) : (
    <Badge>
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" aria-hidden="true" />
      Draft
    </Badge>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: { label: string; href: string }
}) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <div className="relative mb-5">
        <span className="absolute inset-0 -m-3 rounded-full bg-accent/10 blur-xl" aria-hidden="true" />
        <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground shadow-sm">
          <Inbox className="h-6 w-6" />
        </span>
      </div>
      <p className="text-base font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && (
        <Link href={action.href} className={cn(buttonClass('primary'), 'group mt-6')}>
          <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
          {action.label}
        </Link>
      )}
    </div>
  )
}

/** Card-wrapped table. Columns marked `hideOnMobile` collapse below md. */
export function DataTable({
  columns,
  children,
}: {
  columns: { label: string; className?: string; hideOnMobile?: boolean }[]
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-secondary/50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.label}
                  scope="col"
                  className={cn(
                    'px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground',
                    col.hideOnMobile && 'hidden md:table-cell',
                    col.className,
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="admin-stagger divide-y divide-border [&>tr]:transition-colors [&>tr:hover]:bg-secondary/50">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function Td({
  children,
  className,
  hideOnMobile,
}: {
  children: React.ReactNode
  className?: string
  hideOnMobile?: boolean
}) {
  return (
    <td className={cn('px-4 py-3.5 align-middle', hideOnMobile && 'hidden md:table-cell', className)}>
      {children}
    </td>
  )
}

export function formatUpdated(value: string | null) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

/** Small square preview for list rows (plain img: admin-only, any host). */
export function Thumb({
  src,
  alt,
  fallback,
  contain,
}: {
  src: string | null
  alt: string
  fallback: string
  contain?: boolean
}) {
  return (
    <span className="relative flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-secondary transition-transform duration-300 group-hover:scale-105">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={cn('h-full w-full', contain ? 'object-contain p-1' : 'object-cover')}
        />
      ) : (
        <span className="font-heading text-xs font-bold text-muted-foreground">{fallback}</span>
      )}
    </span>
  )
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('')
}
