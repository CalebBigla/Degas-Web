'use client'

import { useActionState } from 'react'
import { savePost } from '@/lib/admin/actions'
import { fieldValues, initialFormState } from '@/lib/admin/form'
import type { Post } from '@/lib/content-types'
import { Card } from '@/components/admin/ui'
import { Field, TextAreaField, TextField, ToggleField, inputClass } from '@/components/admin/fields'
import { FormActions, FormAlert } from '@/components/admin/form-controls'
import { ImageField } from '@/components/admin/image-field'
import { SeoFields } from '@/components/admin/seo-fields'

const FORMAT_HELP =
  'Blank line = new paragraph · "## " = section heading · "### " = sub-heading · "- " = bullet · **bold** · [link text](/services/web-development)'

/** yyyy-mm-dd for a date input. */
function dateValue(iso: string | null | undefined) {
  return iso ? iso.slice(0, 10) : ''
}

export function PostForm({ post, shortName }: { post?: Post; shortName: string }) {
  const [state, action] = useActionState(savePost, initialFormState)
  const e = state.errors ?? {}
  const f = fieldValues(state)

  return (
    <form action={action} noValidate>
      <FormAlert state={state} />
      {post && <input type="hidden" name="id" value={post.id} />}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card title="Article" description="Write for the client you want to help: answer their real question clearly and link to the relevant service.">
            <div className="flex flex-col gap-5">
              <TextField
                name="title"
                label="Title"
                defaultValue={f.text('title', post?.title)}
                error={e.title}
                placeholder="How much does a business website cost in Nigeria?"
              />
              <TextAreaField
                name="excerpt"
                label="Summary"
                rows={3}
                maxLength={300}
                defaultValue={f.text('excerpt', post?.excerpt)}
                error={e.excerpt}
                help="One or two sentences shown on the Insights page and under the title."
              />
              <TextAreaField
                name="body"
                label="Article"
                rows={22}
                defaultValue={f.text('body', post?.body)}
                error={e.body}
                help={FORMAT_HELP}
              />
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card title="Publishing">
            <div className="flex flex-col gap-5">
              <ToggleField
                name="published"
                label="Published"
                description="Visible on the site. Drafts are only visible here."
                defaultChecked={f.checked('published', post?.published ?? false)}
              />
              <Field
                name="published_at"
                label="Publish date"
                optional
                error={e.published_at}
                help="Leave blank to use today’s date when you publish."
              >
                <input
                  id="published_at"
                  name="published_at"
                  type="date"
                  defaultValue={state.values?.published_at ?? dateValue(post?.publishedAt)}
                  className={inputClass}
                />
              </Field>
              <TextField
                name="author"
                label="Author"
                optional
                defaultValue={f.text('author', post?.author)}
                error={e.author}
                help={`A real person’s name builds trust. Leave blank to show “${shortName}”.`}
              />
              <TextField
                name="slug"
                label="URL slug"
                optional
                defaultValue={f.text('slug', post?.slug)}
                error={e.slug}
                help="The page address: /insights/your-slug. Leave blank to generate it from the title."
              />
            </div>
          </Card>

          <Card title="Cover image">
            <ImageField
              name="cover_image"
              label="Image"
              folder="insights"
              defaultValue={post?.coverImage}
              error={e.cover_image}
              help="16:9, at least 1600px wide."
            />
            <div className="mt-5">
              <TextField
                name="cover_alt"
                label="Image description (alt text)"
                optional
                defaultValue={f.text('cover_alt', post?.coverAlt)}
                error={e.cover_alt}
                help="Required when there is an image. Describe what it shows."
              />
            </div>
          </Card>

          <SeoFields
            path={`/insights/${f.text('slug', post?.slug) || 'your-slug'}`}
            folder="insights"
            defaults={{
              title: `${f.text('title', post?.title) || 'Article title'} | ${shortName}`,
              description: f.text('excerpt', post?.excerpt) || 'The summary above.',
            }}
            values={{
              seoTitle: f.text('seo_title', post?.seoTitle),
              seoDescription: f.text('seo_description', post?.seoDescription),
              shareImage: post?.shareImage ?? null,
              noindex: f.checked('noindex', post?.noindex ?? false),
            }}
            errors={e}
          />
        </div>
      </div>

      <div className="mt-6">
        <FormActions cancelHref="/admin/insights" isNew={!post} />
      </div>
    </form>
  )
}
