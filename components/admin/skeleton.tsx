import { cn } from '@/lib/utils'

/** Shimmering placeholder block. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('admin-skeleton animate-shimmer rounded-md motion-reduce:animate-none', className)}
    />
  )
}

function Loading({ children }: { children: React.ReactNode }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading…</span>
      {children}
    </div>
  )
}

function HeaderSkeleton({ action = true }: { action?: boolean }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div className="flex flex-col gap-2.5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      {action && <Skeleton className="hidden h-9 w-32 rounded-lg sm:block" />}
    </div>
  )
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <Loading>
      <HeaderSkeleton />
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex gap-6 border-b border-border px-5 py-3.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="ml-auto hidden h-3 w-16 md:block" />
          <Skeleton className="h-3 w-14" />
        </div>
        {Array.from({ length: rows }, (_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-border px-5 py-4 last:border-0"
            style={{ opacity: 1 - i * 0.12 }}
          >
            <Skeleton className="h-10 w-14 rounded-lg" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-3.5 w-1/3" />
              <Skeleton className="h-3 w-1/5" />
            </div>
            <Skeleton className="hidden h-5 w-20 rounded-full md:block" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        ))}
      </div>
    </Loading>
  )
}

export function FormSkeleton() {
  return (
    <Loading>
      <HeaderSkeleton action={false} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="flex flex-col gap-6">
          {[4, 3].map((fields, card) => (
            <div key={card} className="rounded-2xl border border-border bg-card p-6">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-2 h-3 w-56" />
              <div className="mt-6 flex flex-col gap-5">
                {Array.from({ length: fields }, (_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className={cn('w-full rounded-lg', i === 2 ? 'h-24' : 'h-10')} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-5 h-6 w-full rounded-full" />
            <Skeleton className="mt-3 h-6 w-full rounded-full" />
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-5 aspect-video w-full rounded-xl" />
          </div>
        </div>
      </div>
    </Loading>
  )
}

export function OverviewSkeleton() {
  return (
    <Loading>
      <div className="mb-8 flex flex-col gap-2.5">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
            <Skeleton className="mt-4 h-8 w-14" />
            <Skeleton className="mt-3 h-1.5 w-full rounded-full" />
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-3">
          <Skeleton className="h-4 w-36" />
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="mt-5 flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-3.5 flex-1" />
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <Skeleton className="h-4 w-32" />
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="mt-5 flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="flex flex-1 flex-col gap-1.5">
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Loading>
  )
}

export function ListSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <Loading>
      <HeaderSkeleton action={false} />
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-border px-5 py-4 last:border-0">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <Skeleton className="hidden h-5 w-24 rounded-full sm:block" />
          </div>
        ))}
      </div>
    </Loading>
  )
}
