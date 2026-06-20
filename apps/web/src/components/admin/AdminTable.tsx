import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  emptyMessage?: string;
  actions?: (item: T) => ReactNode;
}

export default function AdminTable<T extends { id: string }>({
  data,
  columns,
  onEdit,
  onDelete,
  emptyMessage = 'No data available',
  actions,
}: AdminTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 glass rounded-2xl border border-default">
        <p className="text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-default">
            {columns.map((column, index) => (
              <th
                key={index}
                className={cn(
                  'text-left py-4 px-4 text-sm font-semibold text-secondary',
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
            {(onEdit || onDelete || actions) && (
              <th className="text-right py-4 px-4 text-sm font-semibold text-secondary">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className="border-b border-default/50 hover:bg-white/5 transition-colors"
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={cn('py-4 px-4 text-sm text-primary', column.className)}
                >
                  {column.render
                    ? column.render(item)
                    : String((item as any)[column.key] ?? '-')}
                </td>
              ))}
              {(onEdit || onDelete || actions) && (
                <td className="py-4 px-4 text-right">
                  {actions ? (
                    actions(item)
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/10 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
