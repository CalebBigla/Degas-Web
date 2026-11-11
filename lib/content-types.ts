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
  address: string
  instagram: string
  xUrl: string
  facebook: string
  googleVerification: string
  bingVerification: string
}

/** Search and sharing overrides on services, projects and articles. */
export type Seo = {
  seoTitle: string | null
  seoDescription: string | null
  shareImage: string | null
  /** Hide from search engines (and the sitemap). */
  noindex: boolean
}

export type Faq = { question: string; answer: string }

export type Service = {
  id: string
  slug: string
  title: string
  /** Name of an icon in lib/icons.ts */
  icon: string
  summary: string
  description: string
  included: string[]
  /** Long-form landing page content (rich text). */
  body: string
  /** Who the service is for and the problems it solves (rich text). */
  audience: string
  faqs: Faq[]
  published: boolean
} & Seo

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
  coverAlt: string | null
  /** Measurable outcomes, only where the client allows sharing them. */
  results: string | null
  serviceIds: string[]
  featured: boolean
  published: boolean
} & Seo

export type Post = {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  coverImage: string | null
  coverAlt: string | null
  author: string | null
  publishedAt: string | null
  published: boolean
} & Seo

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
  address: row.address ?? '',
  instagram: row.instagram ?? '',
  xUrl: row.x_url ?? '',
  facebook: row.facebook ?? '',
  googleVerification: row.google_verification ?? '',
  bingVerification: row.bing_verification ?? '',
})

const seo = (row: Row): Seo => ({
  seoTitle: row.seo_title || null,
  seoDescription: row.seo_description || null,
  shareImage: row.share_image || null,
  noindex: Boolean(row.noindex),
})

function mapFaqs(value: unknown): Faq[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
    .map((item) => ({ question: String(item.question ?? ''), answer: String(item.answer ?? '') }))
    .filter((item) => item.question && item.answer)
}

export const mapService = (row: Row): WithMeta<Service> => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  icon: row.icon,
  summary: row.summary,
  description: row.description,
  included: row.included ?? [],
  body: row.body ?? '',
  audience: row.audience ?? '',
  faqs: mapFaqs(row.faqs),
  published: row.published,
  ...seo(row),
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
  coverAlt: row.cover_alt ?? null,
  results: row.results ?? null,
  serviceIds: row.service_ids ?? [],
  featured: row.featured,
  published: row.published,
  ...seo(row),
  ...meta(row),
})

export const mapPost = (row: Row): WithMeta<Post> => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt ?? '',
  body: row.body ?? '',
  coverImage: row.cover_image ?? null,
  coverAlt: row.cover_alt ?? null,
  author: row.author ?? null,
  publishedAt: row.published_at ?? null,
  published: row.published,
  ...seo(row),
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
