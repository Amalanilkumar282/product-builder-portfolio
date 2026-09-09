import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Semantic colour tokens declared in globals.css's `@theme` block.
 *
 * tailwind-merge has to be told about these explicitly. Left to its own
 * heuristics it guesses a class group from the class name's shape, and a
 * wrong guess silently drops one of two classes at runtime with no build
 * error — `text-ink` (a colour) looks a lot like `text-sm` (a size). Naming
 * the groups here makes conflict resolution deterministic.
 */
const COLOR_TOKENS = [
  'canvas',
  'surface',
  'raised',
  'rule',
  'rule-strong',
  'ink',
  'ink-dim',
  'ink-faint',
  'verdigris',
  'verdigris-soft',
  'copper',
  'copper-soft',
  'positive',
  'critical',
  'lane-work',
  'lane-internship',
  'lane-leadership',
  'lane-award',
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-family': [{ font: ['sans', 'display', 'mono'] }],
      'text-color': [{ text: [...COLOR_TOKENS] }],
      'bg-color': [{ bg: [...COLOR_TOKENS] }],
      'border-color': [{ border: [...COLOR_TOKENS] }],
      'ring-color': [{ ring: [...COLOR_TOKENS] }],
      'outline-color': [{ outline: [...COLOR_TOKENS] }],
      'text-decoration-color': [{ decoration: [...COLOR_TOKENS] }],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * "Jan 2025" — the month/year form used for every date on the site.
 * Fixed to en-GB so server and client agree regardless of the runtime locale;
 * a mismatch here is a hydration error.
 */
export function formatMonthYear(value: string | number | Date | null | undefined): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

/** "12 Jan 2025" — for blog posts, where the day matters. */
export function formatFullDate(value: string | number | Date | null | undefined): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** "Jan 2025 — Present" for a role, collapsing a same-month range. */
export function formatDateRange(
  start: string | number | Date,
  end: string | number | Date | null | undefined,
  isPresent?: boolean,
): string {
  const from = formatMonthYear(start);
  if (isPresent) return `${from} — Present`;
  const to = formatMonthYear(end);
  if (!to || to === from) return from;
  return `${from} — ${to}`;
}

/** Whole months between two dates, floored at 1 so nothing reads as "0 mo". */
export function monthsBetween(
  start: string | number | Date,
  end: string | number | Date | null | undefined,
): number {
  const from = start instanceof Date ? start : new Date(start);
  const to = end ? (end instanceof Date ? end : new Date(end)) : new Date();
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return 0;
  const months =
    (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  return Math.max(1, months);
}

/** "1 yr 4 mo" — reads better than a raw month count on a timeline. */
export function formatDuration(months: number): string {
  if (months <= 0) return '';
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return `${rest} mo`;
  if (rest === 0) return `${years} yr`;
  return `${years} yr ${rest} mo`;
}

/**
 * Parses the JSON `string[]` columns (Project.gallery, relatedServiceSlugs).
 * Prisma returns them raw with no normalisation, and the admin write path
 * widens the type to `string[] | string`, so both shapes reach the frontend.
 */
export function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
  if (typeof value === 'string') {
    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed)
        ? parsed.filter((v): v is string => typeof v === 'string')
        : [];
    } catch {
      return [];
    }
  }
  return [];
}
