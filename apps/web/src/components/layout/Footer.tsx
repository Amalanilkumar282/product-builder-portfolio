import Link from 'next/link';
import { GitFork, Globe, X, Mail, Code2 } from 'lucide-react';
import type { SocialLinks } from '@/lib/types';

const quickLinks = [
  { href: '/#services', label: 'Services' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#skills', label: 'Skills' },
  { href: '/blog', label: 'Blog' },
  { href: '/#contact', label: 'Contact' },
];

interface FooterProps {
  profile?: {
    name: string;
    bio?: string;
    email: string;
    socialLinks?: string;
  } | null;
}

export default function Footer({ profile }: FooterProps) {
  const year = new Date().getFullYear();
  const name = profile?.name ?? 'Amal Anilkumar';
  const bio = profile?.bio ?? 'Passionate about a world where tech and nature thrive together.';
  const email = profile?.email ?? '';
  const socials: SocialLinks = (() => {
    try {
      return profile?.socialLinks ? JSON.parse(profile.socialLinks) : {};
    } catch {
      return {};
    }
  })();

  return (
    <footer className="relative border-t border-white/[0.07] mt-24">
      {/* Gradient top line */}
      <div className="absolute top-0 left-0 right-0 h-px gradient-bg opacity-50" />

      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <Code2 size={16} className="text-white" />
            </div>
            <span className="font-bold gradient-text">{name}</span>
          </Link>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xs">{bio}</p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-widest">
            Navigation
          </h3>
          <ul className="space-y-2">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social + contact */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-widest">
            Connect
          </h3>
          <div className="flex flex-wrap gap-3 mb-4">
            {email && (
              <a
                href={`mailto:${email}`}
                className="p-2.5 glass rounded-xl text-slate-400 hover:text-white hover:border-purple-500/30 transition-all"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            )}
            {socials.GitFork && (
              <a
                href={socials.GitFork}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 glass rounded-xl text-slate-400 hover:text-white hover:border-purple-500/30 transition-all"
                aria-label="GitFork"
              >
                <GitFork size={18} />
              </a>
            )}
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 glass rounded-xl text-slate-400 hover:text-white hover:border-blue-500/30 transition-all"
                aria-label="LinkedIn"
              >
                <Globe size={18} />
              </a>
            )}
            {socials.twitter && (
              <a
                href={socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 glass rounded-xl text-slate-400 hover:text-white hover:border-sky-500/30 transition-all"
                aria-label="Twitter"
              >
                <X size={18} />
              </a>
            )}
          </div>
          {email && (
            <p className="text-sm text-slate-500">
              <a href={`mailto:${email}`} className="hover:text-purple-400 transition-colors">
                {email}
              </a>
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-white/[0.05] py-6 text-center text-xs text-slate-600">
        © {year} {name}. Built with Next.js &amp; NestJS.
      </div>
    </footer>
  );
}
