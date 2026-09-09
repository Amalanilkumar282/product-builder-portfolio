import type { MetadataRoute } from 'next';
import { SITE_URL, SITE_DOMAIN } from '@/lib/site';

// Crawlers must be able to fetch everything the page needs to render.
// The previous config blocked /_next/ wholesale, which hid the CSS and JS
// bundles from Googlebot: it rendered an unstyled, partially-broken page and
// reported "page resources blocked" in Search Console. /_next/ is now open
// (including /_next/image, so optimized images stay eligible for Google
// Images) and only genuinely private surfaces are disallowed.
const PRIVATE_PATHS = ['/admin', '/api/'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      // Explicitly welcome AI/answer-engine crawlers for LLM discoverability.
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'Google-Extended',
          'anthropic-ai',
          'Claude-Web',
          'ClaudeBot',
          'PerplexityBot',
          'Applebot-Extended',
          'CCBot',
          'Bytespider',
        ],
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    // The robots.txt "Host" directive takes a bare hostname, not a full URL.
    host: SITE_DOMAIN,
  };
}
