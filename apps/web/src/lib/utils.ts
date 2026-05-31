import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
}

export function formatDateRange(start: string, end?: string, isPresent?: boolean): string {
  const startStr = formatDate(start);
  if (isPresent) return `${startStr} — Present`;
  if (end) return `${startStr} — ${formatDate(end)}`;
  return startStr;
}
