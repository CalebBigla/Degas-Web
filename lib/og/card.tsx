import { ImageResponse } from 'next/og'

// Colours mirror app/globals.css: ink background, grey text, logo blue accent.
const navy = '#0e0e0e'
const navyMuted = '#a3a3a3'
const accent = '#6699ff'

export const OG_SIZE = { width: 1200, height: 630 }

/** The 1200×630 share card used for link previews. */
export function renderShareCard({
  label,
  title,
  footer,
}: {
  label: string
  title: string
  footer: string
}) {
  const fontSize = title.length > 70 ? 60 : title.length > 45 ? 72 : 84
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background: navy,
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '9999px', background: accent }} />
          <div style={{ fontSize: '30px', fontWeight: 600, color: navyMuted, letterSpacing: '0.04em' }}>
            {label}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div style={{ fontSize: `${fontSize}px`, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
            {title}
          </div>
          <div style={{ width: '120px', height: '6px', borderRadius: '9999px', background: accent }} />
        </div>

        <div style={{ display: 'flex', fontSize: '36px', fontWeight: 700 }}>{footer}</div>
      </div>
    ),
    OG_SIZE,
  )
}
