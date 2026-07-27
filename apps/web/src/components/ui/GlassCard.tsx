import { cn } from '@/lib/utils';
import Tilt3D from '@/components/ui/Tilt3D';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  /** Opt-in pointer-reactive 3D tilt + glare sheen. Defaults to off — fully
   * backwards-compatible with every existing usage of this component. */
  tilt?: boolean;
}

export default function GlassCard({
  children,
  className = '',
  hover = true,
  gradient = false,
  tilt = false,
}: GlassCardProps) {
  const card = (
    <div
      className={cn(
        'rounded-2xl glass p-6 transition-all duration-300',
        hover && 'hover:border-accent hover:glass-hover-bg hover:shadow-xl hover:shadow-accent hover:-translate-y-1',
        gradient && 'gradient-border',
        className,
      )}
    >
      {children}
    </div>
  );

  if (!tilt) return card;

  return (
    <Tilt3D className={cn('rounded-2xl', className)} maxTilt={6}>
      {card}
    </Tilt3D>
  );
}



