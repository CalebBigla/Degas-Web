import { AlertTriangle } from 'lucide-react'

/** Body wrapper for the Privacy and Terms pages: draft notice + readable column. */
export function LegalBody({
  lastUpdated,
  children,
}: {
  lastUpdated: string
  children: React.ReactNode
}) {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <div
          role="note"
          className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-6"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div>
            <p className="text-sm font-semibold text-foreground">Draft — pending legal review</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              This document is a plain-English draft and has not yet been reviewed by a
              lawyer. It will be updated before it is relied on.
            </p>
          </div>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

        <div className="mt-8 flex flex-col gap-10">{children}</div>
      </div>
    </section>
  )
}

export function LegalSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 text-base leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:text-accent [&_a]:underline-offset-4 hover:[&_a]:underline [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      {children}
    </div>
  )
}
