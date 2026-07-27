import { cn } from '@/lib/utils';

interface SectionConnectorProps {
  className?: string;
}

/**
 * Decorative section divider used across the page — a glowing "trace" line
 * with a pulsing node at its center, echoing the site's engineering-schematic
 * visual language. Drop-in replacement for the old plain gradient divider;
 * same layout footprint (purely visual, `aria-hidden`).
 */
export default function SectionConnector({ className }: SectionConnectorProps) {
  return (
    <div className={cn('relative mb-24 flex items-center', className)} aria-hidden="true">
      <div className="trace-line h-px w-full opacity-60" />
      <span className="trace-node absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full gradient-bg" />
    </div>
  );
}
