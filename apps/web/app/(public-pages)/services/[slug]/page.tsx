import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { fetchService, fetchServices, fetchProjects } from '@/lib/api';
import FaqAccordion from '@/components/ui/FaqAccordion';
import MarkdownContent from '@/components/content/MarkdownContent';
import { ButtonLink, Chip, Rule } from '@/components/ui/primitives';
import {
  JsonLd,
  buildServiceSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from '@/lib/entity-jsonld';
import { SITE_URL, buildPageTitle } from '@/lib/site';

export async function generateStaticParams() {
  const services = await fetchServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await fetchService(slug);
  if (!service) return {};

  const ogImage = `${SITE_URL}/og?title=${encodeURIComponent(
    service.title,
  )}&subtitle=${encodeURIComponent(service.description ?? '')}&type=service`;
  const title = buildPageTitle(service.seoTitle ?? service.title);
  const description = service.seoDescription ?? service.description;
  const url = `${SITE_URL}/services/${slug}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: service.title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  };
}

/**
 * Service FAQs.
 *
 * These are template strings rather than DB content, and they emit a real
 * FAQPage schema that is already indexed — so the wording is preserved
 * verbatim rather than rewritten. Note that they contain commitments
 * (response time, included post-launch support) that live in code and can
 * only be changed by a deploy.
 */
function buildServiceFaqs(service: {
  title: string;
  description: string;
  tags: { name: string }[];
}) {
  const techList = service.tags.map((t) => t.name).join(', ') || 'modern web technologies';
  return [
    {
      question: `What is included in your ${service.title} service?`,
      answer: `${service.description} I handle everything from initial scoping through to deployment, including code review, documentation, and a handover session.`,
    },
    {
      question: 'How long does a typical project take?',
      answer:
        'Timelines depend on scope. A focused feature or landing page typically takes 1–2 weeks; a full product build ranges from 4–12 weeks. I provide a detailed timeline estimate after the initial scoping call.',
    },
    {
      question: `What technologies do you use for ${service.title}?`,
      answer: `I primarily work with ${techList}. I choose the right stack for your project's requirements — prioritising maintainability, performance, and your team's ability to take ownership after handover.`,
    },
    {
      question: 'Do you offer ongoing support after launch?',
      answer:
        'Yes. I offer monthly retainer agreements for continued development, bug fixes, and feature enhancements. One month of post-launch support is included in every project.',
    },
    {
      question: 'How do we get started?',
      answer:
        'The best first step is to use the contact form at amalanilkumar.com/contact. I respond within 24 hours to schedule a free scoping call where we align on goals, timeline, and budget.',
    },
  ];
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [service, projects] = await Promise.all([fetchService(slug), fetchProjects()]);
  if (!service) notFound();

  const faqs = buildServiceFaqs(service);
  const relatedProjects = projects
    .filter((project) =>
      project.tags.some((tag) => service.tags.some((serviceTag) => serviceTag.slug === tag.slug)),
    )
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          buildServiceSchema(service),
          buildFaqSchema(faqs),
          buildBreadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Services', url: `${SITE_URL}/services` },
            { name: service.title, url: `${SITE_URL}/services/${service.slug}` },
          ]),
        ]}
      />

      <article className="shell py-[calc(var(--header-h)+3rem)]">
        <Link
          href="/services"
          className="meta inline-flex min-h-11 items-center gap-2 hover:text-verdigris"
        >
          <ArrowLeft size={13} aria-hidden="true" /> All services
        </Link>

        <div className="rail-grid mt-6">
          <aside className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            {service.tags?.length > 0 && (
              <div>
                <p className="meta uppercase tracking-[0.14em]">Stack</p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {service.tags.map((tag) => (
                    <Chip key={tag.id}>{tag.name}</Chip>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-5">
              <ButtonLink href="/contact" tone="primary" className="w-full">
                Start a project
              </ButtonLink>
            </div>
          </aside>

          <div className="min-w-0">
            <h1 className="measure text-4xl text-ink md:text-5xl">{service.title}</h1>
            <p className="measure mt-4 text-lg text-ink-dim">{service.description}</p>

            <div className="mt-10">
              <MarkdownContent content={service.content} />
            </div>

            <Rule className="mt-12" />
            <section className="mt-8">
              <h2 className="text-2xl text-ink">Common questions</h2>
              <div className="mt-4">
                <FaqAccordion items={faqs} />
              </div>
            </section>

            {relatedProjects.length > 0 && (
              <section className="mt-10">
                <h2 className="meta uppercase tracking-[0.14em]">Related work</h2>
                <ul className="mt-2 divide-y divide-rule border-t border-rule">
                  {relatedProjects.map((project) => (
                    <li key={project.id}>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="block py-3 hover:text-verdigris"
                      >
                        <span className="block text-sm text-ink">{project.title}</span>
                        <span className="measure mt-0.5 block text-sm text-ink-dim">
                          {project.summary}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </article>
    </>
  );
}
