import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Cache tags used by the `next: { tags }` options in src/lib/api.ts.
//
// The first three own public URLs. The rest render on shared pages and
// previously had no tag at all, which meant an admin edit to a skill, award or
// the profile could only be waited out — up to five minutes — with no way to
// push it live.
const VALID_TAGS = new Set([
  'blog',
  'project',
  'service',
  'profile',
  'skill',
  'experience',
  'education',
  'testimonial',
  'tech-stack',
  'award',
  'certification',
  'talk',
  'page-section',
]);

/**
 * On-demand ISR endpoint.
 * apps/api calls this immediately after a blog post / project / service is
 * created, updated, or deleted so the change is visible right away instead
 * of waiting for the passive time-based revalidation window.
 *
 * POST /api/revalidate
 * Headers: Authorization: Bearer <REVALIDATE_SECRET>
 * Body: { tag?: 'blog' | 'project' | 'service'; paths?: string[] }
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Revalidation not configured' }, { status: 500 });
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { tag?: string; paths?: string[] } = {};
  try {
    body = await request.json();
  } catch {
    // no body provided — fall through with defaults
  }

  const revalidated: string[] = [];

  if (body.tag && VALID_TAGS.has(body.tag)) {
    revalidateTag(body.tag, 'max');
    revalidated.push(`tag:${body.tag}`);
  }

  if (Array.isArray(body.paths)) {
    for (const path of body.paths) {
      if (typeof path === 'string' && path.startsWith('/')) {
        revalidatePath(path);
        revalidated.push(`path:${path}`);
      }
    }
  }

  // Always refresh the sitemap and blog/project/service list pages so new
  // content is discoverable without waiting for a full rebuild.
  revalidatePath('/sitemap.xml');

  return NextResponse.json({ revalidated, now: Date.now() });
}
