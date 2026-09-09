import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { fetchBlogPost, fetchBlogPosts } from '@/lib/api';
import MarkdownContent from '@/components/content/MarkdownContent';
import { Chip, Rule } from '@/components/ui/primitives';
import { formatFullDate } from '@/lib/utils';
import { JsonLd, buildBlogPostSchema, buildBreadcrumbSchema } from '@/lib/entity-jsonld';
import { CANONICAL_NAME, SITE_URL, buildPageTitle } from '@/lib/site';

export async function generateStaticParams() {
  const posts = await fetchBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) return {};

  const ogImage =
    post.coverImageUrl ??
    `${SITE_URL}/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(
      post.summary ?? '',
    )}&type=blog`;
  const title = buildPageTitle(post.seoTitle ?? post.title);
  const description = post.seoDescription ?? post.summary;
  const url = `${SITE_URL}/blog/${slug}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: post.canonicalUrl ?? url },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [CANONICAL_NAME],
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([fetchBlogPost(slug), fetchBlogPosts()]);
  if (!post) notFound();

  const related = posts
    .filter(
      (other) =>
        other.id !== post.id &&
        (other.series
          ? other.series === post.series
          : other.tags?.some((tag) => post.tags?.some((t) => t.id === tag.id))),
    )
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          buildBlogPostSchema(post),
          buildBreadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Writing', url: `${SITE_URL}/blog` },
            { name: post.title, url: `${SITE_URL}/blog/${slug}` },
          ]),
        ]}
      />

      <article className="shell py-[calc(var(--header-h)+3rem)]">
        <Link
          href="/blog"
          className="meta inline-flex min-h-11 items-center gap-2 hover:text-verdigris"
        >
          <ArrowLeft size={13} aria-hidden="true" /> All writing
        </Link>

        <div className="rail-grid mt-6">
          <aside className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <dl className="space-y-3">
              {post.publishedAt && (
                <div>
                  <dt className="meta uppercase tracking-[0.14em]">Published</dt>
                  <dd className="mt-0.5 text-sm text-ink">
                    <time dateTime={post.publishedAt}>{formatFullDate(post.publishedAt)}</time>
                  </dd>
                </div>
              )}
              {typeof post.readTime === 'number' && post.readTime > 0 && (
                <div>
                  <dt className="meta uppercase tracking-[0.14em]">Reading time</dt>
                  <dd className="mt-0.5 text-sm text-ink">{post.readTime} min</dd>
                </div>
              )}
              {post.category && (
                <div>
                  <dt className="meta uppercase tracking-[0.14em]">Category</dt>
                  <dd className="mt-0.5 text-sm text-ink">{post.category}</dd>
                </div>
              )}
              {post.series && (
                <div>
                  <dt className="meta uppercase tracking-[0.14em]">Series</dt>
                  <dd className="mt-0.5 text-sm text-ink">{post.series}</dd>
                </div>
              )}
            </dl>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-5">
                <p className="meta uppercase tracking-[0.14em]">Tagged</p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {post.tags.map((tag) => (
                    <Chip key={tag.id}>{tag.name}</Chip>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <div className="min-w-0">
            <h1 className="measure text-4xl text-ink md:text-5xl">{post.title}</h1>
            <p className="measure mt-4 text-lg text-ink-dim">{post.summary}</p>

            {post.coverImageUrl && (
              <div className="relative mt-8 aspect-video overflow-hidden rounded-lg border border-rule">
                <Image
                  src={post.coverImageUrl}
                  // Uses the authored alt text when present. `coverImageAlt`
                  // exists on every post and was read by nothing — every blog
                  // image used the title, duplicating the adjacent heading.
                  alt={post.coverImageAlt ?? ''}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
            )}

            <div className="mt-10">
              <MarkdownContent content={post.content} />
            </div>

            {related.length > 0 && (
              <>
                <Rule className="mt-12" />
                <h2 className="meta mt-6 uppercase tracking-[0.14em]">Related writing</h2>
                <ul className="mt-2 divide-y divide-rule border-t border-rule">
                  {related.map((other) => (
                    <li key={other.id}>
                      <Link
                        href={`/blog/${other.slug}`}
                        className="flex min-h-11 items-center py-2 text-sm text-ink-dim hover:text-verdigris"
                      >
                        {other.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </article>
    </>
  );
}
