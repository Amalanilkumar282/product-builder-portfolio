import Image from 'next/image';
import type { Testimonial } from '@/lib/types';

export default function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  if (testimonials.length === 0) return null;

  return (
    <ul className="grid gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-2 xl:grid-cols-3">
      {testimonials.map((item) => (
        <li key={item.id} className="flex flex-col bg-surface p-5">
          <blockquote className="flex-1 text-sm text-ink-dim">
            <p>{item.content}</p>
          </blockquote>

          <figcaption className="mt-4 flex items-center gap-3 border-t border-rule pt-3">
            {item.avatarUrl && (
              <Image
                src={item.avatarUrl}
                alt=""
                width={32}
                height={32}
                className="size-8 shrink-0 rounded-full border border-rule object-cover"
              />
            )}
            <span className="min-w-0">
              <span className="block truncate text-sm text-ink">{item.name}</span>
              <span className="meta block truncate">
                {item.role}
                {item.company ? `, ${item.company}` : ''}
              </span>
            </span>
          </figcaption>
        </li>
      ))}
    </ul>
  );
}
