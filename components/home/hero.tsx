import { ArrowRight, ShieldCheck, Award, FolderCheck } from 'lucide-react'
import { ButtonLink } from '@/components/button-link'
import { HeroBackground } from '@/components/home/hero-background'
import type { PageContent } from '@/lib/pages/definitions'

const BADGE_ICONS = [ShieldCheck, Award, FolderCheck]

const WORD_START_MS = 150
const WORD_STEP_MS = 70

/** Split "Simplify the **tech space**" into words, flagging the highlighted ones. */
function parseHeadline(title: string) {
  const words: { text: string; highlight: boolean }[] = []
  title.split(/(\*\*[^*]+\*\*)/g).forEach((part) => {
    const highlight = part.startsWith('**') && part.endsWith('**')
    const text = highlight ? part.slice(2, -2) : part
    text
      .split(/\s+/)
      .filter(Boolean)
      .forEach((word) => words.push({ text: word, highlight }))
  })
  return words
}

export function Hero({ copy }: { copy: PageContent<'home'> }) {
  const words = parseHeadline(copy['hero.title'])
  const plainTitle = words.map((w) => w.text).join(' ')
  // The rest of the hero follows once the headline has landed.
  const after = WORD_START_MS + words.length * WORD_STEP_MS + 150
  const badges = copy['hero.badges'].map((label, index) => ({
    icon: BADGE_ICONS[index % BADGE_ICONS.length]!,
    label,
  }))

  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-background">
      <HeroBackground />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 pb-16 pt-20 text-center sm:px-6 lg:pb-24 lg:pt-28">
        <span className="group inline-flex animate-pop-in items-center gap-2 rounded-full border border-border bg-background/90 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm motion-reduce:animate-none">
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          {copy['hero.eyebrow']}
        </span>

        <h1
          aria-label={plainTitle}
          className="mt-6 text-balance text-4xl font-bold leading-[1.08] text-foreground [perspective:800px] sm:text-5xl lg:text-6xl"
        >
          {words.map((word, i) => (
            <span key={i} aria-hidden="true">
              <span
                className="inline-block origin-bottom animate-word-in motion-reduce:animate-none"
                style={{ animationDelay: `${WORD_START_MS + i * WORD_STEP_MS}ms` }}
              >
                {word.highlight ? (
                  <span className="animate-gradient-pan bg-[linear-gradient(90deg,var(--accent),oklch(0.55_0.15_262),var(--accent))] bg-[length:200%_auto] bg-clip-text pb-1 text-transparent motion-reduce:animate-none">
                    {word.text}
                  </span>
                ) : (
                  word.text
                )}
              </span>
              {i < words.length - 1 && ' '}
            </span>
          ))}
        </h1>

        <p
          className="mt-6 max-w-2xl animate-fade-up text-pretty text-lg leading-relaxed text-muted-foreground motion-reduce:animate-none"
          style={{ animationDelay: `${after}ms` }}
        >
          {copy['hero.intro']}
        </p>

        <div
          className="mt-9 flex animate-fade-up flex-col gap-3 motion-reduce:animate-none sm:flex-row"
          style={{ animationDelay: `${after + 120}ms` }}
        >
          <ButtonLink href="/contact" variant="primary">
            {copy['hero.primaryCta']}
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/work" variant="outline">
            {copy['hero.secondaryCta']}
          </ButtonLink>
        </div>

        {badges.length > 0 && (
          <div className="mt-14 w-full border-t border-border/70 pt-8">
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {badges.map(({ icon: Icon, label }, i) => (
                <li
                  key={label}
                  className="inline-flex animate-fade-up items-center gap-2 text-sm font-medium text-foreground motion-reduce:animate-none"
                  style={{ animationDelay: `${after + 260 + i * 90}ms` }}
                >
                  <Icon className="h-4 w-4 text-accent" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
