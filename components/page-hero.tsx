import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Eyebrow } from '@/components/section-heading'
import { HeroBackground } from '@/components/home/hero-background'
import { AnimatedHeadline, headlineDoneMs } from '@/components/animated-headline'

const START_MS = 200

/**
 * Header for inner pages: ink background with drifting brand-blue glows,
 * grid streaks and a pointer spotlight; the title rises in word by word and
 * the rest follows. Wrap words in **double asterisks** to highlight them.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  back,
  icon,
  children,
  width = 'max-w-4xl',
}: {
  eyebrow: string
  title: string
  description?: string
  /** "← All services" style link above the eyebrow. */
  back?: { href: string; label: string }
  /** Small icon shown before the eyebrow. */
  icon?: React.ReactNode
  /** Extra content under the description (buttons, author line…). */
  children?: React.ReactNode
  width?: string
}) {
  const after = headlineDoneMs(title, START_MS)

  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-navy px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <HeroBackground tone="dark" />

      <div className={cn('relative mx-auto flex flex-col gap-4', width)}>
        {back && (
          <Link
            href={back.href}
            className="group mb-2 inline-flex w-fit animate-fade-up items-center gap-1.5 text-sm font-medium text-navy-muted transition-colors hover:text-navy-foreground motion-reduce:animate-none"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            {back.label}
          </Link>
        )}

        <div className="flex animate-pop-in items-center gap-3 motion-reduce:animate-none">
          {icon && (
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-accent">
              {icon}
            </span>
          )}
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>

        <AnimatedHeadline
          title={title}
          tone="dark"
          startMs={START_MS}
          className="text-balance text-4xl font-bold leading-[1.08] text-navy-foreground sm:text-5xl lg:text-[3.5rem]"
        />

        {description && (
          <p
            className="max-w-2xl animate-fade-up text-pretty text-lg leading-relaxed text-navy-muted motion-reduce:animate-none"
            style={{ animationDelay: `${after}ms` }}
          >
            {description}
          </p>
        )}

        {children && (
          <div
            className="animate-fade-up motion-reduce:animate-none"
            style={{ animationDelay: `${after + 120}ms` }}
          >
            {children}
          </div>
        )}
      </div>
    </section>
  )
}
