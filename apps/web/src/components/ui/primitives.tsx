import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* ─── Tag chip ──────────────────────────────────────────────────────────────
   One tag treatment, site-wide. The previous system rendered the same Tag
   purple in Projects and Services but blue in Blog, which reads as a bug.
   ───────────────────────────────────────────────────────────────────────── */

export function Chip({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode;
  tone?: 'neutral' | 'accent' | 'copper';
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border px-1.5 py-0.5 font-mono text-2xs leading-none',
        tone === 'neutral' && 'border-rule bg-raised text-ink-dim',
        tone === 'accent' && 'border-verdigris/35 bg-verdigris-soft text-verdigris',
        tone === 'copper' && 'border-copper/35 bg-copper-soft text-copper',
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ─── Buttons ───────────────────────────────────────────────────────────── */

type ButtonTone = 'primary' | 'secondary' | 'ghost';

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ' +
  'min-h-11 px-4 transition-colors duration-150 ' +
  'disabled:opacity-50 disabled:pointer-events-none';

const buttonTones: Record<ButtonTone, string> = {
  // Copper is the site's "highest priority thing on this page" colour, and it
  // appears at most once per view.
  primary: 'bg-copper text-canvas hover:bg-copper/90',
  secondary: 'border border-rule-strong text-ink hover:border-verdigris hover:text-verdigris',
  ghost: 'text-ink-dim hover:text-ink hover:bg-raised',
};

export function ButtonLink({
  href,
  tone = 'secondary',
  external,
  className,
  children,
  ...rest
}: {
  href: string;
  tone?: ButtonTone;
  external?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'className' | 'children'>) {
  const classes = cn(buttonBase, buttonTones[tone], className);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  tone = 'secondary',
  className,
  children,
  ...rest
}: { tone?: ButtonTone } & ComponentPropsWithoutRef<'button'>) {
  return (
    <button className={cn(buttonBase, buttonTones[tone], className)} {...rest}>
      {children}
    </button>
  );
}

/* ─── Empty state ───────────────────────────────────────────────────────────
   Ten sections previously `return null`'d on an empty array while the fetch
   layer coalesced request-time failures to `[]` — so an API outage rendered as
   a page that merely looked shorter, indistinguishable from unauthored
   content. An empty state that names the situation and offers a way out is
   both better UX and a diagnostic.
   ───────────────────────────────────────────────────────────────────────── */

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-rule px-6 py-12 text-center">
      <p className="font-mono text-sm text-ink">{title}</p>
      {description && (
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-dim">{description}</p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

/* ─── Definition rail ───────────────────────────────────────────────────────
   The key/value list used across project metadata, experience detail and the
   contact panel. Mono keys, prose values — the rule that keeps values and
   sentences visually distinct.
   ───────────────────────────────────────────────────────────────────────── */

export function DefinitionList({
  items,
  className,
}: {
  items: { term: string; value: ReactNode }[];
  className?: string;
}) {
  const populated = items.filter((item) => item.value !== null && item.value !== undefined && item.value !== '');
  if (populated.length === 0) return null;

  return (
    <dl className={cn('space-y-3', className)}>
      {populated.map((item) => (
        <div key={item.term}>
          <dt className="meta uppercase tracking-[0.14em]">{item.term}</dt>
          <dd className="mt-0.5 text-sm text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ─── Hairline ──────────────────────────────────────────────────────────── */

export function Rule({ className }: { className?: string }) {
  return <hr className={cn('border-0 border-t border-rule', className)} />;
}
