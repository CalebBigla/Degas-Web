// The preferred address of the live site (see lib/site-data.ts).
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://degasconcepts.com').replace(/\/+$/, '')
const siteHost = new URL(SITE_URL).hostname

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    // Images uploaded through the admin live in Supabase Storage (public bucket).
    // Matched by pattern, so it works regardless of when env vars are loaded.
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
  async redirects() {
    // One canonical address: send www. visitors (and their search rankings) to the main domain.
    if (siteHost.startsWith('www.')) return []
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: `www.${siteHost}` }],
        destination: `${SITE_URL}/:path*`,
        permanent: true,
      },
    ]
  },
}

export default nextConfig
