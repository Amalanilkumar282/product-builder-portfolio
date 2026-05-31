import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') ?? 'Amal Anilkumar — Software Engineer';
  const subtitle = searchParams.get('subtitle') ?? 'Full-stack engineer building scalable web products';
  const type = searchParams.get('type') ?? 'page'; // 'blog' | 'project' | 'service' | 'page'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(168,85,247,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.07) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Gradient orb top-right */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-120px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)',
          }}
        />

        {/* Gradient orb bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '64px 80px',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          {/* Type badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                background: 'rgba(168,85,247,0.2)',
                border: '1px solid rgba(168,85,247,0.4)',
                borderRadius: '999px',
                padding: '6px 16px',
                color: '#d8b4fe',
                fontSize: '14px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {type}
            </div>
          </div>

          {/* Title + subtitle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                fontSize: title.length > 50 ? '44px' : '56px',
                fontWeight: 800,
                color: '#f1f5f9',
                lineHeight: 1.15,
                maxWidth: '900px',
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: '22px',
                color: '#94a3b8',
                lineHeight: 1.5,
                maxWidth: '750px',
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Footer: author + site */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '18px',
                }}
              >
                AA
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: 600 }}>
                  Amal Anilkumar
                </span>
                <span style={{ color: '#64748b', fontSize: '14px' }}>Software Engineer</span>
              </div>
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              {SITE_URL.replace('https://', '').replace('http://', '')}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
