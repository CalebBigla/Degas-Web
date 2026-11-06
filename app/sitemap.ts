import type { MetadataRoute } from 'next'
import { projects, siteUrl } from '@/lib/site-data'

const staticRoutes = ['', '/about', '/services', '/work', '/contact', '/privacy', '/terms']

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.8,
    })),
    ...projects.map((project) => ({
      url: `${siteUrl}/work/${project.slug}`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ]
}
