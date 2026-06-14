import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Layers } from 'lucide-react';
import { fetchServices } from '@/lib/api';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedSection from '@/components/ui/AnimatedSection';
import SectionHeader from '@/components/ui/SectionHeader';
import Badge from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Professional full-stack development services tailored to your product goals.',
};

export default async function ServicesPage() {
  const services = await fetchServices();

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-secondary transition-colors mb-8 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back home
          </Link>
        </AnimatedSection>

        <AnimatedSection>
          <SectionHeader
            label="What I Offer"
            title="Services"
            subtitle="End-to-end digital solutions built for scale."
          />
        </AnimatedSection>

        {services.length === 0 ? (
          <div className="text-center py-20 text-muted">No services listed yet.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <AnimatedSection key={service.id} delay={i * 0.08}>
                <GlassCard className="h-full group">
                  <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Layers size={18} className="text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-primary mb-2">
                    <Link
                      href={`/services/${service.slug}`}
                      className="hover:text-purple-400 transition-colors"
                    >
                      {service.title}
                    </Link>
                  </h2>
                  <p className="text-secondary text-sm leading-relaxed mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  {service.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {service.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag.id} variant="purple">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium mt-auto"
                  >
                    Learn more <ArrowRight size={12} />
                  </Link>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

