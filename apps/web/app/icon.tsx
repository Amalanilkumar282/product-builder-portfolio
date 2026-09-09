import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

/**
 * The site had no favicon of any kind — no `icon.*`, no `favicon.ico`, and a
 * manifest with an empty icon set, so a visual revamp would have shipped with
 * no browser-tab identity at all.
 *
 * Generating it here rather than committing a binary means the mark always
 * matches the palette in globals.css.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#101418',
          color: '#4fb39a',
          fontSize: 320,
          fontWeight: 700,
        }}
      >
        A
      </div>
    ),
    size,
  );
}
