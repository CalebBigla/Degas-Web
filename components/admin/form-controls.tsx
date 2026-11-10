'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { AlertCircle, Loader2 } from 'lucide-react'
import { getIcon, iconNames } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { buttonClass } from '@/components/admin/ui'
import { Field, inputClass } from '@/components/admin/fields'
import type { FormState } from '@/lib/admin/form'

export function SubmitButton({
  children,
  pendingLabel = 'Saving…',
  className,
}: {
  children: React.ReactNode
  pendingLabel?: string
  className?: string
}) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn(buttonClass('primary'), className)}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {pending ? pendingLabel : children}
    </button>
  )
}

export function FormAlert({ state }: { state: FormState }) {
  if (!state.message) return null
  return (
    <div
      role="alert"
      className="mb-6 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{state.message}</span>
    </div>
  )
}

/** Save / Cancel row placed at the end of every editor form. */
export function FormActions({ cancelHref, isNew }: { cancelHref: string; isNew: boolean }) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
      <Link href={cancelHref} className={buttonClass('ghost')}>
        Cancel
      </Link>
      <SubmitButton>{isNew ? 'Create' : 'Save changes'}</SubmitButton>
    </div>
  )
}

export function IconSelectField({
  name = 'icon',
  label = 'Icon',
  defaultValue,
  error,
}: {
  name?: string
  label?: string
  defaultValue?: string
  error?: string
}) {
  const [value, setValue] = useState(defaultValue || iconNames[0])
  const Icon = getIcon(value)
  return (
    <Field name={name} label={label} error={error}>
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy text-navy-foreground">
          <Icon className="h-5 w-5" />
        </span>
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-invalid={Boolean(error)}
          className={inputClass}
        >
          {iconNames.map((icon) => (
            <option key={icon} value={icon}>
              {icon.replace(/([a-z])([A-Z0-9])/g, '$1 $2')}
            </option>
          ))}
        </select>
      </div>
    </Field>
  )
}
