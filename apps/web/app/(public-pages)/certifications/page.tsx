import type { Metadata } from 'next';
import { fetchEducation } from '@/lib/api';
import { JsonLd, buildCollectionPageSchema } from '@/lib/entity-jsonld';

export const metadata: Metadata = {
  title: 'Certifications',
  description: 'Certifications, learning milestones, and formal credentials of Amal Anilkumar.',
  alternates: { canonical: '/certifications' },
};

export default async function CertificationsPage() {
  const education = await fetchEducation();
  const certifications = education.filter((item) => item.degree.toLowerCase().includes('certification'));

  return (
    <div className="min-h-screen pt-24 pb-20">
      <JsonLd
        data={buildCollectionPageSchema({
          path: '/certifications',
          title: 'Certifications',
          description: 'Certifications and structured learning milestones of Amal Anilkumar.',
        })}
      />
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-3">
            Credentials
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Certifications</h1>
          <p className="text-secondary text-lg">
            A focused list of formal certifications and structured learning milestones.
          </p>
        </div>
        <div className="grid gap-4">
          {certifications.map((item) => (
            <div key={item.id} className="glass rounded-2xl p-6 border border-default">
              <p className="text-sm font-semibold text-primary">{item.field}</p>
              <p className="text-sm text-accent mt-1">{item.institution}</p>
              <p className="text-sm text-secondary mt-2">{item.degree}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
