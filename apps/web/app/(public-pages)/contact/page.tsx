import type { Metadata } from 'next';
import { fetchProfile } from '@/lib/api';
import ContactSection from '@/components/sections/ContactSection';
import { JsonLd, buildContactPageSchema } from '@/lib/entity-jsonld';

export const metadata: Metadata = {
  title: { absolute: 'Contact Amal Anilkumar — Hire a Full-Stack Engineer' },
  description:
    'Get in touch with Amal Anilkumar to scope a web app, AI integration, or backend build. Based in Kerala, India and available for remote freelance and contract work.',
  alternates: { canonical: '/contact' },
  openGraph: {
    type: 'website',
    url: '/contact',
    title: 'Contact Amal Anilkumar — Hire a Full-Stack Engineer',
    description:
      'Scope a web app, AI integration, or backend build. Based in Kerala, India and available for remote freelance and contract work.',
  },
};

export default async function ContactPage() {
  const profile = await fetchProfile();

  return (
    <div className="min-h-screen pt-16">
      <JsonLd data={buildContactPageSchema(profile)} />
      <ContactSection profile={profile} />
    </div>
  );
}
