import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { fetchBlogPost, fetchBlogPosts } from '@/lib/api';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

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
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.summary,
    openGraph: post.coverImageUrl
      ? { images: [{ url: post.coverImageUrl }] }
      : undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <AnimatedSection className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors group"
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

          <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-5 text-sm text-slate-500 mb-8">
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

          <p className="text-slate-300 text-lg leading-relaxed mb-8 border-l-2 border-purple-500/50 pl-4">
            {post.summary}
          </p>
        </AnimatedSection>

        {/* Article content */}
        <AnimatedSection delay={0.1}>
          <div className="glass rounded-2xl p-8 md:p-10">
            <div className="prose prose-invert prose-slate max-w-none prose-headings:font-bold prose-a:text-purple-400 prose-code:text-purple-300 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-white/10">
              {post.content}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
