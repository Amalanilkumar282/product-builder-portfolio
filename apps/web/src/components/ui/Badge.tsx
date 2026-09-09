import type { ReactNode } from 'react';
import { Chip } from './primitives';

/**
 * Kept as a thin alias so the admin panel's existing call sites keep working.
 * New code should use `Chip` directly.
 *
 * The `variant` prop is intentionally ignored: the same tag used to render
 * purple in Projects and Services but blue in Blog, which read as a bug. One
 * tag treatment, site-wide.
 */
export default function Badge({
  children,
}: {
  children: ReactNode;
  variant?: string;
}) {
  return <Chip>{children}</Chip>;
}
