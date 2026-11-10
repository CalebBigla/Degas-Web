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

const GRID =
  'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)'
const GRID_ACCENT =
  'linear-gradient(to right, color-mix(in oklch, var(--accent) 45%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, var(--accent) 45%, transparent) 1px, transparent 1px)'

/**
 * Decorative, animated hero background: drifting colour glows, a slowly
 * moving grid with pulsing nodes, and a spotlight that follows the pointer
 * (mouse only). All motion stops under prefers-reduced-motion.
 */
export function HeroBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    const section = el?.parentElement
    if (!el || !section) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect()
        el.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
        el.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
        el.style.setProperty('--spot-o', '1')
      })
    }
    const onLeave = () => el.style.setProperty('--spot-o', '0')
    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ '--spot-x': '50%', '--spot-y': '30%', '--spot-o': '0' } as React.CSSProperties}
    >
      {/* Drifting colour glows */}
      <div className="absolute -left-[10%] -top-[30%] h-[70%] w-[55%] animate-aurora-a rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--accent)_32%,transparent),transparent)] blur-3xl will-change-transform" />
      <div className="absolute -right-[12%] -top-[20%] h-[75%] w-[55%] animate-aurora-b rounded-full bg-[radial-gradient(closest-side,oklch(0.62_0.14_262/0.26),transparent)] blur-3xl will-change-transform" />
      <div className="absolute bottom-[-35%] left-[25%] h-[60%] w-[50%] animate-aurora-c rounded-full bg-[radial-gradient(closest-side,oklch(0.75_0.1_200/0.2),transparent)] blur-3xl will-change-transform" />

      {/* Grid, faded towards the edges */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: GRID,
          backgroundSize: `${CELL}px ${CELL}px`,
          maskImage: 'radial-gradient(ellipse 75% 65% at 50% 0%, black 35%, transparent 100%)',
        }}
      />

      {/* Pointer spotlight: lights up the grid in the accent colour */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage: GRID_ACCENT,
          backgroundSize: `${CELL}px ${CELL}px`,
          opacity: 'var(--spot-o)',
          maskImage:
            'radial-gradient(260px circle at var(--spot-x) var(--spot-y), black, transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: 'var(--spot-o)',
          background:
            'radial-gradient(420px circle at var(--spot-x) var(--spot-y), color-mix(in oklch, var(--accent) 9%, transparent), transparent 70%)',
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
            className="absolute left-0 h-px w-40 animate-beam-x bg-gradient-to-r from-transparent via-accent to-transparent"
            style={{ top: beam.row * CELL, animationDelay: `${beam.delay}s`, animationDuration: `${beam.duration}s` }}
          />
        ))}
        {BEAMS_Y.map((beam, i) => (
          <span
            key={`y${i}`}
            className="absolute top-0 h-32 w-px animate-beam-y bg-gradient-to-b from-transparent via-accent to-transparent"
            style={{ left: beam.col * CELL, animationDelay: `${beam.delay}s`, animationDuration: `${beam.duration}s` }}
          />
        ))}
        {NODES.map((node, i) => (
          <span
            key={i}
            className="absolute h-1.5 w-1.5 animate-node-pulse rounded-full bg-accent shadow-[0_0_12px_2px_color-mix(in_oklch,var(--accent)_60%,transparent)]"
            style={{ left: node.x * CELL - 3, top: node.y * CELL - 3, animationDelay: `${node.delay}s` }}
          />
        ))}
      </div>

      {/* Soft fade into the content below */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  )
}
