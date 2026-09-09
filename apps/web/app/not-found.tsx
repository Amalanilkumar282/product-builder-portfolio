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
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-xl w-full text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent mb-4">
          Error 404
        </p>

        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight">
          This page doesn&apos;t exist
        </h1>

        <p className="text-secondary text-base md:text-lg mb-10 leading-relaxed">
          The link may be out of date, or the page may have been moved. Here are the
          main sections of the site instead.
        </p>

        <nav aria-label="Site sections" className="flex flex-wrap justify-center gap-3">
          {SUGGESTIONS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="glass px-5 py-2.5 rounded-xl text-secondary font-semibold text-sm hover:border-accent hover:text-primary hover:-translate-y-0.5 transition-all"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
