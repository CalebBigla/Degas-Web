import { SectionHeading } from '@/components/section-heading'
import { getCoreValues } from '@/lib/content'
import { getIcon } from '@/lib/icons'
import type { PageContent } from '@/lib/pages/definitions'

export async function WhyChoose({ copy }: { copy: PageContent<'home'> }) {
  const coreValues = await getCoreValues()
  return (
    <section className="border-y border-border bg-secondary px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={copy['values.eyebrow']}
          title={copy['values.title']}
          description={copy['values.description']}
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {coreValues.map(({ id, title, description, icon }) => {
            const Icon = getIcon(icon)
            return (
            <div
              key={id}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-8 lift-card"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="text-xl font-semibold text-foreground">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
