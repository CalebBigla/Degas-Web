import type { MetadataRoute } from 'next'
import { getPageTimestamps, getPosts, getProjects, getServices } from '@/lib/content'
import { getPage } from '@/lib/pages/get'
import type { PageSlug } from '@/lib/pages/definitions'
import { absoluteUrl, serviceIsIndexable } from '@/lib/seo'

/**
 * Only canonical, indexable URLs. `lastModified` is the last time the content
 * was actually saved in the admin; pages never edited have no date rather than
 * a made-up one. (Google ignores priority and change frequency, so they are
 * left out.)
 */

/** Latest of several ISO dates, or undefined. */
function latest(...dates: (string | null | undefined)[]): Date | undefined {
  const times = dates.filter(Boolean).map((d) => new Date(d!).getTime())
  return times.length > 0 ? new Date(Math.max(...times)) : undefined
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stamps, services, projects, posts] = await Promise.all([
    getPageTimestamps(),
    getServices(),
    getProjects(),
    getPosts(),
  ])

  const indexedServices = services.filter(serviceIsIndexable)
  const indexedProjects = projects.filter((p) => !p.noindex)
  const indexedPosts = posts.filter((p) => !p.noindex)

  const pages: { slug: PageSlug; path: string; extra?: (string | null)[] }[] = [
    { slug: 'home', path: '/' },
    { slug: 'about', path: '/about' },
    { slug: 'services', path: '/services', extra: services.map((s) => s.updatedAt) },
    { slug: 'work', path: '/work', extra: projects.map((p) => p.updatedAt) },
    { slug: 'contact', path: '/contact' },
    { slug: 'privacy', path: '/privacy' },
    { slug: 'terms', path: '/terms' },
  ]
  if (posts.length > 0) {
    pages.push({ slug: 'insights', path: '/insights', extra: posts.map((p) => p.updatedAt) })
  }

  const staticEntries = await Promise.all(
    pages.map(async ({ slug, path, extra = [] }) => {
      const copy = (await getPage(slug)) as Record<string, unknown>
      if (copy['seo.noindex'] === true) return null
      const home = slug === 'home' ? [stamps.site] : []
      return { url: absoluteUrl(path), lastModified: latest(stamps[slug], ...home, ...extra) }
    }),
  )

  return [
    ...staticEntries.filter((entry) => entry !== null),
    ...indexedServices.map((s) => ({
      url: absoluteUrl(`/services/${s.slug}`),
      lastModified: latest(s.updatedAt),
    })),
    ...indexedProjects.map((p) => ({
      url: absoluteUrl(`/work/${p.slug}`),
      lastModified: latest(p.updatedAt),
    })),
    ...indexedPosts.map((p) => ({
      url: absoluteUrl(`/insights/${p.slug}`),
      lastModified: latest(p.updatedAt, p.publishedAt),
    })),
  ]
}
