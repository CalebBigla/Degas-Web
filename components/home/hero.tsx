import { ArrowRight, ShieldCheck, Award, FolderCheck } from 'lucide-react'
import { ButtonLink } from '@/components/button-link'
import { getSettings } from '@/lib/content'

export async function Hero() {
  const company = await getSettings()
  const badges = [
    { icon: ShieldCheck, label: `Registered company (CAC RC ${company.rcNumber})` },
    { icon: Award, label: '5+ Years Combined Experience' },
    { icon: FolderCheck, label: '20+ Projects Delivered' },
  ]

  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 0%, black 40%, transparent 100%)',
        }}
      />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 pb-16 pt-20 text-center sm:px-6 lg:pb-24 lg:pt-28">
        <span className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-border bg-secondary px-3.5 py-1.5 text-xs font-medium text-muted-foreground motion-reduce:animate-none">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          Simplicity and Excellence
        </span>

        <h1 className="mt-6 animate-fade-up text-balance text-4xl font-bold leading-[1.05] text-foreground [animation-delay:100ms] motion-reduce:animate-none sm:text-5xl lg:text-6xl">
          We simplify solutions across the tech space
        </h1>

        <p className="mt-6 max-w-2xl animate-fade-up text-pretty text-lg leading-relaxed text-muted-foreground [animation-delay:200ms] motion-reduce:animate-none">
          Degas Concepts Limited is a trusted provider of tech solutions. From design
          to deployment, we build reliable products with clarity, integrity, and
          excellence at every step.
        </p>

        <div className="mt-9 flex animate-fade-up flex-col gap-3 [animation-delay:300ms] motion-reduce:animate-none sm:flex-row">
          <ButtonLink href="/contact" variant="primary">
            Get a Quote
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/work" variant="outline">
            View Our Work
          </ButtonLink>
        </div>

        <div className="mt-14 w-full border-t border-border pt-8">
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {badges.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground"
              >
                <Icon className="h-4 w-4 text-accent" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
