import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface AdminCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
}

export default function AdminCard({
  children,
  className,
  title,
  description,
  action,
}: AdminCardProps) {
  return (
    <div className={cn('glass rounded-2xl p-6 border border-default', className)}>
      {(title || description || action) && (
        <div className="flex items-start justify-between mb-6">
          <div>
            {title && <h3 className="text-lg font-semibold text-primary">{title}</h3>}
            {description && <p className="text-sm text-muted mt-1">{description}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
