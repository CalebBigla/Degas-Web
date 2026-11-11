/**
 * Search and sharing helpers: page metadata (title, description, canonical,
 * Open Graph / X cards, robots) and schema.org structured data (JSON-LD).
 */
import type { Metadata } from 'next'
import { getSettings } from '@/lib/content'
import type { Post, Project, Service, SiteSettings } from '@/lib/content-types'
import { siteUrl } from '@/lib/site-data'

export const SITE_URL = siteUrl

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path === '/' ? '' : path}`
}

/** True for a real value: not empty and not an unfilled "[PLACEHOLDER]". */
export function isFilled(value: string | null | undefined): value is string {
  return Boolean(value && value.trim() && !/^\[[A-Z_]+\]$/.test(value.trim()))
}

function isUrl(value: string | null | undefined): value is string {
  return isFilled(value) && /^https?:\/\//i.test(value)
}

/** Generated 1200×630 share card (see app/og/route.tsx). */
export function shareCardUrl(title: string, label?: string): string {
  const params = new URLSearchParams({ title })
  if (label) params.set('label', label)
  return `/og?${params.toString()}`
}

/** Trim text to a description-sized snippet at a word boundary. */
export function snippet(text: string, max = 160): string {
  const plain = text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{2,3}\s+/gm, '')
    .replace(/^[-*]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (plain.length <= max) return plain
  const cut = plain.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(' ') > 60 ? cut.lastIndexOf(' ') : cut.length).replace(/[\s,;:.–—-]+$/, '')}…`
}

type MetaInput = {
  /** Full title, shown exactly as given (include the brand). */
  title: string
  description: string
  /** Path of the page, e.g. "/services/web-development". */
  path: string
  /** Share image (absolute URL or site path). Defaults to the site card. */
  image?: string | null
  imageAlt?: string
  noindex?: boolean
  type?: 'website' | 'article'
  publishedTime?: string | null
  modifiedTime?: string | null
}

/** Complete metadata for one public page. */
export async function buildMetadata(input: MetaInput): Promise<Metadata> {
  const settings = await getSettings()
  const image = input.image || '/opengraph-image'
  const images = [{ url: image, width: 1200, height: 630, alt: input.imageAlt ?? input.title }]

  return {
    title: { absolute: input.title },
    description: input.description,
    alternates: { canonical: input.path },
    openGraph: {
      type: input.type ?? 'website',
      url: input.path,
      siteName: settings.shortName,
      title: input.title,
      description: input.description,
      images,
      ...(input.type === 'article'
        ? {
            publishedTime: input.publishedTime ?? undefined,
            modifiedTime: input.modifiedTime ?? undefined,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
      images: [image],
    },
    robots: input.noindex ? { index: false, follow: true } : undefined,
  }
}

export { SERVICE_MIN_WORDS, serviceIsIndexable, serviceWordCount } from '@/lib/seo-rules'

// -----------------------------------------------------------------------------
// Structured data (schema.org JSON-LD)
// -----------------------------------------------------------------------------

const ORG_ID = `${SITE_URL}/#organization`
const WEBSITE_ID = `${SITE_URL}/#website`

export function organizationSchema(settings: SiteSettings) {
  const sameAs = [settings.linkedin, settings.instagram, settings.xUrl, settings.facebook].filter(isUrl)
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: settings.shortName,
    legalName: settings.name,
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: absoluteUrl('/logo.png'), width: 816, height: 226 },
    description: settings.tagline,
    ...(isFilled(settings.email) ? { email: settings.email } : {}),
    ...(isFilled(settings.phone) ? { telephone: settings.phone } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(isFilled(settings.rcNumber)
      ? {
          identifier: {
            '@type': 'PropertyValue',
            propertyID: 'CAC RC Number',
            value: settings.rcNumber,
          },
        }
      : {}),
    ...(isFilled(settings.address)
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: settings.address,
            addressCountry: 'NG',
          },
        }
      : {}),
  }
}

export function websiteSchema(settings: SiteSettings) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: settings.shortName,
    alternateName: settings.name,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
  }
}

export type Crumb = { name: string; path: string }

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  }
}

export function serviceSchema(service: Service, description: string) {
  return {
    '@type': 'Service',
    '@id': `${absoluteUrl(`/services/${service.slug}`)}#service`,
    name: service.title,
    serviceType: service.title,
    description,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { '@id': ORG_ID },
  }
}

export function caseStudySchema(
  project: Project & { updatedAt?: string | null },
  description: string,
) {
  return {
    '@type': 'CreativeWork',
    '@id': `${absoluteUrl(`/work/${project.slug}`)}#case-study`,
    name: project.title,
    headline: `${project.title} case study`,
    description,
    url: absoluteUrl(`/work/${project.slug}`),
    genre: project.category,
    creator: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    ...(project.coverImage ? { image: absoluteUrl(project.coverImage) } : {}),
    ...(project.updatedAt ? { dateModified: project.updatedAt } : {}),
  }
}

export function articleSchema(
  post: Post & { updatedAt?: string | null },
  description: string,
  image: string,
) {
  return {
    '@type': 'BlogPosting',
    '@id': `${absoluteUrl(`/insights/${post.slug}`)}#article`,
    headline: post.title,
    description,
    url: absoluteUrl(`/insights/${post.slug}`),
    mainEntityOfPage: absoluteUrl(`/insights/${post.slug}`),
    image: absoluteUrl(image),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    author: post.author
      ? { '@type': 'Person', name: post.author }
      : { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
  }
}

/** Wrap one or more schema nodes in a single @graph document. */
export function jsonLd(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes }
}
