'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const MESSAGES: Record<string, { text: string; error?: boolean }> = {
  created: { text: 'Created. It is live on the site now if published.' },
  updated: { text: 'Changes saved and published to the site.' },
  deleted: { text: 'Deleted.' },
  password: { text: 'Password updated.' },
  error: { text: 'Something went wrong. Please try again.', error: true },
}

/** Shows the result of the last action (?status=…), then clears it from the URL. */
export function StatusToast() {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const status = params.get('status')
  const [visible, setVisible] = useState<string | null>(null)

  useEffect(() => {
    if (!status || !MESSAGES[status]) return
    setVisible(status)
    router.replace(pathname, { scroll: false })
    const timer = window.setTimeout(() => setVisible(null), 5000)
    return () => window.clearTimeout(timer)
  }, [status, pathname, router])

  if (!visible) return null
  const message = MESSAGES[visible]

  return (
    <div
      role="status"
      key={visible}
      className={cn(
        'fixed bottom-6 right-6 z-[60] w-[min(22rem,calc(100vw-3rem))] animate-toast-in overflow-hidden rounded-xl border bg-popover text-sm shadow-2xl motion-reduce:animate-none',
        message.error ? 'border-destructive/30' : 'border-border',
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <span
          className={cn(
            'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
            message.error ? 'bg-destructive/10 text-destructive' : 'bg-accent/15 text-accent',
          )}
        >
          {message.error ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
        </span>
        <div className="flex-1 pt-0.5">
          <p className="font-semibold text-foreground">{message.error ? 'Something went wrong' : 'Done'}</p>
          <p className="mt-0.5 text-muted-foreground">{message.text}</p>
        </div>
        <button
          type="button"
          onClick={() => setVisible(null)}
          aria-label="Dismiss"
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {/* Time left before it closes */}
      <span
        aria-hidden="true"
        className={cn(
          'block h-0.5 origin-left animate-drain [animation-duration:5s] motion-reduce:hidden',
          message.error ? 'bg-destructive' : 'bg-accent',
        )}
      />
    </div>
  )
}
