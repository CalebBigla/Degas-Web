import { SectionHeading } from '@/components/section-heading'
import { coreValues } from '@/lib/site-data'

export function WhyChoose() {
  return (
    <section className="border-y border-border bg-secondary px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Why Degas Concepts"
          title="Principles that guide every project"
          description="Our core values are not slogans — they define how we plan, communicate, and deliver."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {coreValues.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-8"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="text-xl font-semibold text-foreground">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
