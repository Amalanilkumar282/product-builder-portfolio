import { fetchBlogPosts, fetchProfile } from '@/lib/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 hour

function escapeXml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const [posts, profile] = await Promise.all([fetchBlogPosts(), fetchProfile()]);

  const authorName = profile?.name ?? 'Amal Anilkumar';
  const authorEmail = profile?.email ?? '';
  const description =
    profile?.bio ??
    'Thoughts on software engineering, product design, and building scalable web systems.';

  const items = posts
    .filter((p) => p.isPublished)
    .sort((a, b) => {
      const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return db - da;
    })
    .map((post) => {
      const pubDate = post.publishedAt
        ? new Date(post.publishedAt).toUTCString()
        : new Date(post.createdAt).toUTCString();
      const tags = post.tags?.map((t) => `<category>${escapeXml(t.name)}</category>`).join('') ?? '';

      return `
    <item>
      <title>${escapeXml(post.seoTitle ?? post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.seoDescription ?? post.summary)}</description>
      ${post.coverImageUrl ? `<enclosure url="${escapeXml(post.coverImageUrl)}" type="image/jpeg" length="0" />` : ''}
      ${tags}
      ${post.readTime ? `<itunes:duration>${post.readTime}</itunes:duration>` : ''}
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>${escapeXml(authorName)} — Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(description)}</description>
    <language>en-us</language>
    <managingEditor>${escapeXml(authorEmail)} (${escapeXml(authorName)})</managingEditor>
    <webMaster>${escapeXml(authorEmail)} (${escapeXml(authorName)})</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/og?title=${encodeURIComponent(authorName)}&amp;type=blog</url>
      <title>${escapeXml(authorName)}</title>
      <link>${SITE_URL}</link>
    </image>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
