import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export default function GlassCard({
  children,
  className = '',
  hover = true,
  gradient = false,
}: GlassCardProps) {
  return (
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
}
