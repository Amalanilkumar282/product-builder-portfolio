'use client';

import Link from 'next/link';
import { Code2, Mail, MessageCircle, Phone } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { GitHubIcon, InstagramIcon, LinkedInIcon, XIcon } from '@/components/icons/SocialIcons';
import MotionPreferenceToggle from '@/components/ui/MotionPreferenceToggle';
import { CANONICAL_NAME, DEFAULT_BIO, parseSocialLinks } from '@/lib/site';
import type { Profile } from '@/lib/types';

const DEFAULT_CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '+917594919014';

function getContactPhone(phone?: string): { display: string; raw: string } {
  const source = phone ?? DEFAULT_CONTACT_PHONE;
  const digits = source.replace(/[^0-9]/g, '');

  if (digits.length === 10 && !source.startsWith('+91') && !digits.startsWith('91')) {
    return { display: `+91 ${digits}`, raw: `91${digits}` };
  }

  const raw = digits.startsWith('91') ? digits : `91${digits}`;
  return {
    display: source.startsWith('+') ? source : `+${raw}`,
    raw,
  };
}

const quickLinks = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/open-source', label: 'Open Source' },
  { href: '/contact', label: 'Contact' },
];

interface FooterProps {
  profile?: Pick<Profile, 'name' | 'bio' | 'email' | 'phone' | 'socialLinks'> | null;
}

export default function Footer({ profile }: FooterProps) {
  const year = new Date().getFullYear();
  const name = profile?.name ?? CANONICAL_NAME;
  const bio = profile?.bio ?? DEFAULT_BIO;
  const email = profile?.email ?? '';
  const socials = parseSocialLinks(profile?.socialLinks);
  const phone = getContactPhone(profile?.phone);
  const waUrl = socials.whatsapp ?? `https://wa.me/${phone.raw}`;
  const telUrl = `tel:+${phone.raw}`;

  return (
    <footer className="relative mt-24 border-t border-default">
      <div className="absolute left-0 right-0 top-0 h-px gradient-bg opacity-50" />

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-3">
        <div>
          <Link href="/" className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
              <Code2 size={16} className="text-white" />
            </div>
            <span className="font-bold gradient-text">{name}</span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-muted">{bio}</p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-secondary">
            Navigation
          </h3>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-secondary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-secondary">
            Connect
          </h3>
          <div className="mb-4 flex flex-wrap gap-3">
            {email && (
              <a
                href={`mailto:${email}`}
                onClick={() => trackEvent('email_click', { location: 'footer' })}
                className="glass rounded-xl p-2.5 text-secondary transition-all hover:border-accent hover:text-primary"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            )}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_click', { location: 'footer' })}
              className="glass rounded-xl p-2.5 text-secondary transition-all hover:border-green-400 hover:text-green-500"
              aria-label="WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
            <a
              href={telUrl}
              onClick={() => trackEvent('call_click', { location: 'footer' })}
              className="glass rounded-xl p-2.5 text-secondary transition-all hover:border-accent hover:text-accent"
              aria-label="Call"
            >
              <Phone size={18} />
            </a>
            {socials.github && (
              <a
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('github_click', { location: 'footer' })}
                className="glass rounded-xl p-2.5 text-secondary transition-all hover:border-accent hover:text-primary"
                aria-label="GitHub"
              >
                <GitHubIcon width={18} height={18} />
              </a>
            )}
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('linkedin_click', { location: 'footer' })}
                className="glass rounded-xl p-2.5 text-secondary transition-all hover:border-blue-400 hover:text-primary"
                aria-label="LinkedIn"
              >
                <LinkedInIcon width={18} height={18} />
              </a>
            )}
            {socials.twitter && (
              <a
                href={socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('x_click', { location: 'footer' })}
                className="glass rounded-xl p-2.5 text-secondary transition-all hover:border-sky-400 hover:text-primary"
                aria-label="X"
              >
                <XIcon width={18} height={18} />
              </a>
            )}
            {socials.instagram && (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('instagram_click', { location: 'footer' })}
                className="glass rounded-xl p-2.5 text-secondary transition-all hover:border-pink-400 hover:text-primary"
                aria-label="Instagram"
              >
                <InstagramIcon width={18} height={18} />
              </a>
            )}
          </div>
          {email && (
            <p className="text-sm text-muted">
              <a
                href={`mailto:${email}`}
                onClick={() => trackEvent('email_click', { location: 'footer_text' })}
                className="transition-colors hover:text-accent"
              >
                {email}
              </a>
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-default py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 text-center text-xs text-muted sm:flex-row sm:justify-between sm:text-left">
          <p>
            © {year} {name}. Built with Next.js and NestJS.
          </p>
          <MotionPreferenceToggle />
        </div>
      </div>
    </footer>
  );
}
