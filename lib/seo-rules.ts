/** SEO rules shared by the site and the admin (safe to use in the browser). */
import type { Service } from '@/lib/content-types'

/** Words a service page needs (beyond the short description) before it is indexed. */
export const SERVICE_MIN_WORDS = 250

const countWords = (text: string) => text.split(/\s+/).filter(Boolean).length

export function serviceWordCount(service: Pick<Service, 'body' | 'audience' | 'faqs'>): number {
  return (
    countWords(service.body) +
    countWords(service.audience) +
    service.faqs.reduce((sum, faq) => sum + countWords(faq.question) + countWords(faq.answer), 0)
  )
}

/** Service pages stay out of Google until they have real content, or if hidden. */
export function serviceIsIndexable(service: Service): boolean {
  return !service.noindex && serviceWordCount(service) >= SERVICE_MIN_WORDS
}

