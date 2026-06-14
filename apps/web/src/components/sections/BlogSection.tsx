import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import type { BlogPost } from '@/lib/types';

interface BlogSectionProps {
  posts: BlogPost[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="max-w-7xl mx-auto px-6 py-24">
      <div className="w-full h-px gradient-bg opacity-20 mb-24" />

      <AnimatedSection>
        <SectionHeader
          label="Writing"
          title="Latest Articles"
          subtitle="Thoughts on software engineering, product design, and the digital world."
        />
      </AnimatedSection>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(0, 3).map((post, i) => (
          <AnimatedSection key={post.id} delay={i * 0.1}>
            <GlassCard className="h-full flex flex-col p-0 overflow-hidden">
              {/* Cover */}
              {post.coverImageUrl && (
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                </div>
              )}

              <div className="p-5 flex flex-col flex-1">
                {/* Tags */}
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
                  <h3 className="text-base font-semibold text-primary mb-2 hover:text-purple-300 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-sm text-secondary line-clamp-2 mb-4 flex-1">{post.summary}</p>

                <div className="flex items-center gap-4 text-xs text-muted pt-3 border-t border-default">
                  {post.publishedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {formatDate(post.publishedAt)}
                    </span>
                  )}
                  {post.readTime && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {post.readTime} min read
                    </span>
                  )}
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>
        ))}
      </div>

      {posts.length > 3 && (
        <AnimatedSection className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 glass px-6 py-3 rounded-xl text-secondary text-sm font-medium hover:border-purple-500/30 hover:text-primary transition-all"
          >
            View all articles <ArrowRight size={16} />
          </Link>
        </AnimatedSection>
      )}
    </section>
  );
}
