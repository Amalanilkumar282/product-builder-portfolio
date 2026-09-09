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

export function parseSocialLinks(input?: SocialInput): SocialLinks {
  const raw =
    typeof input === 'string'
      ? safeJsonParse<Record<string, string>>(input)
      : input && typeof input === 'object'
        ? (input as Record<string, string>)
        : {};
  const socials = raw ?? {};

  return {
    website: socials.website ?? socials.site ?? DEFAULT_SOCIALS.website,
    github: socials.github ?? socials.githubUrl ?? socials.GitFork ?? DEFAULT_SOCIALS.github,
    linkedin: socials.linkedin ?? socials.linkedinUrl ?? DEFAULT_SOCIALS.linkedin,
    twitter: socials.twitter ?? socials.twitterUrl ?? socials.x ?? DEFAULT_SOCIALS.twitter,
    instagram: socials.instagram ?? socials.instagramUrl ?? DEFAULT_SOCIALS.instagram,
    whatsapp: socials.whatsapp ?? socials.whatsappUrl ?? DEFAULT_SOCIALS.whatsapp,
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
  const socials = parseSocialLinks(profile?.socialLinks);

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
