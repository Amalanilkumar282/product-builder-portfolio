import type {
  Profile,
  Service,
  Project,
  Skill,
  Experience,
  Education,
  Testimonial,
  TechStack,
  BlogPost,
  PageSection,
  ContactPayload,
  Award,
  Certification,
  Talk,
  Tag,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// The old 5s budget was shorter than a cold start on the API host, so a single
// slow response silently produced an empty page. Every public page is a Server
// Component rendered from these calls, so an empty result is not a degraded
// page — it is a page with no indexable content at all.
const FETCH_TIMEOUT_MS = 15_000;

/** True while `next build` is prerendering pages, false at request time. */
function isBuildTimeRender(): boolean {
  return process.env.NEXT_PHASE === 'phase-production-build';
}

async function safeFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    return (await res.json()) as T;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);

    // Failing loudly at build time is deliberate. Swallowing the error here
    // would prerender pages with no content and bake that empty HTML into the
    // deployment, where crawlers index it as a thin or empty page — a failed
    // build is far cheaper to recover from than a deindexed site.
    if (isBuildTimeRender()) {
      throw new Error(
        `Content fetch failed during build: ${url} (${reason}). ` +
          'Refusing to prerender a page with no content — check that the API is ' +
          'reachable and NEXT_PUBLIC_API_URL is set for this environment.',
      );
    }

    // At request time (including ISR revalidation) degrade gracefully: Next.js
    // keeps serving the last good render rather than erroring the page.
    console.error(`[api] fetch failed: ${url} (${reason})`);
    return null;
  }
}

// ─── Profile ───────────────────────────────────────────
export function fetchProfile(): Promise<Profile | null> {
  return safeFetch<Profile>(`${API_URL}/profile`, { next: { revalidate: 120, tags: ['profile'] } });
}

// ─── Services ──────────────────────────────────────────
export async function fetchServices(): Promise<Service[]> {
  return (await safeFetch<Service[]>(`${API_URL}/services`, { next: { revalidate: 60, tags: ['service'] } })) ?? [];
}

export function fetchService(slug: string): Promise<Service | null> {
  return safeFetch<Service>(`${API_URL}/services/${slug}`, { next: { revalidate: 60, tags: ['service'] } });
}

// ─── Projects ──────────────────────────────────────────
export async function fetchProjects(): Promise<Project[]> {
  return (await safeFetch<Project[]>(`${API_URL}/projects`, { next: { revalidate: 60, tags: ['project'] } })) ?? [];
}

export function fetchProject(slug: string): Promise<Project | null> {
  return safeFetch<Project>(`${API_URL}/projects/${slug}`, { next: { revalidate: 60, tags: ['project'] } });
}

// ─── Skills ────────────────────────────────────────────
export async function fetchSkills(): Promise<Skill[]> {
  return (await safeFetch<Skill[]>(`${API_URL}/skills`, { next: { revalidate: 120, tags: ['skill'] } })) ?? [];
}

// ─── Experience ────────────────────────────────────────
export async function fetchExperience(): Promise<Experience[]> {
  return (await safeFetch<Experience[]>(`${API_URL}/experience`, { next: { revalidate: 120, tags: ['experience'] } })) ?? [];
}

// ─── Education ─────────────────────────────────────────
export async function fetchEducation(): Promise<Education[]> {
  return (await safeFetch<Education[]>(`${API_URL}/education`, { next: { revalidate: 120, tags: ['education'] } })) ?? [];
}

// ─── Testimonials ──────────────────────────────────────
export async function fetchTestimonials(): Promise<Testimonial[]> {
  return (await safeFetch<Testimonial[]>(`${API_URL}/testimonials`, { next: { revalidate: 120, tags: ['testimonial'] } })) ?? [];
}

// ─── Tech Stack ────────────────────────────────────────
export async function fetchTechStack(): Promise<TechStack[]> {
  return (await safeFetch<TechStack[]>(`${API_URL}/tech-stack`, { next: { revalidate: 120, tags: ['tech-stack'] } })) ?? [];
}

// ─── Blog ──────────────────────────────────────────────
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  return (await safeFetch<BlogPost[]>(`${API_URL}/blog`, { next: { revalidate: 60, tags: ['blog'] } })) ?? [];
}

export function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  return safeFetch<BlogPost>(`${API_URL}/blog/${slug}`, { next: { revalidate: 60, tags: ['blog'] } });
}

// ─── Contact ───────────────────────────────────────────
export async function submitContact(data: ContactPayload): Promise<void> {
  const res = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? 'Failed to send message');
  }
}

// ─── Page Sections ─────────────────────────────────────
export async function fetchPageSections(): Promise<PageSection[]> {
  return (await safeFetch<PageSection[]>(`${API_URL}/page-sections`, { next: { revalidate: 60, tags: ['page-section'] } })) ?? [];
}

// ─── Awards ────────────────────────────────────────────
export async function fetchAwards(): Promise<Award[]> {
  return (await safeFetch<Award[]>(`${API_URL}/awards`, { next: { revalidate: 120, tags: ['award'] } })) ?? [];
}

// ─── Search ────────────────────────────────────────────
export function searchContent(query: string) {
  return safeFetch<{ projects: Project[]; services: Service[]; blogPosts: BlogPost[] }>(
    `${API_URL}/search?q=${encodeURIComponent(query)}`,
  );
}




// ─── Certifications ────────────────────────────────────
/**
 * `GET /certifications` was fully implemented on the API and had no frontend
 * fetch function at all, so the public certifications page string-matched the
 * Education table instead.
 */
export async function fetchCertifications(): Promise<Certification[]> {
  return (
    (await safeFetch<Certification[]>(`${API_URL}/certifications`, {
      next: { revalidate: 120, tags: ['certification'] },
    })) ?? []
  );
}

// ─── Talks ─────────────────────────────────────────────
export async function fetchTalks(): Promise<Talk[]> {
  return (
    (await safeFetch<Talk[]>(`${API_URL}/talks`, {
      next: { revalidate: 120, tags: ['talk'] },
    })) ?? []
  );
}

// ─── Tags ──────────────────────────────────────────────
/** The full tag vocabulary — the primitive a topic index needs. */
export async function fetchTags(): Promise<Tag[]> {
  return (await safeFetch<Tag[]>(`${API_URL}/tags`, { next: { revalidate: 300 } })) ?? [];
}
