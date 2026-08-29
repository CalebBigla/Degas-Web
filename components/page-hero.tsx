import { Eyebrow } from '@/components/section-heading'

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <section className="border-b border-border bg-navy px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="text-balance text-4xl font-bold text-navy-foreground sm:text-5xl">
          {title}
        </h1>
        <p className="max-w-2xl text-pretty text-lg leading-relaxed text-navy-muted">
          {description}
        </p>
      </div>
    </section>
  )
}
