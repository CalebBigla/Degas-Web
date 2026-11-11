'use client'

import { useEffect, useRef } from 'react'

/**
 * Pauses CSS animations inside the parent element while it is scrolled out of
 * view (sets `data-offscreen`, see globals.css). Renders nothing visible.
 */
export function PauseOffscreen() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const parent = ref.current?.parentElement
    if (!parent || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => {
      parent.toggleAttribute('data-offscreen', !entry!.isIntersecting)
    })
    observer.observe(parent)
    return () => observer.disconnect()
  }, [])
  return <span ref={ref} hidden />
}
