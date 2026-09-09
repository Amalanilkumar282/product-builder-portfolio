import type { Metadata } from 'next';
import { fetchProfile } from '@/lib/api';
import ContactSection from '@/components/sections/ContactSection';
import Section from '@/components/ui/Section';
import { getProfileLocation } from '@/lib/site';
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
    <>
      <JsonLd data={buildContactPageSchema(profile)} />
      <Section
        id="contact"
        label="Contact"
        meta={getProfileLocation(profile)}
        title="Start a conversation"
        as="h1"
        intro="Tell me what you're building and where it's stuck. I read everything that comes in."
        className="pt-[calc(var(--header-h)+3rem)]"
        wide
      >
        <ContactSection profile={profile} />
      </Section>
    </>
  );
}
