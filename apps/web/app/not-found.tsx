import type { Metadata } from 'next';
import Link from 'next/link';
import { CANONICAL_NAME } from '@/lib/site';

// Next.js serves this with a real 404 status code, so crawlers drop the URL
// instead of indexing a soft-404. `noindex` keeps the error page itself out of
// the index while still letting crawlers follow the recovery links below.
export const metadata: Metadata = {
  title: { absolute: `Page not found | ${CANONICAL_NAME}` },
  description: 'The page you were looking for does not exist or has been moved.',
  robots: { index: false, follow: true },
};

const SUGGESTIONS = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'The record' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Writing' },
  { href: '/contact', label: 'Contact' },
];

export default function NotFound() {
  return (
    <main id="main" className="shell flex min-h-svh items-center py-24">
      <div className="rail-grid w-full">
        <p className="meta uppercase tracking-[0.14em] text-copper">Error 404</p>

        <div className="min-w-0">
          <h1 className="measure text-4xl text-ink md:text-5xl">This page doesn&apos;t exist</h1>
          <p className="measure mt-4 text-ink-dim">
            The link may be out of date, or the page may have moved. These are the main
            sections of the site.
          </p>

          <nav aria-label="Site sections" className="mt-8">
            <ul className="divide-y divide-rule border-y border-rule">
              {SUGGESTIONS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex min-h-12 items-center text-sm text-ink-dim transition-colors hover:text-verdigris"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </main>
  );
}
