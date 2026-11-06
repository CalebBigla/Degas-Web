import Link from 'next/link'
import { cn } from '@/lib/utils'

// Hover: subtle lift + shadow, arrow icon nudges right. Active: press down.
const base =
  'inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-[translate,scale,box-shadow,background-color,opacity] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98] active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 [&>svg]:transition-transform [&>svg]:duration-200 hover:[&>svg]:translate-x-0.5'

const variants = {
  primary: 'bg-accent text-accent-foreground hover:opacity-90',
  navy: 'bg-navy text-navy-foreground hover:bg-navy/90',
  outline:
    'border border-border bg-background text-foreground hover:bg-secondary',
  outlineLight:
    'border border-white/25 bg-transparent text-navy-foreground hover:bg-white/10',
} as const

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  className,
  external,
}: {
  href: string
  children: React.ReactNode
  variant?: keyof typeof variants
  className?: string
  external?: boolean
}) {
  const classes = cn(base, variants[variant], className)

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}
