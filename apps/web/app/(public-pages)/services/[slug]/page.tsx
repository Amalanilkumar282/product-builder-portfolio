import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { fetchService, fetchServices } from '@/lib/api';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Badge from '@/components/ui/Badge';

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
  return {
    title: service.seoTitle ?? service.title,
    description: service.seoDescription ?? service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await fetchService(slug);
  if (!service) notFound();

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <AnimatedSection className="mb-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors group"
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

          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4 leading-tight">
            {service.title}
          </h1>

          <p className="text-slate-400 text-lg mb-8">{service.description}</p>
        </AnimatedSection>

        {/* Content */}
        <AnimatedSection delay={0.1}>
          <div className="glass rounded-2xl p-8 md:p-10 mb-10">
            <div className="prose prose-invert prose-slate max-w-none prose-headings:font-bold prose-a:text-purple-400 prose-code:text-purple-300">
              {service.content}
            </div>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection delay={0.2}>
          <div className="glass rounded-2xl p-8 text-center border border-purple-500/20">
            <h3 className="text-xl font-bold text-slate-100 mb-2">
              Interested in this service?
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Let&apos;s discuss how I can help you achieve your goals.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 gradient-bg px-6 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
            >
              <MessageSquare size={16} /> Get in touch
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

