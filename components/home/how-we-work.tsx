import { SectionHeading } from '@/components/section-heading'
import { processSteps } from '@/lib/site-data'

export function HowWeWork() {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="How we work"
          title="A clear path from idea to delivery"
          description="A simple, transparent process that keeps you informed and in control at every stage."
        />

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map(({ step, title, description }) => (
            <li
              key={step}
              className="relative flex flex-col gap-3 rounded-xl border border-border bg-card p-7"
            >
              <span className="font-heading text-4xl font-bold text-accent/25">
                {step}
              </span>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
