'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react'

/**
 * Fades its content up once it scrolls into view (runs once).
 * The actual transition lives in globals.css under `[data-reveal]`, and is
 * skipped entirely for users who prefer reduced motion.
 */
export function Reveal({
  as,
  id,
  delay = 0,
  className,
  children,
}: {
  as?: 'div' | 'li' | 'article' | 'section'
  id?: string
  /** Extra delay in ms, used to stagger siblings. */
  delay?: number
  className?: string
  children: ReactNode
}) {
  const Tag: ElementType = as ?? 'div'
  const ref = useRef<HTMLElement | null>(null)
  const setRef = useCallback((node: HTMLElement | null) => {
    ref.current = node
  }, [])
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={setRef}
      id={id}
      data-reveal={shown ? 'shown' : 'hidden'}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
      className={className}
    >
      {children}
    </Tag>
  )
}
