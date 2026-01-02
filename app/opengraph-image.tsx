import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(1200px 600px at 50% 20%, #0b1120 0%, #050a16 60%, #02060f 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 120,
              height: 120,
              borderRadius: 24,
              border: '3px solid #2DC9AC',
            }}
          >
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1.5" y="1.5" width="21" height="21" rx="5" stroke="#2DC9AC" strokeWidth="2"/>
              <path d="M6 16L10 8L14 16L18 8" stroke="#2DC9AC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div
            style={{
              color: '#fff',
              fontSize: 64,
              fontWeight: 900,
              letterSpacing: '-0.02em',
            }}
          >
            LingoGames
          </div>
          <div
            style={{
              color: '#9CA3AF',
              fontSize: 28,
              fontWeight: 600,
            }}
          >
            Daily language challenges
          </div>
        </div>
      </div>
    ),
    size
  )
}
