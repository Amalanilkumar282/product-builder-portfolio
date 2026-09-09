import Image from 'next/image';
import { Download, Mail } from 'lucide-react';
import { ButtonLink } from '@/components/ui/primitives';
import SocialRow from '@/components/layout/SocialRow';
import {
  CANONICAL_NAME,
  DEFAULT_TITLE,
  getProfileBio,
  parseSocialLinks,
} from '@/lib/site';
import type { Experience, Profile } from '@/lib/types';
import { formatMonthYear } from '@/lib/utils';

interface HeroSectionProps {
  profile: Profile | null;
  experience: Experience[];
}

/**
 * A server component.
 *
 * The previous hero was a 258-line client component that pulled framer-motion
 * and the whole three.js stack into the homepage's critical path for two
 * floating badges and a decorative lattice. Everything here renders on the
 * server; the only motion is a CSS entrance that starts on first paint rather
 * than waiting for hydration.
 */
export default function HeroSection({ profile, experience }: HeroSectionProps) {
  const socials = parseSocialLinks(profile?.socialLinks, profile);
  const name = profile?.name?.trim() || CANONICAL_NAME;
  const title = profile?.title?.trim() || DEFAULT_TITLE;
  const bio = getProfileBio(profile);

  const current = experience.find((role) => role.isPresent);

  return (
    <section
      id="hero"
      className="shell scroll-mt-[calc(var(--header-h)+2rem)] pb-12 pt-[calc(var(--header-h)+3rem)] md:pb-20 md:pt-[calc(var(--header-h)+5rem)]"
    >
      <div className="rail-grid">
        {/* Metadata rail: the "now" panel. Uses Profile and Experience columns
            that the previous design never rendered at all. */}
        <div className="rise" style={{ '--delay': '0.05s' } as React.CSSProperties}>
          <p className="meta uppercase tracking-[0.14em] text-verdigris">Now</p>
          <dl className="mt-2 space-y-2">
            {current && (
              <div>
                <dd className="text-sm text-ink">{current.role}</dd>
                <dd className="meta">
                  {current.company} · since {formatMonthYear(current.startDate)}
                </dd>
              </div>
            )}
            {profile?.location && <dd className="meta">{profile.location}</dd>}
          </dl>
        </div>

        <div className="min-w-0">
          <h1
            className="rise-lcp measure text-4xl text-ink md:text-5xl"
            style={{ '--delay': '0.1s' } as React.CSSProperties}
          >
            {name}
            <span className="mt-3 block text-xl font-normal text-ink-dim md:text-2xl">
              {title}
            </span>
          </h1>

          {profile?.headline && (
            <p
              className="rise measure mt-6 text-lg text-ink"
              style={{ '--delay': '0.18s' } as React.CSSProperties}
            >
              {profile.headline}
            </p>
          )}

          <p
            className="rise measure mt-4 text-ink-dim"
            style={{ '--delay': '0.24s' } as React.CSSProperties}
          >
            {bio}
          </p>

          <div
            className="rise mt-8 flex flex-wrap items-center gap-3"
            style={{ '--delay': '0.3s' } as React.CSSProperties}
          >
            <ButtonLink href="#record" tone="primary">
              Explore the record
            </ButtonLink>
            <ButtonLink href="#contact" tone="secondary">
              Get in touch
            </ButtonLink>
            {/* Rendered only when a resume has actually been uploaded through
                the admin panel — no dead button when the column is empty. */}
            {profile?.resumeUrl && (
              <ButtonLink
                href={profile.resumeUrl}
                tone="ghost"
                external
                download
                data-analytics="resume_click"
                data-analytics-location="hero"
              >
                <Download size={15} aria-hidden="true" /> Résumé
              </ButtonLink>
            )}
          </div>

          <div
            className="rise mt-6 flex flex-wrap items-center gap-x-5 gap-y-2"
            style={{ '--delay': '0.36s' } as React.CSSProperties}
          >
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                data-analytics="email_click"
                data-analytics-location="hero"
                className="inline-flex min-h-11 items-center gap-2 text-sm text-ink-dim transition-colors hover:text-ink"
              >
                <Mail size={15} aria-hidden="true" />
                {profile.email}
              </a>
            )}
            <SocialRow socials={socials} location="hero" />
          </div>
        </div>
      </div>

      {profile?.avatarUrl && (
        <div className="mt-12 border-t border-rule pt-6 lg:hidden">
          <Image
            src={profile.avatarUrl}
            alt={`Portrait of ${name}`}
            width={72}
            height={72}
            priority
            sizes="72px"
            className="rounded-full border border-rule object-cover"
          />
        </div>
      )}
    </section>
  );
}
