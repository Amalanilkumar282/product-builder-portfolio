import Link from 'next/link';
import { ArrowRight, Layers } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Badge from '@/components/ui/Badge';
import type { Service } from '@/lib/types';

interface ServicesSectionProps {
  services: Service[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  if (services.length === 0) return null;

  return (
    <section id="services" className="max-w-7xl mx-auto px-6 py-24">
      <AnimatedSection>
        <SectionHeader
          label="What I Build For Clients"
          title="Services"
          subtitle="End-to-end digital products — from idea to production, built to last."
        />
      </AnimatedSection>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.slice(0, 6).map((service, i) => (
          <AnimatedSection key={service.id} delay={i * 0.08}>
            <GlassCard className="h-full group">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Layers size={18} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">
                <Link
                  href={`/services/${service.slug}`}
                  className="hover:text-purple-400 transition-colors"
                >
                  {service.title}
                </Link>
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                {service.description}
              </p>
              {service.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {service.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag.id} variant="purple">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </GlassCard>
          </AnimatedSection>
        ))}
      </div>

      {services.length > 6 && (
        <AnimatedSection className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 glass px-6 py-3 rounded-xl text-slate-300 text-sm font-medium hover:border-purple-500/30 hover:text-white transition-all"
          >
            View all services <ArrowRight size={16} />
          </Link>
        </AnimatedSection>
      )}
    </section>
  );
}
