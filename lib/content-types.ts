/**
 * Shapes of CMS content as used by the site, plus mappers from database rows
 * (snake_case, see supabase/schema.sql) to these shapes.
 */

export type SiteSettings = {
  name: string
  shortName: string
  tagline: string
  vision: string
  mission: string
  phone: string
  whatsapp: string
  email: string
  linkedin: string
  rcNumber: string
  workingHours: string
  paymentOptions: string
}

export type Service = {
  id: string
  slug: string
  title: string
  /** Name of an icon in lib/icons.ts */
  icon: string
  summary: string
  description: string
  included: string[]
  published: boolean
}

export type CoreValue = {
  id: string
  title: string
  icon: string
  description: string
  published: boolean
}

export type Project = {
  id: string
  slug: string
  title: string
  category: string
  description: string
  overview: string | null
  approach: string | null
  highlights: string[]
  servicesLabel: string | null
  coverImage: string | null
  featured: boolean
  published: boolean
}

export type Client = {
  id: string
  name: string
  logo: string | null
  published: boolean
}

export type TeamMember = {
  id: string
  name: string
  role: string
  experience: string
  bio: string
  linkedin: string | null
  image: string | null
  published: boolean
}

/** Rows that carry admin bookkeeping fields. */
export type WithMeta<T> = T & { sortOrder: number; updatedAt: string | null }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>

const meta = (row: Row) => ({
  sortOrder: Number(row.sort_order ?? 0),
  updatedAt: (row.updated_at as string | undefined) ?? null,
})

export const mapSettings = (row: Row): SiteSettings => ({
  name: row.name,
  shortName: row.short_name,
  tagline: row.tagline,
  vision: row.vision,
  mission: row.mission,
  phone: row.phone,
  whatsapp: row.whatsapp,
  email: row.email,
  linkedin: row.linkedin,
  rcNumber: row.rc_number,
  workingHours: row.working_hours,
  paymentOptions: row.payment_options,
})

export const mapService = (row: Row): WithMeta<Service> => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  icon: row.icon,
  summary: row.summary,
  description: row.description,
  included: row.included ?? [],
  published: row.published,
  ...meta(row),
})

export const mapCoreValue = (row: Row): WithMeta<CoreValue> => ({
  id: row.id,
  title: row.title,
  icon: row.icon,
  description: row.description,
  published: row.published,
  ...meta(row),
})

export const mapProject = (row: Row): WithMeta<Project> => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  category: row.category,
  description: row.description,
  overview: row.overview ?? null,
  approach: row.approach ?? null,
  highlights: row.highlights ?? [],
  servicesLabel: row.services_label ?? null,
  coverImage: row.cover_image ?? null,
  featured: row.featured,
  published: row.published,
  ...meta(row),
})

export const mapClient = (row: Row): WithMeta<Client> => ({
  id: row.id,
  name: row.name,
  logo: row.logo_url ?? null,
  published: row.published,
  ...meta(row),
})

export const mapTeamMember = (row: Row): WithMeta<TeamMember> => ({
  id: row.id,
  name: row.name,
  role: row.role,
  experience: row.experience ?? '',
  bio: row.bio ?? '',
  linkedin: row.linkedin ?? null,
  image: row.image_url ?? null,
  published: row.published,
  ...meta(row),
})
