'use client'

import { useActionState } from 'react'
import { changePassword } from '@/lib/admin/actions'
import { initialFormState } from '@/lib/admin/form'
import { TextField } from '@/components/admin/fields'
import { FormAlert, SubmitButton } from '@/components/admin/form-controls'

export function PasswordForm() {
  const [state, action] = useActionState(changePassword, initialFormState)
  const e = state.errors ?? {}

  return (
    <form action={action} noValidate className="flex flex-col gap-5">
      <FormAlert state={state} />
      <TextField
        name="password"
        label="New password"
        type="password"
        autoComplete="new-password"
        error={e.password}
        help="At least 10 characters."
      />
      <TextField
        name="confirm"
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        error={e.confirm}
      />
      <div className="flex justify-end">
        <SubmitButton pendingLabel="Updating…">Update password</SubmitButton>
      </div>
    </form>
  )
}
