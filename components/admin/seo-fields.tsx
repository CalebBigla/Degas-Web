'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/admin/ui'
import { Field, ToggleField, inputClass } from '@/components/admin/fields'
import { ImageField } from '@/components/admin/image-field'
import { siteUrl } from '@/lib/site-data'

const HOST = new URL(siteUrl).host

const TITLE_IDEAL = 60
const DESCRIPTION_IDEAL = 160

function Counter({ length, ideal }: { length: number; ideal: number }) {
  return (
    <span
      className={cn(
        'tabular-nums',
        length === 0 ? 'text-muted-foreground' : length > ideal ? 'text-amber-600 dark:text-amber-400' : 'text-accent',
      )}
    >
      {length}/{ideal}
    </span>
  )
}

/**
 * "Search & sharing" card: SEO title, meta description, share image and a
 * noindex switch, with a live preview of the Google result. Empty fields fall
 * back to the generated defaults shown as placeholders.
 */
export function SeoFields({
  path,
  defaults,
  values,
  errors = {},
  folder,
  noindexHelp,
}: {
  /** Public path of the page, e.g. "/services/web-development". */
  path: string
  /** What is used when a field is left blank. */
  defaults: { title: string; description: string }
  values: { seoTitle: string; seoDescription: string; shareImage: string | null; noindex: boolean }
  errors?: Record<string, string | undefined>
  folder: string
  noindexHelp?: string
}) {
  const [title, setTitle] = useState(values.seoTitle)
  const [description, setDescription] = useState(values.seoDescription)
  const shownTitle = title || defaults.title
  const shownDescription = description || defaults.description

  return (
    <Card
      title="Search & sharing"
      description="How this page appears in Google and in link previews. Leave blank to use the defaults."
    >
      <div className="flex flex-col gap-5">
        {/* Google result preview */}
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Google preview</p>
          <p className="mt-2 truncate text-xs text-muted-foreground">{HOST}{path === '/' ? '' : path.replaceAll('/', ' › ')}</p>
          <p className="mt-1 line-clamp-1 text-lg leading-snug text-[#1a0dab] dark:text-[#8ab4f8]">{shownTitle}</p>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{shownDescription}</p>
        </div>

        <Field
          name="seo_title"
          label="SEO title"
          optional
          error={errors.seo_title}
          help="Shown exactly as typed. Lead with the service or topic, end with your brand."
        >
          <div className="relative">
            <input
              id="seo_title"
              name="seo_title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={90}
              placeholder={defaults.title}
              aria-invalid={Boolean(errors.seo_title)}
              className={cn(inputClass, 'pr-16')}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs">
              <Counter length={title.length} ideal={TITLE_IDEAL} />
            </span>
          </div>
        </Field>

        <Field
          name="seo_description"
          label="Meta description"
          optional
          error={errors.seo_description}
          help="What the page offers and why to click. Google may shorten or rewrite it."
        >
          <div className="relative">
            <textarea
              id="seo_description"
              name="seo_description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={300}
              placeholder={defaults.description}
              aria-invalid={Boolean(errors.seo_description)}
              className={cn(inputClass, 'resize-y pb-6 leading-relaxed')}
            />
            <span className="pointer-events-none absolute bottom-2 right-3 text-xs">
              <Counter length={description.length} ideal={DESCRIPTION_IDEAL} />
            </span>
          </div>
        </Field>

        <ImageField
          name="share_image"
          label="Share image (optional)"
          folder={folder}
          aspect="video"
          defaultValue={values.shareImage}
          error={errors.share_image}
          help="Shown when the link is shared on WhatsApp, LinkedIn or X. 1200×630 works best. Without one, the cover image or a generated card is used."
        />

        <ToggleField
          name="noindex"
          label="Hide from search engines"
          description={noindexHelp ?? 'Keeps this page out of Google and the sitemap. Visitors can still open it.'}
          defaultChecked={values.noindex}
        />
      </div>
    </Card>
  )
}
