'use client'

import { useEffect, useRef } from 'react'

const CELL = 56

// Grid intersections (in cells from the top-left) that softly pulse, like network nodes.
const NODES = [
  { x: 4, y: 1, delay: 0 },
  { x: 9, y: 3, delay: 1.2 },
  { x: 13, y: 1, delay: 2.4 },
  { x: 17, y: 4, delay: 0.6 },
  { x: 21, y: 2, delay: 1.8 },
  { x: 26, y: 3, delay: 3 },
  { x: 11, y: 6, delay: 2 },
  { x: 23, y: 6, delay: 0.9 },
  { x: 31, y: 1, delay: 1.5 },
]

// Light streaks that travel along grid lines.
const BEAMS_X = [
  { row: 2, delay: 0, duration: 7 },
  { row: 5, delay: 3.5, duration: 9 },
]
const BEAMS_Y = [
  { col: 7, delay: 1.5, duration: 9 },
  { col: 19, delay: 5, duration: 10 },
  { col: 28, delay: 2.8, duration: 8 },
]

const GRID = {
  light:
    'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
  dark:
    'linear-gradient(to right, rgb(255 255 255 / 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.07) 1px, transparent 1px)',
}

// Drifting glows in the logo colours (stronger on dark backgrounds).
const GLOWS = {
  light: [
    'radial-gradient(closest-side, color-mix(in oklch, var(--brand-blue) 34%, transparent), color-mix(in oklch, var(--brand-blue) 10%, transparent) 55%, transparent)',
    'radial-gradient(closest-side, color-mix(in oklch, var(--brand-navy) 16%, transparent), color-mix(in oklch, var(--brand-navy) 5%, transparent) 55%, transparent)',
    'radial-gradient(closest-side, color-mix(in oklch, var(--brand-blue) 22%, transparent), color-mix(in oklch, var(--brand-blue) 6%, transparent) 55%, transparent)',
  ],
  dark: [
    'radial-gradient(closest-side, color-mix(in oklch, var(--brand-blue) 38%, transparent), color-mix(in oklch, var(--brand-blue) 10%, transparent) 55%, transparent)',
    'radial-gradient(closest-side, color-mix(in oklch, #2a2aff 45%, transparent), color-mix(in oklch, var(--brand-navy) 25%, transparent) 55%, transparent)',
    'radial-gradient(closest-side, color-mix(in oklch, var(--brand-blue) 22%, transparent), color-mix(in oklch, var(--brand-blue) 6%, transparent) 55%, transparent)',
  ],
}
const GRID_ACCENT =
  'linear-gradient(to right, color-mix(in oklch, var(--brand-blue) 55%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, var(--brand-blue) 55%, transparent) 1px, transparent 1px)'

const SPOT = 520 // spotlight grid size (px)
const GLOW = 840 // spotlight glow size (px)

/**
 * Decorative, animated hero background: drifting colour glows, a grid with
 * pulsing nodes and light streaks, and a spotlight that follows the pointer
 * (mouse only). All motion stops under prefers-reduced-motion.
 *
 * Performance: everything that moves is transformed or faded (GPU-only, no
 * repaints); the glows use soft gradients rather than a blur filter; and all
 * animations pause while the hero is off-screen or the tab is hidden.
 */
