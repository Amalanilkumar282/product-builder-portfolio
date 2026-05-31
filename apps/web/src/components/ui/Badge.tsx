import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'purple' | 'blue' | 'slate';
}

export default function Badge({ children, className = '', variant = 'purple' }: BadgeProps) {
  const variants = {
    purple: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    blue:   'bg-blue-500/10 text-blue-300 border-blue-500/20',
    slate:  'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  return (
    <span
      className={cn(
        'inline-block text-xs font-medium px-2.5 py-1 rounded-full border',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
