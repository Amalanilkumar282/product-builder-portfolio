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
        hover && 'hover:border-purple-500/30 hover:bg-white/[0.05] hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1',
        gradient && 'gradient-border',
        className,
      )}
    >
      {children}
    </div>
  );
}
