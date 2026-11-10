'use client'

import { useActionState } from 'react'
import { saveService } from '@/lib/admin/actions'
import { fieldValues, initialFormState } from '@/lib/admin/form'
import type { Service } from '@/lib/content-types'
import { Card } from '@/components/admin/ui'
import { ListField, TextAreaField, TextField, ToggleField } from '@/components/admin/fields'
import { FormActions, FormAlert, IconSelectField } from '@/components/admin/form-controls'

export function ServiceForm({ service }: { service?: Service }) {
  const [state, action] = useActionState(saveService, initialFormState)
  const e = state.errors ?? {}
  const f = fieldValues(state)

  return (
    <form action={action} noValidate>
      <FormAlert state={state} />
      {service && <input type="hidden" name="id" value={service.id} />}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card title="Details">
            <div className="flex flex-col gap-5">
              <TextField name="title" label="Title" defaultValue={f.text('title', service?.title)} error={e.title} />
              <TextField
                name="summary"
                label="Summary"
                maxLength={160}
                defaultValue={f.text('summary', service?.summary)}
                error={e.summary}
                help="One line, shown on the home page cards."
              />
              <TextAreaField
                name="description"
                label="Description"
                rows={4}
                defaultValue={f.text('description', service?.description)}
                error={e.description}
                help="Shown on the Services page."
              />
              <ListField
                name="included"
                label="What's included"
                rows={5}
                defaultValue={f.list('included', service?.included)}
                error={e.included}
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
              defaultChecked={f.checked('published', service?.published ?? true)}
            />
          </Card>
          <Card title="Appearance">
            <div className="flex flex-col gap-5">
              <IconSelectField defaultValue={service?.icon} error={e.icon} />
              <TextField
                name="slug"
                label="Anchor slug"
                optional
                defaultValue={f.text('slug', service?.slug)}
                error={e.slug}
                help="Links straight to this service: /services#slug. Leave blank to generate."
              />
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <FormActions cancelHref="/admin/services" isNew={!service} />
      </div>
    </form>
  )
}
