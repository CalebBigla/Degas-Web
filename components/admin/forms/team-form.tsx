'use client'

import { useActionState } from 'react'
import { saveTeamMember } from '@/lib/admin/actions'
import { fieldValues, initialFormState } from '@/lib/admin/form'
import type { TeamMember } from '@/lib/content-types'
import { Card } from '@/components/admin/ui'
import { TextAreaField, TextField, ToggleField } from '@/components/admin/fields'
import { FormActions, FormAlert } from '@/components/admin/form-controls'
import { ImageField } from '@/components/admin/image-field'

export function TeamForm({ member }: { member?: TeamMember }) {
  const [state, action] = useActionState(saveTeamMember, initialFormState)
  const e = state.errors ?? {}
  const f = fieldValues(state)

  return (
    <form action={action} noValidate>
      <FormAlert state={state} />
      {member && <input type="hidden" name="id" value={member.id} />}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Profile" description="Shown in the team section of the About page.">
            <div className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField name="name" label="Name" defaultValue={f.text('name', member?.name)} error={e.name} />
                <TextField
                  name="experience"
                  label="Experience"
                  optional
                  placeholder="5+ years experience"
                  defaultValue={f.text('experience', member?.experience)}
                  error={e.experience}
                />
              </div>
              <TextField name="role" label="Role" defaultValue={f.text('role', member?.role)} error={e.role} />
              <TextAreaField name="bio" label="Short bio" optional rows={3} defaultValue={f.text('bio', member?.bio)} error={e.bio} />
              <TextField
                name="linkedin"
                label="LinkedIn URL"
                type="url"
                optional
                placeholder="https://linkedin.com/in/…"
                defaultValue={f.text('linkedin', member?.linkedin)}
                error={e.linkedin}
              />
            </div>
          </Card>
        </div>
        <div className="flex flex-col gap-6">
          <Card title="Visibility">
            <ToggleField
              name="published"
              label="Published"
              description="Visible on the About page."
              defaultChecked={f.checked('published', member?.published ?? true)}
            />
          </Card>
          <Card title="Photo">
            <ImageField
              name="image_url"
              label="Headshot"
              folder="team"
              aspect="square"
              defaultValue={member?.image}
              error={e.image_url}
              help="Square, at least 400×400. Without a photo, initials are shown."
            />
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <FormActions cancelHref="/admin/team" isNew={!member} />
      </div>
    </form>
  )
}
