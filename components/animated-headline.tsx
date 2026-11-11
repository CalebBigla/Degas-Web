import { cn } from '@/lib/utils'

export const WORD_START_MS = 150
export const WORD_STEP_MS = 70

/** Split "Simplify the **tech space**" into words, flagging the highlighted ones. */
export function parseHeadline(title: string) {
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

/** When the rest of a header should start animating in (after the last word lands). */
export function headlineDoneMs(title: string, startMs = WORD_START_MS) {
  return startMs + parseHeadline(title).length * WORD_STEP_MS + 150
}

// Brand gradient for **highlighted** words: navy → logo blue on light
// backgrounds, logo blue → pale blue on dark ones.
const HIGHLIGHT = {
  light:
    'bg-[linear-gradient(90deg,var(--brand-navy),var(--brand-blue),var(--brand-navy))]',
  dark: 'bg-[linear-gradient(90deg,var(--brand-blue),oklch(0.88_0.06_264),var(--brand-blue))]',
}

/**
 * Headline whose words rise into place one by one. Wrap words in
 * **double asterisks** to give them the animated brand gradient.
 */
export function AnimatedHeadline({
  title,
  as: Tag = 'h1',
  tone = 'light',
  startMs = WORD_START_MS,
  className,
}: {
  title: string
  as?: 'h1' | 'h2'
  tone?: 'light' | 'dark'
  startMs?: number
  className?: string
}) {
  const words = parseHeadline(title)
  const plain = words.map((w) => w.text).join(' ')

  return (
    <Tag aria-label={plain} className={cn('[perspective:800px]', className)}>
      {words.map((word, i) => (
        <span key={i} aria-hidden="true">
          <span
            className="inline-block origin-bottom animate-word-in motion-reduce:animate-none"
            style={{ animationDelay: `${startMs + i * WORD_STEP_MS}ms` }}
          >
            {word.highlight ? (
              <span
                className={cn(
                  'animate-gradient-pan bg-[length:200%_auto] bg-clip-text pb-1 text-transparent motion-reduce:animate-none',
                  HIGHLIGHT[tone],
                )}
              >
                {word.text}
              </span>
            ) : (
              word.text
            )}
          </span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  )
}
