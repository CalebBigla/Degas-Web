'use client'

import { useActionState } from 'react'
import { saveCoreValue } from '@/lib/admin/actions'
import { fieldValues, initialFormState } from '@/lib/admin/form'
import type { CoreValue } from '@/lib/content-types'
import { Card } from '@/components/admin/ui'
import { TextAreaField, TextField, ToggleField } from '@/components/admin/fields'
import { FormActions, FormAlert, IconSelectField } from '@/components/admin/form-controls'

export function ValueForm({ value }: { value?: CoreValue }) {
  const [state, action] = useActionState(saveCoreValue, initialFormState)
  const e = state.errors ?? {}
  const f = fieldValues(state)

  return (
    <form action={action} noValidate>
      <FormAlert state={state} />
      {value && <input type="hidden" name="id" value={value.id} />}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Details" description="Shown on the home page and the About page.">
            <div className="flex flex-col gap-5">
              <TextField name="title" label="Title" defaultValue={f.text('title', value?.title)} error={e.title} />
              <TextAreaField
                name="description"
                label="Description"
                rows={3}
                defaultValue={f.text('description', value?.description)}
                error={e.description}
              />
            </div>
          </Card>
        </div>
        <div className="flex flex-col gap-6">
          <Card title="Visibility">
            <ToggleField
              name="published"
              label="Published"
              description="Visible on the public site."
              defaultChecked={f.checked('published', value?.published ?? true)}
            />
          </Card>
          <Card title="Appearance">
            <IconSelectField defaultValue={value?.icon} error={e.icon} />
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <FormActions cancelHref="/admin/values" isNew={!value} />
      </div>
    </form>
  )
}
