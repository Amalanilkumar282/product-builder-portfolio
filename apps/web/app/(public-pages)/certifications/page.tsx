import type { Metadata } from 'next';
import { fetchCertifications, fetchEducation } from '@/lib/api';
import Section from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/primitives';
import { formatMonthYear } from '@/lib/utils';
import { JsonLd, buildCollectionPageSchema } from '@/lib/entity-jsonld';

export const metadata: Metadata = {
  title: { absolute: 'Certifications & Credentials | Amal Anilkumar' },
  description:
    'Professional certifications, formal credentials, and learning milestones completed by Amal Anilkumar in software engineering, cloud, and AI/ML.',
  alternates: { canonical: '/certifications' },
  openGraph: {
    type: 'profile',
    url: '/certifications',
    title: 'Certifications & Credentials | Amal Anilkumar',
    description:
      'Professional certifications, formal credentials, and learning milestones in software engineering, cloud, and AI/ML.',
  },
};

interface CertRow {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  url?: string;
  description?: string;
}

export default async function CertificationsPage() {
  /*
   * Two sources, because the concept is duplicated in the data.
   *
   * There is a real Certification table with a working endpoint that nothing
   * read, and there are also Education rows whose `degree` is literally
   * "Certification". Reading both means the page is correct today and stays
   * correct as records migrate to the proper table — the previous version
   * string-matched Education only, so the real table stayed invisible.
   */
  const [certifications, education] = await Promise.all([
    fetchCertifications(),
    fetchEducation(),
  ]);

  const fromTable: CertRow[] = certifications.map((item) => ({
    id: item.id,
    name: item.name,
    issuer: item.issuer,
    date: item.issueDate,
    url: item.url,
    description: item.description,
  }));

  const fromEducation: CertRow[] = education
    .filter((item) => /certification/i.test(item.degree))
    .map((item) => ({
      id: item.id,
      name: item.field,
      issuer: item.institution,
      date: item.endDate ?? item.startDate,
    }));

  const all = [...fromTable, ...fromEducation].sort((a, b) =>
    (b.date ?? '').localeCompare(a.date ?? ''),
  );

  return (
    <>
      <JsonLd
        data={buildCollectionPageSchema({
          path: '/certifications',
          title: 'Certifications',
          description: 'Certifications and structured learning milestones of Amal Anilkumar.',
        })}
      />
      <Section
        id="certifications"
        label="Credentials"
        meta={`${all.length} certifications`}
        title="Certifications"
        as="h1"
        intro="Formal certifications and structured learning milestones."
        className="pt-[calc(var(--header-h)+3rem)]"
        wide
      >
        {all.length === 0 ? (
          <EmptyState title="No certifications recorded yet" />
        ) : (
          <ul className="divide-y divide-rule border-y border-rule">
            {all.map((item) => (
              <li key={item.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-6">
                <span className="meta w-24 shrink-0 tabular">
                  {item.date ? formatMonthYear(item.date) : ''}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm text-ink">{item.name}</h2>
                  <p className="meta mt-0.5">{item.issuer}</p>
                  {item.description && (
                    <p className="measure mt-1.5 text-sm text-ink-dim">{item.description}</p>
                  )}
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex min-h-11 items-center text-sm text-verdigris underline underline-offset-4"
                    >
                      Verify
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
