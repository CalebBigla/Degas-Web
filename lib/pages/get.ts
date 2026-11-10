import { cache } from 'react'
import { getSettings } from '@/lib/content'
import type { SiteSettings } from '@/lib/content-types'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createSupabasePublicClient } from '@/lib/supabase/server'
import {
  pageDefaults,
  pageFields,
  sanitizeField,
  type PageContent,
  type PageSlug,
  type PageValue,
} from '@/lib/pages/definitions'

/** Saved content for one page (raw, before defaults or placeholders). */
export async function loadStoredPage(
  slug: PageSlug,
  client?: ReturnType<typeof createSupabasePublicClient>,
): Promise<Record<string, unknown>> {
  if (!isSupabaseConfigured) return {}
  try {
    const { data, error } = await (client ?? createSupabasePublicClient())
      .from('pages')
      .select('content')
      .eq('slug', slug)
      .maybeSingle()
    if (error) {
      console.error(`[content] Could not load page "${slug}":`, error.message)
      return {}
    }
    const content = data?.content
    return content && typeof content === 'object' && !Array.isArray(content)
      ? (content as Record<string, unknown>)
      : {}
  } catch (error) {
    console.error(`[content] Could not load page "${slug}":`, (error as Error).message)
    return {}
  }
}

/** Saved values merged over the defaults, without placeholders filled in. */
export function mergeWithDefaults<S extends PageSlug>(
  slug: S,
  stored: Record<string, unknown>,
): PageContent<S> {
  const defaults = pageDefaults[slug] as Record<string, PageValue>
  const merged: Record<string, PageValue> = { ...defaults }
  for (const field of pageFields(slug)) {
    const value = sanitizeField(field, stored[field.key])
    if (value !== undefined) merged[field.key] = value
  }
  return merged as PageContent<S>
}

export function fillTokens(text: string, settings: SiteSettings): string {
  return text
    .replaceAll('{company}', settings.name)
    .replaceAll('{short_name}', settings.shortName)
    .replaceAll('{tagline}', settings.tagline)
    .replaceAll('{rc_number}', settings.rcNumber)
    .replaceAll('{email}', settings.email)
    .replaceAll('{phone}', settings.phone)
}

function fillValue(value: PageValue, settings: SiteSettings): PageValue {
  if (typeof value === 'string') return fillTokens(value, settings)
  if (typeof value === 'boolean') return value
  return (value as Array<string | Record<string, string>>).map((item) =>
    typeof item === 'string'
      ? fillTokens(item, settings)
      : Object.fromEntries(
          Object.entries(item).map(([key, text]) => [key, fillTokens(text, settings)]),
        ),
  ) as PageValue
}

/**
 * Page copy for the public site: saved content over the defaults, with
 * {company}, {rc_number} and the other placeholders filled in.
 */
export const getPage = cache(async <S extends PageSlug>(slug: S): Promise<PageContent<S>> => {
  const [stored, settings] = await Promise.all([loadStoredPage(slug), getSettings()])
  const merged = mergeWithDefaults(slug, stored) as Record<string, PageValue>
  return Object.fromEntries(
    Object.entries(merged).map(([key, value]) => [key, fillValue(value, settings)]),
  ) as PageContent<S>
})
