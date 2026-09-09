import Link from 'next/link';
import { Chip, EmptyState } from '@/components/ui/primitives';
import type { Service } from '@/lib/types';

export default function ServicesSection({ services }: { services: Service[] }) {
  if (services.length === 0) {
    return <EmptyState title="No services listed yet" />;
  }

  return (
    <ul className="divide-y divide-rule border-y border-rule">
      {services.map((service, index) => (
        <li key={service.id} className="group relative">
          <Link
            href={`/services/${service.slug}`}
            className="flex flex-col gap-2 py-5 sm:flex-row sm:items-baseline sm:gap-6"
          >
            {/* An index number rather than an icon: it costs nothing, reinforces
                the record motif, and never needs a colour to mean something. */}
            <span className="meta w-8 shrink-0 tabular">
              {String(index + 1).padStart(2, '0')}
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-lg text-ink transition-colors group-hover:text-verdigris">
                {service.title}
              </span>
              <span className="measure mt-1 block text-sm text-ink-dim">
                {service.description}
              </span>
            </span>

            {service.tags && service.tags.length > 0 && (
              <span className="flex shrink-0 flex-wrap gap-1 sm:max-w-56 sm:justify-end">
                {service.tags.slice(0, 3).map((tag) => (
                  <Chip key={tag.id}>{tag.name}</Chip>
                ))}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
