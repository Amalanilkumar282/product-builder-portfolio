import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Calendar, ArrowLeft } from 'lucide-react';
import { fetchBlogPosts } from '@/lib/api';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedSection from '@/components/ui/AnimatedSection';
import SectionHeader from '@/components/ui/SectionHeader';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { JsonLd, buildCollectionPageSchema } from '@/lib/entity-jsonld';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on software engineering, product design, and the digital world.',
  alternates: { canonical: '/blog' },
};

export default async function BlogPage() {
  const posts = await fetchBlogPosts();

  return (
    <div className="min-h-screen pt-24 pb-20">
      <JsonLd
        data={buildCollectionPageSchema({
          path: '/blog',
          title: 'Blog',
          description: 'Technical articles, engineering notes, product lessons, and architecture write-ups by Amal Anilkumar.',
        })}
      />
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-secondary transition-colors mb-8 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back home
          </Link>
        </AnimatedSection>

        <AnimatedSection>
          <SectionHeader
            label="Writing"
            title="All Articles"
            subtitle="Engineering deep dives, product thinking, and lessons learned."
          />
        </AnimatedSection>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-muted">No articles yet. Check back soon!</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <AnimatedSection key={post.id} delay={i * 0.07}>
                <GlassCard className="h-full flex flex-col p-0 overflow-hidden">
                  {post.coverImageUrl && (
                    <div className="relative h-44 overflow-hidden shrink-0">
                      <Image
                        src={post.coverImageUrl}
                        alt={post.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                    </div>
                  )}

                  <div className="p-5 flex flex-col flex-1">
                    {post.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag.id} variant="blue">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-base font-bold text-primary mb-2 hover:text-purple-300 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-sm text-secondary line-clamp-3 mb-4 flex-1">{post.summary}</p>

                    <div className="flex items-center gap-4 text-xs text-muted pt-3 border-t border-default">
                      {post.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {formatDate(post.publishedAt)}
                        </span>
                      )}
                      {post.readTime && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {post.readTime} min
                        </span>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
