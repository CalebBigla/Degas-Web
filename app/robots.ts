import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The admin is private (and also marked noindex). /og only renders share images.
      disallow: ['/admin', '/og'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
