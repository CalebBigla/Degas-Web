/**
 * Public content getters. Read published content from Supabase, falling back
 * to the built-in defaults (lib/site-data.ts) if Supabase is not configured
 * or a query fails, so the public site always renders.
 */
import { cache } from 'react'
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

async function loadList<T>(
  table: ListTable,
  map: (row: Record<string, unknown>) => T,
  fallback: T[],
): Promise<T[]> {
  if (!isSupabaseConfigured) return fallback
  const { data, error } = await createSupabasePublicClient()
    .from(table)
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) {
    console.error(`[content] Failed to load ${table}:`, error.message)
    return fallback
  }
  return (data ?? []).map(map)
}

export const getSettings = cache(async (): Promise<SiteSettings> => {
  if (!isSupabaseConfigured) return defaultSettings
  const { data, error } = await createSupabasePublicClient()
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle()
  if (error || !data) {
    if (error) console.error('[content] Failed to load site_settings:', error.message)
    return defaultSettings
  }
  return mapSettings(data)
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
