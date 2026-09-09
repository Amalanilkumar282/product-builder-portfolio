import type { Metadata } from 'next';
import { fetchAwards } from '@/lib/api';
import Section from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/primitives';
import { JsonLd, buildCollectionPageSchema } from '@/lib/entity-jsonld';

export const metadata: Metadata = {
  title: { absolute: 'Awards & Achievements | Amal Anilkumar' },
  description:
    'Hackathon wins, awards, recognitions, and milestone achievements earned by Amal Anilkumar across software engineering, AI, and product work.',
  alternates: { canonical: '/achievements' },
  openGraph: {
    type: 'profile',
    url: '/achievements',
    title: 'Awards & Achievements | Amal Anilkumar',
    description:
      'Hackathon wins, awards, recognitions, and milestone achievements across software engineering, AI, and product work.',
  },
};

export default async function AchievementsPage() {
  const awards = await fetchAwards();

  return (
    <>
      <JsonLd
        data={buildCollectionPageSchema({
          path: '/achievements',
          title: 'Achievements',
          description: 'Awards, recognitions, and milestone achievements earned by Amal Anilkumar.',
        })}
      />
      <Section
        id="achievements"
        label="Recognition"
        meta={`${awards.length} awards`}
        title="Achievements"
        as="h1"
        className="pt-[calc(var(--header-h)+3rem)]"
        wide
      >
        {awards.length === 0 ? (
          <EmptyState title="No awards recorded yet" />
        ) : (
          <ul className="divide-y divide-rule border-y border-rule">
            {awards.map((award) => (
              <li key={award.id} className="flex flex-col gap-2 py-5 sm:flex-row sm:gap-6">
                <span className="meta w-12 shrink-0 tabular text-copper">{award.year}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg text-ink">{award.title}</h2>
                  <p className="meta mt-0.5">{award.issuer}</p>
                  {/* Descriptions render inline. The previous card hid them on
                      the back face of a hover-only flip — unreachable on touch,
                      and hidden from screen readers by an overriding label. */}
                  {award.description && (
                    <p className="measure mt-2 text-sm text-ink-dim">{award.description}</p>
                  )}
                  {award.url && (
                    <a
                      href={award.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex min-h-11 items-center text-sm text-verdigris underline underline-offset-4"
                    >
                      View credential
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
