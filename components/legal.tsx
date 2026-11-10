import { AlertTriangle } from 'lucide-react'
import { RichText } from '@/components/rich-text'
import type { GroupItem } from '@/lib/pages/definitions'

type LegalCopy = {
  'notice.show': boolean
  'notice.title': string
  'notice.body': string
  'meta.lastUpdatedLabel': string
  'meta.lastUpdated': string
  sections: GroupItem[]
}

/** Body of the Privacy and Terms pages: optional draft notice + readable column. */
export function LegalBody({ copy }: { copy: LegalCopy }) {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-3xl">
        {copy['notice.show'] && (
          <div
            role="note"
            className="mb-8 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-6"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div>
              <p className="text-sm font-semibold text-foreground">{copy['notice.title']}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {copy['notice.body']}
              </p>
            </div>
          </div>
        )}

        {copy['meta.lastUpdated'] && (
          <p className="text-sm text-muted-foreground">{copy['meta.lastUpdatedLabel']}: {copy['meta.lastUpdated']}</p>
        )}

        <div className="mt-8 flex flex-col gap-10">
          {copy.sections.map((section, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 text-base leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:text-accent [&_a]:underline-offset-4 hover:[&_a]:underline [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5"
            >
              <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
              <RichText text={section.body ?? ''} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
