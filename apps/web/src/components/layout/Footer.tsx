import Link from 'next/link';
import SocialRow from './SocialRow';
import MotionPreferenceToggle from '@/components/ui/MotionPreferenceToggle';
import { CANONICAL_NAME, parseSocialLinks } from '@/lib/site';
import type { Profile } from '@/lib/types';

const COLUMNS = [
  {
    heading: 'Work',
    links: [
      { href: '/projects', label: 'Projects' },
      { href: '/services', label: 'Services' },
      { href: '/experience', label: 'Experience' },
      { href: '/open-source', label: 'Open source' },
    ],
  },
  {
    heading: 'More',
    links: [
      { href: '/about', label: 'About' },
      { href: '/achievements', label: 'Achievements' },
      { href: '/certifications', label: 'Certifications' },
      { href: '/blog', label: 'Writing' },
    ],
  },
];

/**
 * A server component. The previous footer was 197 lines marked `'use client'`
 * purely to attach analytics onClick handlers — those are delegated now, so
 * none of this ships JavaScript.
 */
export default function Footer({ profile }: { profile: Profile | null }) {
  const socials = parseSocialLinks(profile?.socialLinks, profile);
  const name = profile?.name?.trim() || CANONICAL_NAME;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-rule">
      <div className="shell py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="font-mono text-sm text-ink">{name}</p>
            {profile?.title && <p className="mt-1 text-sm text-ink-dim">{profile.title}</p>}
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                data-analytics="email_click"
                data-analytics-location="footer"
                className="mt-3 inline-flex min-h-11 items-center text-sm text-ink-dim transition-colors hover:text-verdigris"
              >
                {profile.email}
              </a>
            )}
            <div className="mt-2">
              <SocialRow socials={socials} location="footer" />
            </div>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="meta uppercase tracking-[0.14em]">{column.heading}</h2>
              <ul className="mt-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-11 items-center text-sm text-ink-dim transition-colors hover:text-verdigris"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-6">
          <p className="meta">
            © {year} {name}
          </p>
          <MotionPreferenceToggle />
        </div>
      </div>
    </footer>
  );
}
