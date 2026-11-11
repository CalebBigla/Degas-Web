import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/page-hero'
import { CtaBanner } from '@/components/cta-banner'
import { RichText } from '@/components/rich-text'
import { JsonLd } from '@/components/json-ld'
import { proseClass } from '@/components/prose'
import { getPostBySlug, getPosts, getSettings } from '@/lib/content'
import { getPage } from '@/lib/pages/get'
import {
  articleSchema,
  breadcrumbSchema,
  buildMetadata,
  jsonLd,
  shareCardUrl,
  snippet,
} from '@/lib/seo'
import { formatDate } from '@/lib/format'

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

function describe(post: { seoDescription: string | null; excerpt: string; body: string }) {
  return post.seoDescription || snippet(post.excerpt || post.body)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const [post, settings, site] = await Promise.all([getPostBySlug(slug), getSettings(), getPage('site')])
  if (!post) return {}
  return buildMetadata({
    title: post.seoTitle || `${post.title} | ${settings.shortName}`,
    description: describe(post),
    path: `/insights/${post.slug}`,
    image: post.shareImage || post.coverImage || shareCardUrl(post.title, site['nav.insights']),
    imageAlt: post.coverAlt ?? undefined,
    noindex: post.noindex,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  })
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [post, posts, copy, site, settings] = await Promise.all([
    getPostBySlug(slug),
    getPosts(),
    getPage('insights'),
    getPage('site'),
    getSettings(),
  ])
  if (!post) notFound()

  const more = posts.filter((p) => p.id !== post.id).slice(0, 3)
  const image = post.shareImage || post.coverImage || shareCardUrl(post.title, site['nav.insights'])

  return (
    <>
      <JsonLd
        data={jsonLd(
          breadcrumbSchema([
            { name: site['nav.home'], path: '/' },
            { name: site['nav.insights'], path: '/insights' },
            { name: post.title, path: `/insights/${post.slug}` },
          ]),
          articleSchema(post, describe(post), image),
        )}
      />

      <article>
        <PageHero
          back={{ href: '/insights', label: copy['post.backLabel'] }}
          eyebrow={site['nav.insights']}
          title={post.title}
          description={post.excerpt || undefined}
          width="max-w-3xl"
        >
          <p className="text-sm text-navy-muted">
            {post.author || settings.shortName}
            {post.publishedAt && (
              <>
                {' · '}
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              </>
            )}
          </p>
        </PageHero>

        {post.coverImage && (
          <div className="bg-background px-4 pt-12 sm:px-6 lg:px-8 lg:pt-16">
            <div className="relative mx-auto aspect-[16/9] max-w-3xl overflow-hidden rounded-2xl border border-border bg-secondary">
              <Image
                src={post.coverImage}
                alt={post.coverAlt ?? ''}
                fill
                priority
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        )}

        <div className="bg-background px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className={`mx-auto max-w-3xl ${proseClass} text-[17px]`}>
            <RichText text={post.body} headings />
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section className="border-t border-border bg-secondary/40 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground">{copy['post.relatedHeading']}</h2>
            <ul className="mt-6 divide-y divide-border">
              {more.map((p) => (
                <li key={p.id}>
                  <Link href={`/insights/${p.slug}`} className="group block py-4">
                    <span className="font-semibold text-foreground group-hover:text-accent">{p.title}</span>
                    {p.excerpt && <span className="mt-1 block text-sm text-muted-foreground">{p.excerpt}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBanner copy={copy} />
    </>
  )
}
