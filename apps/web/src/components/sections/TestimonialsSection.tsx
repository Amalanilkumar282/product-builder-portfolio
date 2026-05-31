import Image from 'next/image';
import { Star, Quote } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedSection from '@/components/ui/AnimatedSection';
import type { Testimonial } from '@/lib/types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="max-w-7xl mx-auto px-6 py-24">
      <div className="w-full h-px gradient-bg opacity-20 mb-24" />

      <AnimatedSection>
        <SectionHeader
          label="Testimonials"
          title="What Clients Say"
          subtitle="Feedback from people I've had the pleasure of working with."
          centered
        />
      </AnimatedSection>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <AnimatedSection key={t.id} delay={i * 0.1}>
            <GlassCard className="h-full flex flex-col">
              {/* Quote icon */}
              <Quote size={28} className="text-purple-500/40 mb-4 shrink-0" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={14}
                    className={idx < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700'}
                  />
                ))}
              </div>

              <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                &ldquo;{t.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.05]">
                {t.avatarUrl ? (
                  <Image
                    src={t.avatarUrl}
                    alt={t.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-slate-200">{t.name}</p>
                  <p className="text-xs text-slate-500">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
