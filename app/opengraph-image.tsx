import { ImageResponse } from 'next/og'
import { defaultSettings as company } from '@/lib/site-data'

export const alt = `${company.name} — We simplify solutions across the tech space`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Colours mirror the design tokens in app/globals.css (navy, navy-muted, accent).
const navy = '#111b2b'
const navyMuted = '#9aa5b8'
const accent = '#1ba172'

export default function OpenGraphImage() {
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
            {company.tagline}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div style={{ fontSize: '84px', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
            We simplify solutions across the tech space
          </div>
          <div style={{ width: '120px', height: '6px', borderRadius: '9999px', background: accent }} />
        </div>

        <div style={{ display: 'flex', fontSize: '36px', fontWeight: 700 }}>{company.name}</div>
      </div>
    ),
    size,
  )
}
