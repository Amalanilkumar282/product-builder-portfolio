import type { Metadata } from 'next';
import { fetchBlogPosts } from '@/lib/api';
import BlogSection from '@/components/sections/BlogSection';
import Section from '@/components/ui/Section';
import { JsonLd, buildCollectionPageSchema } from '@/lib/entity-jsonld';

export const metadata: Metadata = {
  title: { absolute: 'Engineering Blog | Amal Anilkumar' },
  description:
    'Practical write-ups on full-stack engineering, AI integration, and product design by Amal Anilkumar — how real Next.js, NestJS, and TypeScript systems get built and shipped.',
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    url: '/blog',
    title: 'Engineering Blog | Amal Anilkumar',
    description:
      'Practical write-ups on full-stack engineering, AI integration, and product design — how real Next.js and NestJS systems get built.',
  },
};

export default async function BlogPage() {
  const posts = await fetchBlogPosts();

  return (
    <>
      <JsonLd
        data={buildCollectionPageSchema({
          path: '/blog',
          title: 'Blog',
          description:
            'Technical articles, engineering notes, product lessons, and architecture write-ups by Amal Anilkumar.',
        })}
      />
      <Section
        id="writing"
        label="Writing"
        meta={`${posts.length} ${posts.length === 1 ? 'post' : 'posts'}`}
        title="Writing"
        as="h1"
        intro="Notes on how things actually got built."
        className="pt-[calc(var(--header-h)+3rem)]"
        wide
      >
        <BlogSection posts={posts} />
      </Section>
    </>
  );
}
