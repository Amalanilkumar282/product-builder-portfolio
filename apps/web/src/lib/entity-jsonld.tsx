import type { Award, BlogPost, Education, Experience, Profile, Project } from './types';
import {
  CANONICAL_NAME,
  DEFAULT_BIO,
  SITE_URL,
  getAlumniName,
  getAwardNames,
  getCurrentCompany,
  getProfileBio,
  getProfileName,
  getProfileSameAs,
  getProfileTitle,
  toAbsoluteUrl,
} from './site';

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function personId() {
  return `${SITE_URL}/#person`;
}

function websiteId() {
  return `${SITE_URL}/#website`;
}

export function buildPersonSchema(opts?: {
  profile?: Profile | null;
  experience?: Experience[];
  education?: Education[];
  awards?: Award[];
}) {
  const profile = opts?.profile ?? null;
  const experience = opts?.experience ?? [];
  const education = opts?.education ?? [];
  const awards = opts?.awards ?? [];

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId(),
    name: getProfileName(profile),
    alternateName: profile?.shortName ?? 'Amal A',
    jobTitle: getProfileTitle(profile),
    description: getProfileBio(profile),
    email: profile?.email,
    image: profile?.avatarUrl,
    url: SITE_URL,
    sameAs: getProfileSameAs(profile),
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile?.location ?? 'Kerala, India',
      addressCountry: 'India',
    },
    alumniOf: (profile?.alumniOf || getAlumniName(education))
      ? {
          '@type': 'CollegeOrUniversity',
          name: profile?.alumniOf || getAlumniName(education),
        }
      : undefined,
    worksFor: (profile?.currentCompany || getCurrentCompany(experience))
      ? {
          '@type': 'Organization',
          name: profile?.currentCompany || getCurrentCompany(experience),
        }
      : undefined,
    award: getAwardNames(awards),
    knowsAbout: [
      'Full-stack development',
      'Next.js',
      'NestJS',
      'TypeScript',
      'PostgreSQL',
      'Product engineering',
      'Admin panel development',
      'AI integrations',
      'Technical SEO',
    ],
    contactPoint: profile?.email
      ? [
          {
            '@type': 'ContactPoint',
            contactType: 'sales',
            email: profile.email,
            areaServed: 'Worldwide',
            availableLanguage: ['English'],
          },
        ]
      : undefined,
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId(),
    name: `${CANONICAL_NAME} Portfolio`,
    alternateName: 'Amal A Portfolio',
    url: SITE_URL,
    description: DEFAULT_BIO,
    publisher: { '@id': personId() },
    inLanguage: 'en-US',
  };
}

export function buildProfilePageSchema(opts: {
  path: string;
  title: string;
  description?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': toAbsoluteUrl(opts.path),
    url: toAbsoluteUrl(opts.path),
    name: opts.title,
    description: opts.description ?? DEFAULT_BIO,
    isPartOf: { '@id': websiteId() },
    about: { '@id': personId() },
    mainEntity: { '@id': personId() },
  };
}

export function buildCollectionPageSchema(opts: {
  path: string;
  title: string;
  description: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': toAbsoluteUrl(opts.path),
    url: toAbsoluteUrl(opts.path),
    name: opts.title,
    description: opts.description,
    isPartOf: { '@id': websiteId() },
    about: { '@id': personId() },
  };
}

export function buildServiceSchema(service: {
  title: string;
  slug: string;
  description: string;
  tags: { name: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/services/${service.slug}`,
    name: service.title,
    description: service.description,
    url: `${SITE_URL}/services/${service.slug}`,
    provider: { '@id': personId() },
    areaServed: 'Worldwide',
    knowsAbout: service.tags.map((tag) => tag.name),
  };
}

export function buildFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function buildProjectSchema(project: Project) {
  return {
    '@context': 'https://schema.org',
    '@type': ['SoftwareApplication', 'CreativeWork'],
    '@id': `${SITE_URL}/projects/${project.slug}`,
    name: project.title,
    description: project.seoDescription ?? project.summary,
    url: project.demoUrl ?? `${SITE_URL}/projects/${project.slug}`,
    codeRepository: project.githubUrl,
    applicationCategory: 'WebApplication',
    image: project.coverImageUrl,
    keywords: project.tags.map((tag) => tag.name).join(', '),
    dateModified: project.updatedAt,
    creator: { '@id': personId() },
    author: { '@id': personId() },
    producer: { '@id': personId() },
    about: [project.industry, project.stackSummary].filter(Boolean),
  };
}

export function buildProjectListSchema(projects: { title: string; slug: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${CANONICAL_NAME} Projects`,
    url: `${SITE_URL}/projects`,
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: project.title,
      url: `${SITE_URL}/projects/${project.slug}`,
    })),
  };
}

export function buildBlogPostSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${SITE_URL}/blog/${post.slug}`,
    headline: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.summary,
    image: post.coverImageUrl,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    timeRequired: post.readTime ? `PT${post.readTime}M` : undefined,
    articleSection: post.category,
    keywords: post.tags.map((tag) => tag.name).join(', '),
    url: post.canonicalUrl ?? `${SITE_URL}/blog/${post.slug}`,
    inLanguage: 'en-US',
    author: { '@id': personId() },
    publisher: { '@id': personId() },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
  };
}

export function buildBreadcrumbSchema(crumbs: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

export function buildContactPageSchema(profile?: Profile | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${SITE_URL}/contact`,
    name: `Contact ${getProfileName(profile)}`,
    url: `${SITE_URL}/contact`,
    description: `Contact ${getProfileName(profile)} for full-stack product development, technical consulting, and AI integration work.`,
    mainEntity: { '@id': personId() },
  };
}

export function buildOpenSourceCollectionSchema(projects: Project[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/open-source`,
    url: `${SITE_URL}/open-source`,
    name: `${CANONICAL_NAME} Open Source Work`,
    description: 'Open-source projects, public code repositories, and technical build notes by Amal Anilkumar.',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: projects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/projects/${project.slug}`,
        name: project.title,
      })),
    },
  };
}

export function buildOrganizationReference() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#brand`,
    name: CANONICAL_NAME,
    url: SITE_URL,
    founder: { '@id': personId() },
    description: DEFAULT_BIO,
  };
}
