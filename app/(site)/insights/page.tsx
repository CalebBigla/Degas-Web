import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { CtaBanner } from '@/components/cta-banner'
import { Reveal } from '@/components/reveal'
import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld'
import { getPosts } from '@/lib/content'
import { getPage } from '@/lib/pages/get'
import { buildMetadata } from '@/lib/seo'
import { formatDate } from '@/lib/format'

export async function generateMetadata(): Promise<Metadata> {
  const [copy, posts] = await Promise.all([getPage('insights'), getPosts()])
  return buildMetadata({
    title: copy['seo.title'],
    description: copy['seo.description'],
    path: '/insights',
    // An empty blog page has nothing worth indexing yet.
    noindex: copy['seo.noindex'] || posts.length === 0,
  })
}

export default async function InsightsPage() {
  const [copy, site, posts] = await Promise.all([getPage('insights'), getPage('site'), getPosts()])

  return (
    <>
      <BreadcrumbJsonLd trail={[{ name: site['nav.insights'], path: '/insights' }]} />
      <PageHero
        eyebrow={copy['hero.eyebrow']}
        title={copy['hero.title']}
        description={copy['hero.description']}
      />

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground">{copy['list.empty']}</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <Reveal key={post.id} as="article" delay={(index % 3) * 80}>
                  <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative aspect-[16/9] overflow-hidden bg-navy">
                      {post.coverImage && (
                        <Image
                          src={post.coverImage}
                          alt={post.coverAlt ?? ''}
                          fill
                          sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      {post.publishedAt && (
                        <time dateTime={post.publishedAt} className="text-xs font-medium text-muted-foreground">
                          {formatDate(post.publishedAt)}
                        </time>
                      )}
                      <h2 className="text-lg font-bold leading-snug text-foreground">{post.title}</h2>
                      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                      <Link
                        href={`/insights/${post.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent after:absolute after:inset-0 after:content-['']"
                      >
                        {copy['list.readMore']}
                        <span className="sr-only">: {post.title}</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBanner copy={copy} />
    </>
  )
}
