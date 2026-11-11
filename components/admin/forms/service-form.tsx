'use client'

import { useActionState, useState } from 'react'
import { saveService } from '@/lib/admin/actions'
import { fieldValues, initialFormState } from '@/lib/admin/form'
import type { Service } from '@/lib/content-types'
import { SERVICE_MIN_WORDS } from '@/lib/seo-rules'
import { cn } from '@/lib/utils'
import { Card } from '@/components/admin/ui'
import { ListField, TextAreaField, TextField, ToggleField } from '@/components/admin/fields'
import { FormActions, FormAlert, IconSelectField } from '@/components/admin/form-controls'
import { SeoFields } from '@/components/admin/seo-fields'

const FORMAT_HELP = 'Blank line = new paragraph · "## " = heading · "- " = bullet · **bold** · [link text](/contact)'

const words = (text: string) => text.split(/\s+/).filter(Boolean).length

function faqText(service?: Service) {
  return (service?.faqs ?? []).map((faq) => `${faq.question}\n${faq.answer}`).join('\n\n')
}

export function ServiceForm({ service, shortName }: { service?: Service; shortName: string }) {
  const [state, action] = useActionState(saveService, initialFormState)
  const e = state.errors ?? {}
  const f = fieldValues(state)

  // Live word count for the "ready for Google" indicator.
  const [content, setContent] = useState({
    body: f.text('body', service?.body),
    audience: f.text('audience', service?.audience),
    faqs: state.values?.faqs ?? faqText(service),
  })
  const count = words(content.body) + words(content.audience) + words(content.faqs)
  const ready = count >= SERVICE_MIN_WORDS
  const title = f.text('title', service?.title) || 'Service'

  return (
    <form action={action} noValidate>
      <FormAlert state={state} />
      {service && <input type="hidden" name="id" value={service.id} />}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card title="Details" description="Shown on the home page, the Services page and at the top of this service’s page.">
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
                help="Shown on the Services page and as the introduction of this service’s page."
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

          <Card
            title="Service page content"
            description="The detail that helps this page rank: what you do, how you work, results, pricing factors. Write for clients, not for Google."
          >
            <div className="flex flex-col gap-5" onChange={(event) => {
              const target = event.target as unknown as HTMLTextAreaElement
              if (target.name in content) setContent((c) => ({ ...c, [target.name]: target.value }))
            }}>
              <TextAreaField
                name="body"
                label="Main content"
                optional
                rows={12}
                defaultValue={content.body}
                error={e.body}
                help={FORMAT_HELP}
              />
              <TextAreaField
                name="audience"
                label="Who it is for"
                optional
                rows={5}
                defaultValue={content.audience}
                error={e.audience}
                help="The kinds of businesses you help and the problems this service solves."
              />
              <TextAreaField
                name="faqs"
                label="Frequently asked questions"
                optional
                rows={8}
                defaultValue={content.faqs}
                error={e.faqs}
                placeholder={'How long does a website take?\nMost business websites take 4 to 8 weeks, depending on…\n\nDo you offer maintenance?\nYes. …'}
                help="Question on the first line, answer on the next. Leave a blank line between questions."
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
                defaultChecked={f.checked('published', service?.published ?? true)}
              />
              <div
                className={cn(
                  'rounded-xl border p-4 text-sm',
                  ready ? 'border-accent/25 bg-accent/5' : 'border-amber-300/50 bg-amber-50 dark:border-amber-400/20 dark:bg-amber-400/5',
                )}
              >
                <p className="font-medium text-foreground">
                  {ready ? 'Ready for Google' : 'Not in Google yet'}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {ready
                    ? 'This page has enough content to be indexed.'
                    : `Service pages are kept out of Google until they have at least ${SERVICE_MIN_WORDS} words of content, so thin pages don't hurt the site.`}
                </p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn('h-full rounded-full transition-[width] duration-300', ready ? 'bg-accent' : 'bg-amber-500')}
                    style={{ width: `${Math.min(100, (count / SERVICE_MIN_WORDS) * 100)}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs tabular-nums text-muted-foreground">
                  {count} / {SERVICE_MIN_WORDS} words
                </p>
              </div>
            </div>
          </Card>
          <Card title="Appearance">
            <div className="flex flex-col gap-5">
              <IconSelectField defaultValue={service?.icon} error={e.icon} />
              <TextField
                name="slug"
                label="URL slug"
                optional
                defaultValue={f.text('slug', service?.slug)}
                error={e.slug}
                help="The page address: /services/your-slug. Changing it breaks old links. Leave blank to generate."
              />
            </div>
          </Card>
          <SeoFields
            path={`/services/${f.text('slug', service?.slug) || 'your-slug'}`}
            folder="services"
            defaults={{
              title: `${title} Services | ${shortName}`,
              description: f.text('description', service?.description) || 'The description above, shortened.',
            }}
            values={{
              seoTitle: f.text('seo_title', service?.seoTitle),
              seoDescription: f.text('seo_description', service?.seoDescription),
              shareImage: service?.shareImage ?? null,
              noindex: f.checked('noindex', service?.noindex ?? false),
            }}
            errors={e}
            noindexHelp="Always keep this page out of Google, even when it has enough content."
          />
        </div>
      </div>

      <div className="mt-6">
        <FormActions cancelHref="/admin/services" isNew={!service} />
      </div>
    </form>
  )
}
