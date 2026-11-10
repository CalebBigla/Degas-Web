'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { ArrowDown, ArrowUp, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { deleteItem, moveItem } from '@/lib/admin/actions'
import { cn } from '@/lib/utils'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'

const iconButton =
  'inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color,transform] duration-200 hover:bg-secondary hover:text-foreground active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-30'

function PendingIconButton({
  label,
  disabled,
  children,
  className,
}: {
  label: string
  disabled?: boolean
  children: React.ReactNode
  className?: string
}) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      aria-label={label}
      title={label}
      disabled={disabled || pending}
      className={cn(iconButton, pending && 'animate-pulse', className)}
    >
      {children}
    </button>
  )
}

export function RowActions({
  table,
  id,
  name,
  editHref,
  viewHref,
  isFirst,
  isLast,
}: {
  table: string
  id: string
  name: string
  editHref: string
  viewHref?: string
  isFirst: boolean
  isLast: boolean
}) {
  const deleteForm = useRef<HTMLFormElement>(null)
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="flex items-center justify-end gap-0.5">
      <form action={moveItem.bind(null, table, id, 'up')}>
        <PendingIconButton label={`Move ${name} up`} disabled={isFirst}>
          <ArrowUp className="h-4 w-4" />
        </PendingIconButton>
      </form>
      <form action={moveItem.bind(null, table, id, 'down')}>
        <PendingIconButton label={`Move ${name} down`} disabled={isLast}>
          <ArrowDown className="h-4 w-4" />
        </PendingIconButton>
      </form>
      {viewHref && (
        <a
          href={viewHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${name} on the site`}
          title="View on site"
          className={cn(iconButton, 'hidden sm:inline-flex')}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
      <Link href={editHref} aria-label={`Edit ${name}`} title="Edit" className={iconButton}>
        <Pencil className="h-4 w-4" />
      </Link>
      <form
        ref={deleteForm}
        action={deleteItem.bind(null, table, id)}
        onSubmit={(event) => {
          // Ask first; the dialog submits the form again once confirmed.
          if (!confirming) {
            event.preventDefault()
            setConfirming(true)
          }
        }}
      >
        <PendingIconButton
          label={`Delete ${name}`}
          className="hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </PendingIconButton>
      </form>
      <ConfirmDialog
        open={confirming}
        title={`Delete “${name}”?`}
        description="It will be removed from the site straight away. This cannot be undone."
        onConfirm={() => deleteForm.current?.requestSubmit()}
        onClose={() => setConfirming(false)}
      />
    </div>
  )
}
