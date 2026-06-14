import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import { fetchBlogPost, fetchBlogPosts, fetchProfile } from '@/lib/api';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Badge from '@/components/ui/Badge';
import GlassCard from '@/components/ui/GlassCard';
import { formatDate } from '@/lib/utils';
import { JsonLd, buildBlogPostSchema, buildBreadcrumbSchema } from '@/lib/jsonld';

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
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001';
  const ogImage = post.coverImageUrl ?? `${SITE_URL}/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.summary ?? '')}&type=blog`;
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.summary,
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
    openGraph: {
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', images: [ogImage] },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, profile] = await Promise.all([fetchBlogPost(slug), fetchProfile()]);
  if (!post) notFound();

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001';

  return (
    <div className="min-h-screen pt-24 pb-20">
      <JsonLd data={[
        buildBlogPostSchema(post),
        buildBreadcrumbSchema([
          { name: 'Home', url: SITE_URL },
          { name: 'Blog', url: `${SITE_URL}/blog` },
          { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
        ]),
      ]} />
      <div className="max-w-3xl mx-auto px-6">
        <AnimatedSection className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-secondary transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            All articles
          </Link>
        </AnimatedSection>

        {post.coverImageUrl && (
          <AnimatedSection className="mb-8">
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
              <Image
                src={post.coverImageUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
            </div>
          </AnimatedSection>
        )}

        <AnimatedSection>
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag.id} variant="blue">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-5 text-sm text-muted mb-8">
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar size={14} /> {formatDate(post.publishedAt)}
              </span>
            )}
            {post.readTime && (
              <span className="flex items-center gap-1.5">
                <Clock size={14} /> {post.readTime} min read
              </span>
            )}
          </div>

          <p className="text-secondary text-lg leading-relaxed mb-8 border-l-2 border-purple-500/50 pl-4">
            {post.summary}
          </p>
        </AnimatedSection>

        {/* Article content */}
        <AnimatedSection delay={0.1}>
          <div className="glass rounded-2xl p-8 md:p-10">
            <div className="prose dark:prose-invert prose-slate max-w-none prose-headings:font-bold prose-a:text-purple-400 prose-code:text-purple-300 prose-pre:bg-elevated prose-pre:border prose-pre:border-default">
              {post.content}
            </div>
          </div>
        </AnimatedSection>

        {/* About the author */}
        <AnimatedSection delay={0.2} className="mt-10">
          <div className="glass rounded-2xl p-6 md:p-8 border border-purple-500/10">
            <div className="flex items-start gap-5">
              <div className="shrink-0">
                {profile?.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.name}
                    width={56}
                    height={56}
                    className="rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center">
                    <User size={24} className="text-white" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-purple-400 font-semibold tracking-widest uppercase mb-1">
                  About the author
                </p>
                <p className="text-primary font-semibold text-sm mb-1">
                  {profile?.name ?? 'Amal Anilkumar'}
                </p>
                <p className="text-secondary text-sm leading-relaxed">
                  {profile?.bio ??
                    'Full-stack software engineer passionate about building scalable web products where tech and nature thrive together. Writing about engineering, product design, and everything in between.'}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <Link
                    href="/contact"
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Work together →
                  </Link>
                  <Link
                    href="/blog"
                    className="text-xs text-muted hover:text-secondary transition-colors"
                  >
                    More articles
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
