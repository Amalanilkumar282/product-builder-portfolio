/**
 * Best-effort SEO push-indexing notifications.
 *
 * Called (fire-and-forget) after a blog post / project / service is
 * created, updated, published, or deleted so search engines discover the
 * change immediately instead of waiting for their next crawl:
 *  1. Triggers on-demand ISR revalidation on the Next.js frontend.
 *  2. Pings IndexNow (Bing / Copilot / Yandex) with the changed URL.
 *  3. Pings the Google Indexing API (unofficial for non-job content, but
 *     harmless and commonly used as a "hint" — never blocks the caller).
 *
 * Every step is wrapped so a failure here NEVER breaks the admin
 * create/update/delete flow — errors are only logged.
 */
import { Logger } from '@nestjs/common';
import { createSign } from 'crypto';

const logger = new Logger('SeoNotify');

const WEB_URL = process.env.WEB_URL ?? 'https://amalanilkumar.com';
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;
const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_INDEXING_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_INDEXING_PRIVATE_KEY?.replace(/\\n/g, '\n');

/** Content that owns a public URL, so a search engine can be pinged about it. */
export type SeoContentTag = 'blog' | 'project' | 'service';

/**
 * Content that has no URL of its own but still renders on public pages.
 * These previously had no cache tag and no notify call at all, so an admin
 * edit to a skill, award or the profile waited out a 60–300s ISR window with
 * no way to push it live.
 */
export type SiteDataTag =
  | 'profile'
  | 'skill'
  | 'experience'
  | 'education'
  | 'testimonial'
  | 'tech-stack'
  | 'award'
  | 'certification'
  | 'talk'
  | 'page-section';

export type RevalidateTag = SeoContentTag | SiteDataTag;

/** Public pages each tag appears on, beyond the homepage. */
const SITE_DATA_PATHS: Record<RevalidateTag, string[]> = {
  // The three URL-owning types are listed too, because a media upload can
  // change one of them without the caller knowing the affected slug.
  blog: ['/', '/blog'],
  project: ['/', '/projects'],
  service: ['/', '/services'],
  profile: ['/', '/about', '/contact'],
  skill: ['/', '/about'],
  experience: ['/', '/experience', '/about'],
  education: ['/', '/about', '/certifications'],
  testimonial: ['/'],
  'tech-stack': ['/', '/about'],
  award: ['/', '/achievements'],
  certification: ['/certifications'],
  talk: ['/about'],
  'page-section': ['/'],
};

/**
 * Notify all indexing channels that a piece of content changed.
 * @param tag content type — matches the Next.js cache tag
 * @param path relative site path, e.g. "/blog/my-post"
 */
export function notifySeoIndexing(tag: SeoContentTag, path: string): void {
  const url = `${WEB_URL}${path}`;

  void revalidateWeb(tag, [path, `/${tag}`, '/']).catch((err) =>
    logger.warn(`Revalidate webhook failed for ${url}: ${err.message}`),
  );
  void pingIndexNow(url).catch((err) => logger.warn(`IndexNow ping failed for ${url}: ${err.message}`));
  void pingGoogleIndexing(url).catch((err) =>
    logger.warn(`Google Indexing API ping failed for ${url}: ${err.message}`),
  );
}

/**
 * Push a cache purge for content that has no URL of its own.
 *
 * Deliberately does NOT ping IndexNow or the Google Indexing API: nothing new
 * became crawlable, so submitting the homepage on every skill edit would be
 * noise at best and rate-limit pressure at worst.
 */
export function notifySiteDataChange(tag: RevalidateTag): void {
  const paths = SITE_DATA_PATHS[tag] ?? ['/'];

  void revalidateWeb(tag, paths).catch((err) =>
    logger.warn(`Revalidate webhook failed for tag ${tag}: ${err.message}`),
  );
}

async function revalidateWeb(tag: RevalidateTag, paths: string[]): Promise<void> {
  if (!REVALIDATE_SECRET) return;

  const res = await fetch(`${WEB_URL}/api/revalidate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${REVALIDATE_SECRET}`,
    },
    body: JSON.stringify({ tag, paths }),
  });

  if (!res.ok) throw new Error(`revalidate endpoint returned ${res.status}`);
}

async function pingIndexNow(url: string): Promise<void> {
  if (!INDEXNOW_KEY) return;

  const host = new URL(WEB_URL).hostname;
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host,
      key: INDEXNOW_KEY,
      keyLocation: `${WEB_URL}/${INDEXNOW_KEY}.txt`,
      urlList: [url],
    }),
  });

  if (!res.ok && res.status !== 202) throw new Error(`IndexNow returned ${res.status}`);
}

async function getGoogleAccessToken(): Promise<string | null> {
  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) return null;

  const nowSec = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claims = {
    iss: GOOGLE_CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    iat: nowSec,
    exp: nowSec + 3600,
  };

  const base64url = (obj: object) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const unsigned = `${base64url(header)}.${base64url(claims)}`;
  const signature = createSign('RSA-SHA256').update(unsigned).sign(GOOGLE_PRIVATE_KEY, 'base64url');
  const jwt = `${unsigned}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!res.ok) throw new Error(`Google OAuth token exchange returned ${res.status}`);
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

async function pingGoogleIndexing(url: string): Promise<void> {
  const accessToken = await getGoogleAccessToken();
  if (!accessToken) return;

  const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ url, type: 'URL_UPDATED' }),
  });

  if (!res.ok) throw new Error(`Google Indexing API returned ${res.status}`);
}
