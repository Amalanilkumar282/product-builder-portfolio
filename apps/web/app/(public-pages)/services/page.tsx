import type { Metadata } from 'next';
import { fetchServices } from '@/lib/api';
import ServicesSection from '@/components/sections/ServicesSection';
import Section from '@/components/ui/Section';
import { JsonLd, buildCollectionPageSchema } from '@/lib/entity-jsonld';

export const metadata: Metadata = {
  title: { absolute: 'Full-Stack & AI Development Services | Amal Anilkumar' },
  description:
    'Hire Amal Anilkumar for full-stack web development, backend and API architecture, AI/ML integration, and mobile app builds — from scoping through deployment and handover.',
  alternates: { canonical: '/services' },
  openGraph: {
    type: 'website',
    url: '/services',
    title: 'Full-Stack & AI Development Services | Amal Anilkumar',
    description:
      'Full-stack web development, backend and API architecture, AI/ML integration, and mobile app builds — from scoping through deployment.',
  },
};

export default async function ServicesPage() {
  const services = await fetchServices();

  return (
    <>
      <JsonLd
        data={buildCollectionPageSchema({
          path: '/services',
          title: 'Services',
          description:
            'Client services offered by Amal Anilkumar across full-stack product development, backend systems, and AI integrations.',
        })}
      />
      <Section
        id="services"
        label="Services"
        meta={`${services.length} offerings`}
        title="Services"
        as="h1"
        intro="How I work with clients, from scoping through deployment and handover."
        className="pt-[calc(var(--header-h)+3rem)]"
        wide
      >
        <ServicesSection services={services} />
      </Section>
    </>
  );
}
