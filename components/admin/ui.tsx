import Link from 'next/link'
import { Plus } from 'lucide-react'
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
      <div>
        {back && (
          <Link
            href={back.href}
            className="mb-2 inline-flex text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            ← {back.label}
          </Link>
        )}
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link href={action.href} className={buttonClass('primary')}>
          <Plus className="h-4 w-4" />
          {action.label}
        </Link>
      )}
    </div>
  )
}

export function buttonClass(variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'secondary') {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-[background-color,opacity,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60',
    variant === 'primary' && 'bg-accent text-accent-foreground shadow-sm hover:opacity-90',
    variant === 'secondary' &&
      'border border-border bg-card text-foreground shadow-sm hover:bg-secondary',
    variant === 'ghost' && 'text-muted-foreground hover:bg-secondary hover:text-foreground',
    variant === 'danger' && 'bg-destructive text-white shadow-sm hover:opacity-90',
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
    <section className={cn('rounded-xl border border-border bg-card shadow-sm', className)}>
      {title && (
        <header className="border-b border-border px-6 py-4">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
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
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
        tone === 'neutral' && 'bg-secondary text-muted-foreground',
        tone === 'success' && 'bg-accent/10 text-accent',
        tone === 'accent' && 'bg-navy text-navy-foreground',
        tone === 'warning' && 'bg-amber-100 text-amber-800',
      )}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ published }: { published: boolean }) {
  return published ? (
    <Badge tone="success">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
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
      <p className="text-base font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && (
        <Link href={action.href} className={cn(buttonClass('primary'), 'mt-6')}>
          <Plus className="h-4 w-4" />
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
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-secondary/60">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.label}
                  scope="col"
                  className={cn(
                    'px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground',
                    col.hideOnMobile && 'hidden md:table-cell',
                    col.className,
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">{children}</tbody>
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
    <td className={cn('px-4 py-3 align-middle', hideOnMobile && 'hidden md:table-cell', className)}>
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
    <span className="relative flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-secondary">
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
