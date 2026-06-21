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
