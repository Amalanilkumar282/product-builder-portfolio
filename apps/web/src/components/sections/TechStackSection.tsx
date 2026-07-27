import Link from 'next/link';
import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import AnimatedSection from '@/components/ui/AnimatedSection';
import SectionConnector from '@/components/ui/SectionConnector';
import SceneCanvas from '@/components/3d/SceneCanvas';
import OrbitField from '@/components/3d/OrbitField';
import type { TechStack } from '@/lib/types';

interface TechStackSectionProps {
  techStack: TechStack[];
}

function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce(
    (acc, item) => {
      const k = String(item[key]);
      acc[k] = acc[k] ? [...acc[k], item] : [item];
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

export default function TechStackSection({ techStack }: TechStackSectionProps) {
  if (techStack.length === 0) return null;
  const grouped = groupBy(techStack, 'category');

  return (
    <section id="tech-stack" className="max-w-7xl mx-auto px-6 py-24">
      <SectionConnector />

      <AnimatedSection>
        <SectionHeader
          label="Tools & Stack"
          title="Tech Stack"
          subtitle="The ecosystem I rely on to build robust, scalable products."
        />
      </AnimatedSection>

      <AnimatedSection className="mb-12" delay={0.05}>
        <SceneCanvas
          className="h-56 sm:h-64 rounded-2xl glass overflow-hidden"
          cameraPosition={[0, 1.2, 4.8]}
          fallback={
            <div className="h-56 sm:h-64 rounded-2xl glass grid-bg flex items-center justify-center">
              <p className="text-xs uppercase tracking-widest text-muted">
                {techStack.length} tools & platforms
              </p>
            </div>
          }
        >
          <OrbitField count={techStack.length} />
        </SceneCanvas>
      </AnimatedSection>

      <div className="space-y-10">
        {Object.entries(grouped).map(([category, items], i) => (
          <AnimatedSection key={category} delay={i * 0.08}>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted mb-4">
                {category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {items.map((tech) => (
                  <div key={tech.id}>
                    {tech.url ? (
                      <Link
                        href={tech.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 glass px-4 py-2.5 rounded-xl text-sm text-secondary font-medium hover:border-accent hover:text-primary hover:-translate-y-0.5 transition-all"
                      >
                        {tech.iconUrl && (
                          <Image
                            src={tech.iconUrl}
                            alt={tech.name}
                            width={18}
                            height={18}
                            className="rounded"
                          />
                        )}
                        {tech.name}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2 glass px-4 py-2.5 rounded-xl text-sm text-secondary font-medium">
                        {tech.iconUrl && (
                          <Image
                            src={tech.iconUrl}
                            alt={tech.name}
                            width={18}
                            height={18}
                            className="rounded"
                          />
                        )}
                        {tech.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}

