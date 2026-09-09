import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  /**
   * Anchor id. Threaded as a prop rather than hardcoded in each section
   * because the navbar links, the scroll-spy hook and the hero CTAs all
   * depend on these ids, and the scroll-spy fails silently when one goes
   * missing — the only symptom is the nav indicator quietly not moving.
   */
  id?: string;
  /** Mono text for the metadata rail: the section's label. */
  label?: string;
  /** Optional second line in the rail — a count, a date range, a status. */
  meta?: ReactNode;
  /** Rail content rendered below the label (filters, an index, a legend). */
  railExtra?: ReactNode;
  title?: string;
  /** Heading level. Detail pages need an h1; homepage sections take h2. */
  as?: 'h1' | 'h2';
  intro?: string;
  children: ReactNode;
  className?: string;
  /** Skips the reading-measure cap — used by the full-bleed timeline. */
  wide?: boolean;
}

/**
 * The spec-sheet section shell: a narrow mono metadata rail beside a wide
 * content column.
 *
 * This replaces a shell that was copy-pasted byte-identically into nine
 * section components (`max-w-7xl mx-auto px-6 py-24` plus a connector and a
 * centred header), which produced ~192px of dead space between every section
 * and made the page read as one card treatment scrolled eleven times.
 */
export default function Section({
  id,
  label,
  meta,
  railExtra,
  title,
  as: Heading = 'h2',
  intro,
  children,
  className,
  wide = false,
}: SectionProps) {
  return (
    <section
      id={id}
      // scroll-mt keeps the heading clear of the fixed header on hash landings.
      className={cn('shell scroll-mt-[calc(var(--header-h)+2rem)] py-16 md:py-24', className)}
      aria-labelledby={title && id ? `${id}-heading` : undefined}
    >
      <div className="rail-grid">
        {(label || meta || railExtra) && (
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 lg:block">
              {label && (
                <p className="meta uppercase tracking-[0.14em] text-verdigris">{label}</p>
              )}
              {meta && <div className="meta lg:mt-2">{meta}</div>}
            </div>
            {railExtra && <div className="mt-4 lg:mt-6">{railExtra}</div>}
          </div>
        )}

        <div className={cn('min-w-0', !label && !meta && !railExtra && 'lg:col-span-2')}>
          {title && (
            <header className={cn('mb-8 md:mb-10', !wide && 'measure')}>
              <Heading
                id={id ? `${id}-heading` : undefined}
                className={cn(
                  'text-ink',
                  Heading === 'h1' ? 'text-4xl md:text-5xl' : 'text-3xl',
                )}
              >
                {title}
              </Heading>
              {intro && <p className="mt-3 text-ink-dim text-lg">{intro}</p>}
            </header>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