export function HeroBackground({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const ref = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  // Pause every animation inside the hero while it is not visible.
  useEffect(() => {
    const section = ref.current?.parentElement
    if (!section || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => {
      section.toggleAttribute('data-offscreen', !entry!.isIntersecting)
    })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const section = ref.current?.parentElement
    const spot = spotRef.current
    const glow = glowRef.current
    if (!section || !spot || !glow) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let rect = section.getBoundingClientRect()
    const onEnter = () => {
      rect = section.getBoundingClientRect()
    }
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        const sx = x - SPOT / 2
        const sy = y - SPOT / 2
        spot.style.transform = `translate3d(${sx}px, ${sy}px, 0)`
        // Keep the accent grid lined up with the page grid as the window moves.
        spot.style.backgroundPosition = `${-sx}px ${-sy}px`
        glow.style.transform = `translate3d(${x - GLOW / 2}px, ${y - GLOW / 2}px, 0)`
        spot.style.opacity = '1'
        glow.style.opacity = '1'
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(frame)
      spot.style.opacity = '0'
      glow.style.opacity = '0'
    }
    section.addEventListener('pointerenter', onEnter)
    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerleave', onLeave)
    window.addEventListener('scroll', onEnter, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      section.removeEventListener('pointerenter', onEnter)
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', onEnter)
    }
  }, [])

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Drifting colour glows (soft gradients: no blur filter, cheap to move) */}
      <div className="absolute -left-[10%] -top-[30%] h-[70%] w-[55%] animate-aurora-a will-change-transform" style={{ background: GLOWS[tone][0] }} />
      <div className="absolute -right-[12%] -top-[20%] h-[75%] w-[55%] animate-aurora-b will-change-transform" style={{ background: GLOWS[tone][1] }} />
      <div className="absolute bottom-[-35%] left-[25%] h-[60%] w-[50%] animate-aurora-c will-change-transform" style={{ background: GLOWS[tone][2] }} />

      {/* Grid, faded towards the edges */}
      <div
        className={tone === 'light' ? 'absolute inset-0 opacity-50' : 'absolute inset-0'}
        style={{
          backgroundImage: GRID[tone],
          backgroundSize: `${CELL}px ${CELL}px`,
          maskImage: 'radial-gradient(ellipse 75% 65% at 50% 0%, black 35%, transparent 100%)',
        }}
      />

      {/* Pointer spotlight: small windows moved with transforms (no full-size repaints) */}
      <div
        ref={glowRef}
        className="absolute left-0 top-0 opacity-0 transition-opacity duration-500 will-change-transform"
        style={{
          width: GLOW,
          height: GLOW,
          background:
            'radial-gradient(closest-side, color-mix(in oklch, var(--brand-blue) 12%, transparent), transparent)',
        }}
      />
      <div
        ref={spotRef}
        className="absolute left-0 top-0 opacity-0 transition-opacity duration-500 will-change-transform"
        style={{
          width: SPOT,
          height: SPOT,
          backgroundImage: GRID_ACCENT,
          backgroundSize: `${CELL}px ${CELL}px`,
          maskImage: 'radial-gradient(closest-side, black, transparent)',
        }}
      />

      {/* Nodes and light streaks, aligned to the grid lines */}
      <div
        className="absolute inset-x-0 top-0 h-[520px]"
        style={{ maskImage: 'radial-gradient(ellipse 75% 85% at 50% 0%, black 30%, transparent 100%)' }}
      >
        {BEAMS_X.map((beam, i) => (
          <span
            key={`x${i}`}
            className="absolute left-0 h-px w-40 animate-beam-x bg-gradient-to-r from-transparent via-[var(--brand-blue)] to-transparent"
            style={{ top: beam.row * CELL, animationDelay: `${beam.delay}s`, animationDuration: `${beam.duration}s` }}
          />
        ))}
        {BEAMS_Y.map((beam, i) => (
          <span
            key={`y${i}`}
            className="absolute top-0 h-32 w-px animate-beam-y bg-gradient-to-b from-transparent via-[var(--brand-blue)] to-transparent"
            style={{ left: beam.col * CELL, animationDelay: `${beam.delay}s`, animationDuration: `${beam.duration}s` }}
          />
        ))}
        {NODES.map((node, i) => (
          <span
            key={i}
            className="absolute h-1.5 w-1.5 animate-node-pulse rounded-full bg-[var(--brand-blue)] shadow-[0_0_12px_2px_color-mix(in_oklch,var(--brand-blue)_60%,transparent)]"
            style={{ left: node.x * CELL - 3, top: node.y * CELL - 3, animationDelay: `${node.delay}s` }}
          />
        ))}
      </div>

      {/* Soft fade into the content below */}
      {tone === 'light' && (
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      )}
    </div>
  )
}
