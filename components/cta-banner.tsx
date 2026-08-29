import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '@/components/button-link'

export function CtaBanner({
  title = 'Ready to build something reliable?',
  description = 'Tell us about your project. We will help you simplify it and ship it with excellence.',
  primaryLabel = 'Contact Us',
  primaryHref = '/contact',
}: {
  title?: string
  description?: string
  primaryLabel?: string
  primaryHref?: string
}) {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-navy px-6 py-14 sm:px-12">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <h2 className="text-balance text-3xl font-bold text-navy-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="text-pretty text-base leading-relaxed text-navy-muted">
            {description}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={primaryHref} variant="primary">
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/work" variant="outlineLight">
              View Our Work
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}
