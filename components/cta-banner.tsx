import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '@/components/button-link'

/** Copy for the banner, as stored under the `cta.*` keys of each page. */
export type CtaCopy = {
  'cta.title': string
  'cta.description': string
  'cta.primaryLabel': string
  'cta.secondaryLabel': string
}

export function CtaBanner({ copy }: { copy: CtaCopy }) {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-navy px-6 py-14 sm:px-12">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <h2 className="text-balance text-3xl font-bold text-navy-foreground sm:text-4xl">
            {copy['cta.title']}
          </h2>
          <p className="text-pretty text-base leading-relaxed text-navy-muted">
            {copy['cta.description']}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" variant="primary">
              {copy['cta.primaryLabel']}
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/work" variant="outlineLight">
              {copy['cta.secondaryLabel']}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}
