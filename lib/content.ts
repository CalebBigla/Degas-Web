/**
 * Public content getters. Read published content from Supabase, falling back
 * to the built-in defaults (lib/site-data.ts) if Supabase is not configured
 * or a query fails, so the public site always renders.
 */
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createSupabasePublicClient } from '@/lib/supabase/server'
import {
  mapClient,
  mapCoreValue,
  mapPost,
  mapProject,
  mapService,
  mapSettings,
  mapTeamMember,
  type Client,
  type CoreValue,
  type Post,
  type Project,
  type Service,
  type SiteSettings,
  type TeamMember,
  type WithMeta,
} from '@/lib/content-types'
import {
  defaultClients,
  defaultCoreValues,
  defaultProjects,
  defaultServices,
  defaultSettings,
  defaultTeam,
} from '@/lib/site-data'

type ListTable = 'services' | 'core_values' | 'projects' | 'clients' | 'team_members'

/**
 * Cache tag for everything the public site reads from Supabase. Saving in the
 * admin clears it (lib/admin/actions.ts), so changes show up immediately; the
 * hourly expiry is only a safety net.
 */
export const CONTENT_TAG = 'content'
const CONTENT_TTL = 3600

/**
 * Shares query results across requests and pages, so rendering the site does
 * not hit Supabase once per page and per component. Failed queries throw
 * inside the cache (so they are never stored) and fall back outside it.
 */
function cachedQuery<T>(key: string, query: () => Promise<T>) {
  return unstable_cache(query, ['content', key], { tags: [CONTENT_TAG], revalidate: CONTENT_TTL })
}

const listQueries = Object.fromEntries(
  (['services', 'core_values', 'projects', 'clients', 'team_members'] as const).map((table) => [
    table,
    cachedQuery(table, async () => {
      const { data, error } = await createSupabasePublicClient()
        .from(table)
        .select('*')
        .eq('published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })
      if (error) throw new Error(error.message)
      return (data ?? []) as Record<string, unknown>[]
    }),
  ]),
) as Record<ListTable, () => Promise<Record<string, unknown>[]>>

async function loadList<T>(
  table: ListTable,
  map: (row: Record<string, unknown>) => T,
  fallback: T[],
): Promise<T[]> {
  if (!isSupabaseConfigured) return fallback
  try {
    return (await listQueries[table]()).map(map)
  } catch (error) {
    console.error(`[content] Failed to load ${table}:`, (error as Error).message)
    return fallback
  }
}

const settingsQuery = cachedQuery('site_settings', async () => {
  const { data, error } = await createSupabasePublicClient()
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data as Record<string, unknown> | null
})

export const getSettings = cache(async (): Promise<SiteSettings> => {
  if (!isSupabaseConfigured) return defaultSettings
  try {
    const data = await settingsQuery()
    return data ? mapSettings(data) : defaultSettings
  } catch (error) {
    console.error('[content] Failed to load site_settings:', (error as Error).message)
    return defaultSettings
  }
})

export const getServices = cache(
  (): Promise<WithMeta<Service>[]> =>
    loadList('services', mapService, defaultServices.map((s) => ({ ...s, sortOrder: 0, updatedAt: null }))),
)

export const getServiceBySlug = cache(async (slug: string) => {
  const services = await getServices()
  return services.find((s) => s.slug === slug) ?? null
})

export const getCoreValues = cache(
  (): Promise<CoreValue[]> => loadList('core_values', mapCoreValue, defaultCoreValues),
)

export const getProjects = cache(
  (): Promise<WithMeta<Project>[]> =>
    loadList('projects', mapProject, defaultProjects.map((p) => ({ ...p, sortOrder: 0, updatedAt: null }))),
)

export const getFeaturedProjects = cache(async (limit = 4): Promise<Project[]> => {
  const projects = await getProjects()
  const featured = projects.filter((p) => p.featured)
  return (featured.length > 0 ? featured : projects).slice(0, limit)
})

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  const projects = await getProjects()
  return projects.find((p) => p.slug === slug) ?? null
})

export const getClients = cache(
  (): Promise<Client[]> => loadList('clients', mapClient, defaultClients),
)

export const getTeam = cache(
  (): Promise<TeamMember[]> => loadList('team_members', mapTeamMember, defaultTeam),
)

// -----------------------------------------------------------------------------
// Insights (blog)
// -----------------------------------------------------------------------------

const postsQuery = cachedQuery('posts', async () => {
  const { data, error } = await createSupabasePublicClient()
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as Record<string, unknown>[]
})

let warnedMissingPosts = false

/** Published articles, newest first. Empty until the posts table exists. */
export const getPosts = cache(async (): Promise<WithMeta<Post>[]> => {
  if (!isSupabaseConfigured) return []
  try {
    return (await postsQuery()).map(mapPost)
  } catch (error) {
    const message = (error as Error).message
    if (message.includes("'public.posts'")) {
      // The database update hasn't been run yet: say how to fix it, once.
      if (!warnedMissingPosts) {
        warnedMissingPosts = true
        console.warn(
          '[content] The Insights table does not exist yet. Run supabase/schema.sql in the Supabase SQL Editor to add it.',
        )
      }
    } else {
      console.error('[content] Failed to load posts:', message)
    }
    return []
  }
})

export const getPostBySlug = cache(async (slug: string) => {
  const posts = await getPosts()
  return posts.find((p) => p.slug === slug) ?? null
})

// -----------------------------------------------------------------------------
// Page copy timestamps (sitemap)
// -----------------------------------------------------------------------------

const pageTimestampsQuery = cachedQuery('page_timestamps', async () => {
  const { data, error } = await createSupabasePublicClient().from('pages').select('slug, updated_at')
  if (error) throw new Error(error.message)
  return Object.fromEntries((data ?? []).map((row) => [row.slug as string, row.updated_at as string]))
})

/** When each page's copy was last saved in the admin (missing = never edited). */
export async function getPageTimestamps(): Promise<Record<string, string>> {
  if (!isSupabaseConfigured) return {}
  try {
    return await pageTimestampsQuery()
  } catch {
    return {}
  }
}
