/**
 * JSON-LD structured data builder utilities.
 * Call each builder in a server component and inject via <JsonLd> script.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001';
const OWNER_NAME = 'Amal Anilkumar';

// ─── Generic script injector ──────────────────────────────────────────────────
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is safe, server-rendered, no user input
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── Person schema (used on home + about) ─────────────────────────────────────
export function buildPersonSchema(opts?: {
  name?: string;
  title?: string;
  bio?: string;
  email?: string;
  avatarUrl?: string;
  sameAs?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: opts?.name ?? OWNER_NAME,
    jobTitle: opts?.title ?? 'Software Engineer',
    description: opts?.bio,
    email: opts?.email,
    image: opts?.avatarUrl,
    url: SITE_URL,
    sameAs: opts?.sameAs ?? [],
    knowsAbout: [
      'Full-Stack Web Development',
      'Next.js',
      'NestJS',
      'TypeScript',
      'PostgreSQL',
      'Scalable Web Architecture',
      'API Design',
    ],
  };
}

// ─── WebSite schema (home page) ───────────────────────────────────────────────
export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: `${OWNER_NAME} — Portfolio`,
    url: SITE_URL,
    description: 'Portfolio of Amal Anilkumar, a full-stack software engineer.',
    author: { '@id': `${SITE_URL}/#person` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// ─── ProfessionalService schema (service detail page) ────────────────────────
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
    provider: { '@id': `${SITE_URL}/#person` },
    serviceType: service.tags.map((t) => t.name),
  };
}

// ─── FAQPage schema (service detail page) ─────────────────────────────────────
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

// ─── SoftwareApplication / CreativeWork (project detail) ─────────────────────
export function buildProjectSchema(project: {
  title: string;
  slug: string;
  summary: string;
  demoUrl?: string;
  githubUrl?: string;
  tags: { name: string }[];
  updatedAt: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': ['SoftwareApplication', 'CreativeWork'],
    '@id': `${SITE_URL}/projects/${project.slug}`,
    name: project.title,
    description: project.summary,
    url: project.demoUrl ?? `${SITE_URL}/projects/${project.slug}`,
    codeRepository: project.githubUrl,
    applicationCategory: 'WebApplication',
    keywords: project.tags.map((t) => t.name).join(', '),
    dateModified: project.updatedAt,
    creator: { '@id': `${SITE_URL}/#person` },
    author: { '@id': `${SITE_URL}/#person` },
  };
}

// ─── ItemList schema (projects listing page) ─────────────────────────────────
export function buildProjectListSchema(projects: { title: string; slug: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${OWNER_NAME}'s Projects`,
    url: `${SITE_URL}/projects`,
    itemListElement: projects.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.title,
      url: `${SITE_URL}/projects/${p.slug}`,
    })),
  };
}

// ─── BlogPosting schema ───────────────────────────────────────────────────────
export function buildBlogPostSchema(post: {
  title: string;
  slug: string;
  summary: string;
  coverImageUrl?: string;
  publishedAt?: string;
  updatedAt: string;
  readTime?: number;
  tags: { name: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${SITE_URL}/blog/${post.slug}`,
    headline: post.title,
    description: post.summary,
    image: post.coverImageUrl,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    timeRequired: post.readTime ? `PT${post.readTime}M` : undefined,
    keywords: post.tags.map((t) => t.name).join(', '),
    url: `${SITE_URL}/blog/${post.slug}`,
    inLanguage: 'en-US',
    author: { '@id': `${SITE_URL}/#person` },
    publisher: { '@id': `${SITE_URL}/#person` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
  };
}

// ─── BreadcrumbList ───────────────────────────────────────────────────────────
export function buildBreadcrumbSchema(
  crumbs: { name: string; url: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

// ─── ContactPage schema ───────────────────────────────────────────────────────
export function buildContactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${SITE_URL}/contact`,
    name: `Contact ${OWNER_NAME}`,
    url: `${SITE_URL}/contact`,
    description: `Get in touch with ${OWNER_NAME} to discuss your project.`,
    mainEntity: { '@id': `${SITE_URL}/#person` },
  };
}
