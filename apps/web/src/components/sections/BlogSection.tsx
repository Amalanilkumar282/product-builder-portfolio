import Link from 'next/link';
import { Chip, EmptyState } from '@/components/ui/primitives';
import { formatFullDate } from '@/lib/utils';
import type { BlogPost } from '@/lib/types';

export default function BlogSection({
  posts,
  limit,
}: {
  posts: BlogPost[];
  limit?: number;
}) {
  if (posts.length === 0) {
    return <EmptyState title="Nothing written yet" description="Notes on shipped work will land here." />;
  }

  const visible = limit ? posts.slice(0, limit) : posts;

  return (
    <ul className="divide-y divide-rule border-y border-rule">
      {visible.map((post) => (
        <li key={post.id} className="group">
          <Link href={`/blog/${post.slug}`} className="flex flex-col gap-2 py-5">
            <div className="flex flex-wrap items-baseline gap-x-3">
              {post.publishedAt && (
                <time dateTime={post.publishedAt} className="meta">
                  {formatFullDate(post.publishedAt)}
                </time>
              )}
              {typeof post.readTime === 'number' && post.readTime > 0 && <span className="meta">{post.readTime} min read</span>}
              {post.category && <Chip tone="accent">{post.category}</Chip>}
            </div>

            <h3 className="text-lg text-ink transition-colors group-hover:text-verdigris">
              {post.title}
            </h3>
            <p className="measure text-sm text-ink-dim">{post.summary}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
