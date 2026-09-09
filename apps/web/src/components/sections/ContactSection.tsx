import { Mail, MessageCircle, Phone } from 'lucide-react';
import ContactForm from './ContactForm';
import SocialRow from '@/components/layout/SocialRow';
import { parseSocialLinks } from '@/lib/site';
import type { Profile } from '@/lib/types';

/**
 * Direct channels are derived entirely from the Profile record. The previous
 * version carried a personal phone number as a module constant in the
 * presentation layer, which meant changing it required a deploy.
 */
export default function ContactSection({ profile }: { profile: Profile | null }) {
  const socials = parseSocialLinks(profile?.socialLinks, profile);

  const channels = [
    profile?.email && {
      key: 'email',
      Icon: Mail,
      label: 'Email',
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    profile?.phone && {
      key: 'call',
      Icon: Phone,
      label: 'Phone',
      value: profile.phone,
      href: `tel:${profile.phone.replace(/[^\d+]/g, '')}`,
    },
    socials.whatsapp && {
      key: 'whatsapp',
      Icon: MessageCircle,
      label: 'WhatsApp',
      value: 'Message directly',
      href: socials.whatsapp,
    },
  ].filter(Boolean) as {
    key: string;
    Icon: typeof Mail;
    label: string;
    value: string;
    href: string;
  }[];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="min-w-0">
        <ContactForm />
      </div>

      <aside className="space-y-6">
        {channels.length > 0 && (
          <div>
            <h3 className="meta uppercase tracking-[0.14em]">Direct</h3>
            <ul className="mt-2 divide-y divide-rule border-t border-rule">
              {channels.map(({ key, Icon, label, value, href }) => (
                <li key={key}>
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    data-analytics={`${key}_click`}
                    data-analytics-location="contact"
                    className="flex min-h-11 items-center gap-3 py-3 text-sm text-ink-dim transition-colors hover:text-verdigris"
                  >
                    <Icon size={15} aria-hidden="true" className="shrink-0" />
                    <span className="min-w-0">
                      <span className="meta block">{label}</span>
                      <span className="block truncate text-ink">{value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="meta uppercase tracking-[0.14em]">Elsewhere</h3>
          <div className="mt-1">
            <SocialRow socials={socials} location="contact" />
          </div>
        </div>
      </aside>
    </div>
  );
}
