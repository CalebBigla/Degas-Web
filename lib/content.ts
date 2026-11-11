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
  mapProject,
  mapService,
  mapSettings,
  mapTeamMember,
  type Client,
  type CoreValue,
  type Project,
  type Service,
  type SiteSettings,
  type TeamMember,
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
  (): Promise<Service[]> => loadList('services', mapService, defaultServices),
)

export const getCoreValues = cache(
  (): Promise<CoreValue[]> => loadList('core_values', mapCoreValue, defaultCoreValues),
)

export const getProjects = cache(
  (): Promise<Project[]> => loadList('projects', mapProject, defaultProjects),
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
