import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { fetchService, fetchServices, fetchProjects } from '@/lib/api';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Badge from '@/components/ui/Badge';
import SectionHeader from '@/components/ui/SectionHeader';
import FaqAccordion from '@/components/ui/FaqAccordion';
import MarkdownContent from '@/components/content/MarkdownContent';
import {
  JsonLd,
  buildServiceSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from '@/lib/entity-jsonld';
import { SITE_URL } from '@/lib/site';

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
  const ogImage = `${SITE_URL}/og?title=${encodeURIComponent(service.title)}&subtitle=${encodeURIComponent(service.description ?? '')}&type=service`;
  return {
    title: service.seoTitle ?? service.title,
    description: service.seoDescription ?? service.description,
    alternates: { canonical: `${SITE_URL}/services/${slug}` },
    openGraph: { images: [{ url: ogImage, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', images: [ogImage] },
  };
}

/** Generate service-specific FAQs from service data */
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
    .filter((project) => project.tags.some((tag) => service.tags.some((serviceTag) => serviceTag.slug === tag.slug)))
    .slice(0, 3);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <JsonLd data={[
        buildServiceSchema(service),
        buildFaqSchema(faqs),
        buildBreadcrumbSchema([
          { name: 'Home', url: SITE_URL },
          { name: 'Services', url: `${SITE_URL}/services` },
          { name: service.title, url: `${SITE_URL}/services/${service.slug}` },
        ]),
      ]} />
      <div className="max-w-4xl mx-auto px-6">
        <AnimatedSection className="mb-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-secondary transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            All services
          </Link>
        </AnimatedSection>

        <AnimatedSection>
          {service.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {service.tags.map((tag) => (
                <Badge key={tag.id} variant="purple">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight">
            {service.title}
          </h1>

          <p className="text-secondary text-lg mb-8">{service.description}</p>

          <div className="glass rounded-2xl p-5 mb-8 border border-accent">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
              AI-Readable Summary
            </p>
            <p className="text-sm text-secondary leading-relaxed">
              {service.title} is a client-facing service offered by Amal Anilkumar. It is designed for teams that need scalable delivery, strong technical foundations, and direct implementation support from architecture through launch.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="glass rounded-2xl p-8 md:p-10 mb-10">
            <MarkdownContent className="prose dark:prose-invert prose-slate max-w-none prose-headings:font-bold prose-a:text-purple-400 prose-code:text-purple-300" content={service.content} />
          </div>
        </AnimatedSection>

        {/* FAQ */}
        <AnimatedSection delay={0.15}>
          <div className="mb-10">
            <SectionHeader
              label="FAQ"
              title="Frequently Asked Questions"
              className="mb-6"
            />
            <FaqAccordion items={faqs} />
          </div>
        </AnimatedSection>

        {relatedProjects.length > 0 && (
          <AnimatedSection delay={0.18} className="mb-10">
            <div className="glass rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4">
                Related Projects
              </p>
              <div className="grid gap-3">
                {relatedProjects.map((project) => (
                  <a
                    key={project.id}
                    href={`/projects/${project.slug}`}
                    className="rounded-xl border border-default px-4 py-3 hover:border-accent transition-colors"
                  >
                    <p className="text-sm font-semibold text-primary">{project.title}</p>
                    <p className="text-sm text-secondary">{project.summary}</p>
                  </a>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        <AnimatedSection delay={0.2}>
          <div className="glass rounded-2xl p-8 text-center border border-accent">
            <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">
              Interested in this service?
            </h3>
            <p className="text-secondary text-sm mb-6">
              Let&apos;s discuss how I can help you achieve your goals.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 gradient-bg px-6 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-accent"
            >
              Get in touch
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}



