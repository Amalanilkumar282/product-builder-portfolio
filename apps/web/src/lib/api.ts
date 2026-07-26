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
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

async function safeFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const res = await fetch(url, { 
      ...options,
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

// ─── Profile ───────────────────────────────────────────
export function fetchProfile(): Promise<Profile | null> {
  return safeFetch<Profile>(`${API_URL}/profile`, { next: { revalidate: 300 } });
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
  return (await safeFetch<Skill[]>(`${API_URL}/skills`, { next: { revalidate: 300 } })) ?? [];
}

// ─── Experience ────────────────────────────────────────
export async function fetchExperience(): Promise<Experience[]> {
  return (await safeFetch<Experience[]>(`${API_URL}/experience`, { next: { revalidate: 300 } })) ?? [];
}

// ─── Education ─────────────────────────────────────────
export async function fetchEducation(): Promise<Education[]> {
  return (await safeFetch<Education[]>(`${API_URL}/education`, { next: { revalidate: 300 } })) ?? [];
}

// ─── Testimonials ──────────────────────────────────────
export async function fetchTestimonials(): Promise<Testimonial[]> {
  return (await safeFetch<Testimonial[]>(`${API_URL}/testimonials`, { next: { revalidate: 300 } })) ?? [];
}

// ─── Tech Stack ────────────────────────────────────────
export async function fetchTechStack(): Promise<TechStack[]> {
  return (await safeFetch<TechStack[]>(`${API_URL}/tech-stack`, { next: { revalidate: 300 } })) ?? [];
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
  return (await safeFetch<PageSection[]>(`${API_URL}/page-sections`, { next: { revalidate: 60 } })) ?? [];
}

// ─── Awards ────────────────────────────────────────────
export async function fetchAwards(): Promise<Award[]> {
  return (await safeFetch<Award[]>(`${API_URL}/awards`, { next: { revalidate: 300 } })) ?? [];
}

// ─── Search ────────────────────────────────────────────
export function searchContent(query: string) {
  return safeFetch<{ projects: Project[]; services: Service[]; blogPosts: BlogPost[] }>(
    `${API_URL}/search?q=${encodeURIComponent(query)}`,
  );
}



