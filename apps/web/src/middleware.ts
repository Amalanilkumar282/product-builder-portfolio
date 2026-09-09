import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── IndexNow key verification ───────────────────────────────────────────
  // IndexNow (Bing, Copilot, Yandex) requires a plain-text file at
  // https://<domain>/<key>.txt containing exactly the key before it will
  // accept submissions signed with that key.
  //
  // This used to live in `app/[file]/route.ts`. That was a root-level dynamic
  // segment, so it matched *every* unmatched single-segment URL and answered
  // with a plain-text 404 — which meant app/not-found.tsx could never render
  // for those paths. Serving the key from middleware keeps IndexNow working
  // and lets everything else fall through to the real 404 page.
  if (pathname.endsWith('.txt')) {
    const key = process.env.INDEXNOW_KEY;

    if (key && pathname === `/${key}.txt`) {
      return new NextResponse(key, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }
  }

  // ── Keep the admin panel out of search indexes ──────────────────────────
  // robots.txt disallows /admin, but that only asks a crawler not to *fetch*
  // the page — a URL discovered elsewhere can still be indexed without being
  // crawled. Admin pages also inherit `index, follow` from the root layout's
  // metadata, and app/admin/layout.tsx is a client component so it cannot
  // export `metadata` to override it. An X-Robots-Tag header is the one
  // mechanism that works from here and is authoritative.
  if (pathname.startsWith('/admin')) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  // Admin routes authenticate client-side in app/admin/layout.tsx; this hook
  // is where an HTTP-only cookie check would go if that moves server-side.
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/((?!_next/).*\.txt)'],
};
