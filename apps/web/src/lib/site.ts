import type { Education, Experience, Profile, SocialLinks, Award } from './types';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://amalanilkumar.com';
export const SITE_DOMAIN = 'amalanilkumar.com';
export const CANONICAL_NAME = 'Amal Anilkumar';
export const CANONICAL_SHORT_NAME = 'Amal A';
export const DEFAULT_TITLE = 'Full-Stack and AI Product Engineer';
export const DEFAULT_LOCATION = 'Kerala, India';
export const DEFAULT_BIO =
  'Full-stack software engineer building production-ready web products, internal tools, AI integrations, and scalable backend systems.';

export const DEFAULT_SOCIALS: SocialLinks = {
  website: SITE_URL,
  github: 'https://github.com/Amalanilkumar282',
  linkedin: 'https://www.linkedin.com/in/amal-a-99360b31b/',
  twitter: 'https://x.com/amal_anilkumar_',
  instagram: 'https://www.instagram.com/amal_anilkumar._',
  whatsapp: 'https://wa.me/917594919014',
};

type SocialInput = Profile['socialLinks'];

/**
 * Resolves the social links for a profile.
 *
 * Precedence is: the Profile table's own columns, then the `socialLinks` JSON
 * blob, then the baked-in defaults.
 *
 * The columns come first because they were previously never read at all — the
 * old implementation looked only inside the JSON blob (and even hunted for a
 * stray `GitFork` key), which left Profile.githubUrl, linkedinUrl, twitterUrl,
 * instagramUrl, whatsappUrl and websiteUrl as write-only dead storage: editing
 * them in the admin panel had no visible effect anywhere on the site.
 *
 * The defaults are retained deliberately. Every public page emits these URLs
 * into the Person schema's `sameAs`, and an entity's `sameAs` set is a
 * stable identity signal — dropping profiles that Google has already
 * reconciled would be an SEO regression, not a cleanup. A DB value always
 * wins, so anything here can be corrected from the admin panel.
 */
export function parseSocialLinks(
  input?: SocialInput,
  profile?: Profile | null,
): SocialLinks {
  const raw =
    typeof input === 'string'
      ? safeJsonParse<Record<string, string>>(input)
      : input && typeof input === 'object'
        ? (input as Record<string, string>)
        : {};
  const socials = raw ?? {};

  /** First non-empty candidate, ignoring whitespace-only admin entries. */
  const pick = (...candidates: (string | undefined)[]): string | undefined =>
    candidates.find((value) => typeof value === 'string' && value.trim().length > 0)?.trim();

  return {
    website: pick(profile?.websiteUrl, socials.website, socials.site, DEFAULT_SOCIALS.website),
    github: pick(
      profile?.githubUrl,
      socials.github,
      socials.githubUrl,
      DEFAULT_SOCIALS.github,
    ),
    linkedin: pick(
      profile?.linkedinUrl,
      socials.linkedin,
      socials.linkedinUrl,
      DEFAULT_SOCIALS.linkedin,
    ),
    twitter: pick(
      profile?.twitterUrl,
      socials.twitter,
      socials.twitterUrl,
      socials.x,
      DEFAULT_SOCIALS.twitter,
    ),
    instagram: pick(
      profile?.instagramUrl,
      socials.instagram,
      socials.instagramUrl,
      DEFAULT_SOCIALS.instagram,
    ),
    whatsapp: pick(
      profile?.whatsappUrl,
      socials.whatsapp,
      socials.whatsappUrl,
      DEFAULT_SOCIALS.whatsapp,
    ),
  };
}

function safeJsonParse<T>(value: string): T | undefined {
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
}

export function getProfileName(profile: Profile | null | undefined): string {
  return profile?.name?.trim() || CANONICAL_NAME;
}

export function getProfileTitle(profile: Profile | null | undefined): string {
  return profile?.title?.trim() || profile?.currentRole?.trim() || DEFAULT_TITLE;
}

export function getProfileBio(profile: Profile | null | undefined): string {
  return profile?.bio?.trim() || DEFAULT_BIO;
}

export function getProfileLocation(profile: Profile | null | undefined): string {
  return profile?.location?.trim() || DEFAULT_LOCATION;
}

export function getProfileSameAs(profile: Profile | null | undefined): string[] {
  const socials = parseSocialLinks(profile?.socialLinks, profile);

  return [
    socials.website,
    socials.github,
    socials.linkedin,
    socials.twitter,
    socials.instagram,
  ].filter((value): value is string => Boolean(value));
}

export function getCurrentCompany(experience: Experience[]): string | undefined {
  return experience.find((item) => item.isPresent)?.company ?? experience[0]?.company;
}

export function getAlumniName(education: Education[]): string | undefined {
  return education[0]?.institution;
}

export function getAwardNames(awards: Award[]): string[] {
  return awards.map((award) => award.title);
}

export function toAbsoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

// ─── SEO title helpers ─────────────────────────────────
//
// DB-authored `seoTitle` values already carry a brand suffix (e.g.
// "EasyML — No-Code ML Platform | Amal A"), and the root layout's metadata
// template appends the brand again. That produced double-branded titles of
// 70-80 characters that Google truncates ("... | Amal A | Amal Anilkumar").
// These helpers normalise on a single brand — CANONICAL_NAME — and drop the
// suffix entirely when the page title is already long enough to fill the SERP.

/** Roughly the width Google renders before truncating a title. */
const TITLE_BUDGET = 60;
const BRAND_SUFFIX = ` | ${CANONICAL_NAME}`;

/** Brand variants that may already be baked into DB-authored titles. */
const BRAND_VARIANTS = [CANONICAL_NAME, CANONICAL_SHORT_NAME, SITE_DOMAIN];

/**
 * Removes any trailing " | Brand" / " - Brand" / " — Brand" segments from a
 * title so the brand is applied exactly once, by us.
 */
const TITLE_SEPARATORS = ['|', '—', '–', '-'];

export function stripBrandSuffix(title: string): string {
  let result = title.trim();
  let changed = true;

  // Loop so "Title | Amal A | Amal Anilkumar" collapses all the way down.
  while (changed) {
    changed = false;

    for (const separator of TITLE_SEPARATORS) {
      const index = result.lastIndexOf(separator);
      // index <= 0 means there is no separator, or the title *starts* with one
      // — in either case there is no brand tail to strip.
      if (index <= 0) continue;

      const tail = result.slice(index + separator.length).trim();
      const isBrand = BRAND_VARIANTS.some(
        (brand) => brand.toLowerCase() === tail.toLowerCase(),
      );

      if (isBrand) {
        result = result.slice(0, index).trim();
        changed = true;
      }
    }
  }

  return result || title.trim();
}

/**
 * Builds a page <title> as a Next.js `absolute` value: the brand is appended
 * only when it fits inside the SERP budget, so long post/project titles are
 * shown in full instead of being cut off mid-brand.
 */
export function buildPageTitle(rawTitle: string): string {
  const clean = stripBrandSuffix(rawTitle);
  return clean.length + BRAND_SUFFIX.length <= TITLE_BUDGET ? `${clean}${BRAND_SUFFIX}` : clean;
}
