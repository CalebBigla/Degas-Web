'use client'

import { useActionState } from 'react'
import { saveClient } from '@/lib/admin/actions'
import { fieldValues, initialFormState } from '@/lib/admin/form'
import type { Client } from '@/lib/content-types'
import { Card } from '@/components/admin/ui'
import { TextField, ToggleField } from '@/components/admin/fields'
import { FormActions, FormAlert } from '@/components/admin/form-controls'
import { ImageField } from '@/components/admin/image-field'

export function ClientForm({ client }: { client?: Client }) {
  const [state, action] = useActionState(saveClient, initialFormState)
  const e = state.errors ?? {}
  const f = fieldValues(state)

  return (
    <form action={action} noValidate>
      <FormAlert state={state} />
      {client && <input type="hidden" name="id" value={client.id} />}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Client" description="Shown in the logo strip on the home page.">
            <div className="flex flex-col gap-5">
              <TextField
                name="name"
                label="Client name"
                defaultValue={f.text('name', client?.name)}
                error={e.name}
                help="Used as the logo's alt text, or shown as text if there is no logo."
              />
              <ImageField
                name="logo_url"
                label="Logo"
                folder="clients"
                aspect="wide"
                contain
                defaultValue={client?.logo}
                error={e.logo_url}
                help="SVG or transparent PNG, ideally a single colour. Shown greyscale until hovered."
              />
            </div>
          </Card>
        </div>
        <div>
          <Card title="Visibility">
            <ToggleField
              name="published"
              label="Published"
              description="Only show clients who have agreed to be listed."
              defaultChecked={f.checked('published', client?.published ?? true)}
            />
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <FormActions cancelHref="/admin/clients" isNew={!client} />
      </div>
    </form>
  )
}
