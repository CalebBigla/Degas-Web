import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '@/components/button-link'
import { Reveal } from '@/components/reveal'
import { PauseOffscreen } from '@/components/pause-offscreen'

/** Copy for the banner, as stored under the `cta.*` keys of each page. */
export type CtaCopy = {
  'cta.title': string
  'cta.description': string
  'cta.primaryLabel': string
  'cta.secondaryLabel': string
}

/**
 * Closing call to action: ink panel with drifting brand-blue glows, a faint
 * grid and a light that travels around the border. Motion pauses off-screen.
 */
export function CtaBanner({ copy }: { copy: CtaCopy }) {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <Reveal className="relative mx-auto max-w-6xl">
        <PauseOffscreen />
        {/* 1px frame with a rotating highlight */}
        <div className="relative overflow-hidden rounded-3xl p-px">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 animate-[spin_9s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_250deg,var(--brand-blue)_320deg,transparent_360deg)] will-change-transform motion-reduce:animate-none"
          />

          <div className="relative isolate overflow-hidden rounded-[calc(1.5rem-1px)] bg-navy px-6 py-16 sm:px-12 lg:py-20">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div
                className="absolute -left-[15%] -top-[60%] h-[140%] w-[60%] animate-aurora-a will-change-transform"
                style={{
                  background:
                    'radial-gradient(closest-side, color-mix(in oklch, var(--brand-blue) 34%, transparent), transparent)',
                }}
              />
              <div
                className="absolute -bottom-[70%] -right-[10%] h-[150%] w-[60%] animate-aurora-b will-change-transform"
                style={{
                  background:
                    'radial-gradient(closest-side, color-mix(in oklch, #2a2aff 40%, transparent), transparent)',
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgb(255 255 255 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.06) 1px, transparent 1px)',
                  backgroundSize: '56px 56px',
                  maskImage: 'radial-gradient(ellipse 70% 80% at 50% 50%, black 20%, transparent 100%)',
                }}
              />
            </div>

            <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
              <h2 className="text-balance text-3xl font-bold text-navy-foreground sm:text-4xl lg:text-5xl">
                {copy['cta.title']}
              </h2>
              <p className="text-pretty text-base leading-relaxed text-navy-muted sm:text-lg">
                {copy['cta.description']}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href="/contact"
                  variant="primary"
                  className="shadow-[0_0_0_0_var(--brand-blue)] hover:shadow-[0_8px_30px_-6px_color-mix(in_oklch,var(--brand-blue)_70%,transparent)]"
                >
                  {copy['cta.primaryLabel']}
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink href="/work" variant="outlineLight">
                  {copy['cta.secondaryLabel']}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
