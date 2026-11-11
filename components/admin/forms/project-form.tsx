'use client'

import { useActionState } from 'react'
import { saveProject } from '@/lib/admin/actions'
import { fieldValues, initialFormState } from '@/lib/admin/form'
import type { Project } from '@/lib/content-types'
import { Card } from '@/components/admin/ui'
import { ListField, TextAreaField, TextField, ToggleField } from '@/components/admin/fields'
import { FormActions, FormAlert } from '@/components/admin/form-controls'
import { ImageField } from '@/components/admin/image-field'
import { SeoFields } from '@/components/admin/seo-fields'

export function ProjectForm({
  project,
  services,
  shortName,
}: {
  project?: Project
  services: { id: string; title: string }[]
  shortName: string
}) {
  const [state, action] = useActionState(saveProject, initialFormState)
  const e = state.errors ?? {}
  const f = fieldValues(state)
  // After a failed save, re-tick what was submitted; otherwise what is saved.
  const checkedServices = state.values
    ? new Set((state.values.service_ids ?? '').split('\n').filter(Boolean))
    : new Set(project?.serviceIds ?? [])

  return (
    <form action={action} noValidate>
      <FormAlert state={state} />
      {project && <input type="hidden" name="id" value={project.id} />}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card title="Details" description="Shown on project cards and at the top of the case study.">
            <div className="flex flex-col gap-5">
              <TextField name="title" label="Title" defaultValue={f.text('title', project?.title)} error={e.title} required />
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  name="category"
                  label="Category"
                  placeholder="e.g. Fintech / Compliance"
                  defaultValue={f.text('category', project?.category)}
                  error={e.category}
                />
                <TextField
                  name="slug"
                  label="URL slug"
                  optional
                  placeholder="generated-from-title"
                  defaultValue={f.text('slug', project?.slug)}
                  error={e.slug}
                  help="The page address: /work/your-slug. Leave blank to generate it."
                />
              </div>
              <TextAreaField
                name="description"
                label="Short description"
                rows={3}
                maxLength={280}
                defaultValue={f.text('description', project?.description)}
                error={e.description}
                help="One or two sentences, up to 280 characters."
              />
            </div>
          </Card>

          <Card
            title="Case study"
            description="Leave any field blank to use the standard wording shown on the site today."
          >
            <div className="flex flex-col gap-5">
              <TextAreaField
                name="overview"
                label="Overview"
                optional
                rows={5}
                defaultValue={f.text('overview', project?.overview)}
                error={e.overview}
              />
              <TextAreaField
                name="approach"
                label="The approach"
                optional
                rows={5}
                defaultValue={f.text('approach', project?.approach)}
                error={e.approach}
              />
              <ListField
                name="highlights"
                label="What we delivered"
                optional
                rows={5}
                defaultValue={f.list('highlights', project?.highlights)}
                error={e.highlights}
              />
              <TextAreaField
                name="results"
                label="Results"
                optional
                rows={4}
                defaultValue={f.text('results', project?.results)}
                error={e.results}
                help="Measurable outcomes (e.g. “Onboarding time cut from 3 days to 20 minutes”). Only share figures the client has approved."
              />
              <fieldset className="flex flex-col gap-2">
                <legend className="text-sm font-medium text-foreground">
                  Services used <span className="font-normal text-muted-foreground">(optional)</span>
                </legend>
                <p className="text-xs text-muted-foreground">
                  Links this case study from those service pages, and the service names in its details box.
                </p>
                <div className="mt-1 grid gap-2 sm:grid-cols-2">
                  {services.map((service) => (
                    <label
                      key={service.id}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-secondary has-[:checked]:border-accent/40 has-[:checked]:bg-accent/5"
                    >
                      <input
                        type="checkbox"
                        name="service_ids"
                        value={service.id}
                        defaultChecked={checkedServices.has(service.id)}
                        className="h-4 w-4 accent-[var(--accent)]"
                      />
                      {service.title}
                    </label>
                  ))}
                </div>
              </fieldset>
              <TextField
                name="services_label"
                label="Services text"
                optional
                placeholder="Design & Development"
                defaultValue={f.text('services_label', project?.servicesLabel)}
                error={e.services_label}
                help="Used in the details box when no services are ticked above."
              />
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card title="Visibility">
            <div className="flex flex-col gap-5">
              <ToggleField
                name="published"
                label="Published"
                description="Visible on the public site."
                defaultChecked={f.checked('published', project?.published ?? true)}
              />
              <ToggleField
                name="featured"
                label="Featured"
                description="Shown in Featured Work on the home page (first 4)."
                defaultChecked={f.checked('featured', project?.featured ?? false)}
              />
            </div>
          </Card>

          <Card title="Cover image">
            <ImageField
              name="cover_image"
              label="Screenshot or mockup"
              folder="projects"
              defaultValue={project?.coverImage}
              error={e.cover_image}
              help="16:10 or 16:9 works best, at least 1600px wide."
            />
            <div className="mt-5">
              <TextField
                name="cover_alt"
                label="Image description (alt text)"
                optional
                defaultValue={f.text('cover_alt', project?.coverAlt)}
                error={e.cover_alt}
                help="Describe what the image shows, e.g. “Dashboard of the KYC verification system”."
              />
            </div>
          </Card>

          <SeoFields
            path={`/work/${f.text('slug', project?.slug) || 'your-slug'}`}
            folder="projects"
            defaults={{
              title: `${f.text('title', project?.title) || 'Project'} Case Study | ${shortName}`,
              description: f.text('description', project?.description) || 'The short description, shortened.',
            }}
            values={{
              seoTitle: f.text('seo_title', project?.seoTitle),
              seoDescription: f.text('seo_description', project?.seoDescription),
              shareImage: project?.shareImage ?? null,
              noindex: f.checked('noindex', project?.noindex ?? false),
            }}
            errors={e}
          />
        </div>
      </div>

      <div className="mt-6">
        <FormActions cancelHref="/admin/projects" isNew={!project} />
      </div>
    </form>
  )
}
