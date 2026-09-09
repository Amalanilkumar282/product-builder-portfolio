import { Globe } from 'lucide-react';
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from '@/components/icons/SocialIcons';
import type { SocialLinks } from '@/lib/types';

interface SocialRowProps {
  socials: SocialLinks;
  /** Passed through to analytics so clicks can be attributed to a surface. */
  location: string;
  className?: string;
}

/**
 * Icon-only links, each with a real accessible name.
 *
 * lucide and the custom SVGs both mark themselves `aria-hidden`, so without an
 * explicit label these announce as empty links — which is exactly what the
 * previous project cards and admin header did.
 */
export default function SocialRow({ socials, location, className }: SocialRowProps) {
  const entries = [
    { key: 'github', href: socials.github, label: 'GitHub', Icon: GitHubIcon },
    { key: 'linkedin', href: socials.linkedin, label: 'LinkedIn', Icon: LinkedInIcon },
    { key: 'twitter', href: socials.twitter, label: 'X', Icon: XIcon },
    { key: 'instagram', href: socials.instagram, label: 'Instagram', Icon: InstagramIcon },
    { key: 'website', href: socials.website, label: 'Website', Icon: Globe },
  ].filter(
    (entry): entry is typeof entry & { href: string } =>
      typeof entry.href === 'string' && entry.href.length > 0,
  );

  if (entries.length === 0) return null;

  return (
    <ul className={className ? `flex items-center gap-1 ${className}` : 'flex items-center gap-1'}>
      {entries.map(({ key, href, label, Icon }) => (
        <li key={key}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer me"
            aria-label={label}
            title={label}
            data-analytics={`${key}_click`}
            data-analytics-location={location}
            className="inline-flex size-11 items-center justify-center rounded-md text-ink-faint transition-colors hover:bg-raised hover:text-ink"
          >
            <Icon width={17} height={17} aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
