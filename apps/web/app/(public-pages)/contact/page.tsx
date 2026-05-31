import type { Metadata } from 'next';
import { fetchProfile } from '@/lib/api';
import ContactSection from '@/components/sections/ContactSection';
import { JsonLd, buildContactPageSchema } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch to discuss your project or collaboration opportunity.',
};

export default async function ContactPage() {
  const profile = await fetchProfile();

  return (
    <div className="min-h-screen pt-16">
      <JsonLd data={buildContactPageSchema()} />
      <ContactSection profile={profile} />
    </div>
  );
}
