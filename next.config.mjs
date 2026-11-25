// The preferred address of the live site (see lib/site-data.ts).
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.degasconcepts.com').replace(/\/+$/, '')
const siteHost = new URL(SITE_URL).hostname

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    // Serve images as they are, without the host's resizing service: Vercel's
    // free plan has a monthly image-optimization quota, and once it runs out
    // every new image fails with "402 Payment Required". Uploads are resized
    // and compressed in the admin before upload instead (lib/admin/compress-image.ts).
    unoptimized: true,
    // Images uploaded through the admin live in Supabase Storage (public bucket).
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
