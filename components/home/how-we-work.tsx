import { SectionHeading } from '@/components/section-heading'
import type { PageContent } from '@/lib/pages/definitions'
import { Reveal } from '@/components/reveal'

export function HowWeWork({ copy }: { copy: PageContent<'home'> }) {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={copy['process.eyebrow']}
          title={copy['process.title']}
          description={copy['process.description']}
        />

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {copy['process.steps'].map(({ title, description }, index) => {
            const step = String(index + 1).padStart(2, '0')
            return (
            <Reveal
              as="li"
              key={step}
              delay={index * 80}
              className="relative flex flex-col gap-3 rounded-xl border border-border bg-card p-7"
            >
              <span className="font-heading text-4xl font-bold text-accent/25">
                {step}
              </span>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
