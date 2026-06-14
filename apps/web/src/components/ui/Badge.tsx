import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'purple' | 'blue' | 'slate';
}

export default function Badge({ children, className = '', variant = 'purple' }: BadgeProps) {
  const variants = {
    purple: 'bg-accent-light text-accent-muted border-accent',
    blue:   'bg-blue-light text-blue-700 dark:text-blue-300 border-blue-500/20',
    slate:  'bg-slate-200 dark:bg-slate-500/10 text-secondary border-slate-300 dark:border-slate-500/20',
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
