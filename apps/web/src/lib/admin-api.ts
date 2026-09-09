/**
 * Centralized Admin API Service
 * Handles all admin API calls with JWT token injection and error handling
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface ApiOptions extends RequestInit {
  skipAuth?: boolean;
}

class AdminApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'AdminApiError';
  }
}

/**
 * Single-flight access-token refresh.
 *
 * `authApi.refresh()` existed and the backend correctly rotates the refresh
 * token on every call (the old one is invalidated server-side the moment a
 * new one is issued) — but nothing ever called it. The access token expires
 * after 15 minutes, so any authenticated request made after that point simply
 * failed with no retry, which reads exactly like "content fetching failed"
 * while login itself (a fresh token) kept working.
 *
 * Because the refresh token is single-use, multiple concurrent 401s (e.g. the
 * dashboard's five parallel requests) must share ONE refresh call rather than
 * each firing its own — a second concurrent refresh would be rejected by the
 * backend since the first one already rotated the stored token. This module-
 * level promise is what serializes that.
 */
let refreshInFlight: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (refreshInFlight) return refreshInFlight;

  const refreshToken = sessionStorage.getItem('refresh_token');
  if (!refreshToken) {
    throw new AdminApiError('No refresh token available. Please login.', 401);
  }

  refreshInFlight = (async () => {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new AdminApiError('Session expired. Please login again.', response.status);
    }

    const data: { accessToken: string; refreshToken?: string } = await response.json();
    sessionStorage.setItem('access_token', data.accessToken);
    // The backend issues a new refresh token on every refresh and invalidates
    // the old one — it must be persisted or the *next* refresh fails.
    if (data.refreshToken) {
      sessionStorage.setItem('refresh_token', data.refreshToken);
    }
    return data.accessToken;
  })();

  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

/** Clears the session and sends the user back to login after an unrecoverable 401. */
function forceReauth(): void {
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('refresh_token');
  if (typeof window !== 'undefined' && !window.location.pathname.endsWith('/admin/login')) {
    window.location.href = '/admin/login';
  }
}

/**
 * Base fetch wrapper with authentication and error handling.
 *
 * `isRetry` is internal-only: it marks the single retry made after a
 * successful token refresh, so a request that still 401s post-refresh fails
 * cleanly instead of looping.
 */
async function apiFetch<T>(
  endpoint: string,
  options: ApiOptions = {},
  isRetry = false,
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string>),
  };

  // Add authorization header if not skipped
  if (!skipAuth) {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
      throw new AdminApiError('No access token found. Please login.', 401);
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add content-type for JSON requests
  if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      // Transparently refresh and retry once on an expired access token.
      // Login/refresh calls themselves pass skipAuth and never reach here.
      if (response.status === 401 && !skipAuth && !isRetry) {
        try {
          await refreshAccessToken();
          return await apiFetch<T>(endpoint, options, true);
        } catch {
          forceReauth();
          throw new AdminApiError('Session expired. Please login again.', 401);
        }
      }

      const errorData = await response.json().catch(() => ({}));
      throw new AdminApiError(
        errorData.message || `API request failed: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof AdminApiError) {
      throw error;
    }
    throw new AdminApiError(
      error instanceof Error ? error.message : 'Network error occurred'
    );
  }
}

// ==================== Authentication ====================

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<{ accessToken: string; refreshToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    }),

  refresh: (refreshToken: string) =>
    apiFetch<{ accessToken: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
      skipAuth: true,
    }),
};

// ==================== Profile ====================

export interface Profile {
  id: string;
  name: string;
  shortName?: string;
  title: string;
  bio: string;
  headline: string;
  email: string;
  alternateEmail?: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  websiteUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  whatsappUrl?: string;
  currentCompany?: string;
  currentRole?: string;
  alumniOf?: string;
  socialLinks?: Record<string, string> | string;
  createdAt: string;
  updatedAt: string;
}

export const profileApi = {
  get: () => apiFetch<Profile>('/admin/profile'),
  update: (data: Partial<Profile>) =>
    apiFetch<Profile>('/admin/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// ==================== Projects ====================

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content?: string;
  coverImageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  role?: string;
  clientName?: string;
  duration?: string;
  status?: string;
  industry?: string;
  challenge?: string;
  approach?: string;
  outcome?: string;
  metrics?: string;
  stackSummary?: string;
  gallery?: string[] | string;
  relatedServiceSlugs?: string[] | string;
  featured: boolean;
  order: number;
  isPublished: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
  techStacks?: any[];
  tags?: any[];
}

export const projectsApi = {
  getAll: () => apiFetch<Project[]>('/admin/projects'),
  getById: (id: string) => apiFetch<Project>(`/admin/projects/${id}`),
  create: (data: Partial<Project>) =>
    apiFetch<Project>('/admin/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Project>) =>
    apiFetch<Project>(`/admin/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/admin/projects/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== Skills ====================

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const skillsApi = {
  getAll: () => apiFetch<Skill[]>('/admin/skills'),
  create: (data: Partial<Skill>) =>
    apiFetch<Skill>('/admin/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Skill>) =>
    apiFetch<Skill>(`/admin/skills/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/admin/skills/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== Experience ====================

export interface Experience {
  id: string;
  company: string;
  position: string;
  type: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const experienceApi = {
  getAll: () => apiFetch<Experience[]>('/admin/experience'),
  create: (data: Partial<Experience>) =>
    apiFetch<Experience>('/admin/experience', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Experience>) =>
    apiFetch<Experience>(`/admin/experience/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/admin/experience/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== Education ====================

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const educationApi = {
  getAll: () => apiFetch<Education[]>('/admin/education'),
  create: (data: Partial<Education>) =>
    apiFetch<Education>('/admin/education', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Education>) =>
    apiFetch<Education>(`/admin/education/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/admin/education/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== Services ====================

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const servicesApi = {
  getAll: () => apiFetch<Service[]>('/admin/services'),
  create: (data: Partial<Service>) =>
    apiFetch<Service>('/admin/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Service>) =>
    apiFetch<Service>(`/admin/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/admin/services/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== Blog ====================

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  category?: string;
  series?: string;
  canonicalUrl?: string;
  featured?: boolean;
  order?: number;
  isPublished: boolean;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
  tags?: any[];
}

export const blogApi = {
  getAll: () => apiFetch<BlogPost[]>('/admin/blog'),
  getById: (id: string) => apiFetch<BlogPost>(`/admin/blog/${id}`),
  create: (data: Partial<BlogPost>) =>
    apiFetch<BlogPost>('/admin/blog', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<BlogPost>) =>
    apiFetch<BlogPost>(`/admin/blog/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/admin/blog/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== Testimonials ====================

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  avatarUrl?: string;
  rating: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const testimonialsApi = {
  getAll: () => apiFetch<Testimonial[]>('/admin/testimonials'),
  create: (data: Partial<Testimonial>) =>
    apiFetch<Testimonial>('/admin/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Testimonial>) =>
    apiFetch<Testimonial>(`/admin/testimonials/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/admin/testimonials/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== Tech Stack ====================

export interface TechStack {
  id: string;
  name: string;
  category: string;
  iconUrl?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const techStackApi = {
  getAll: () => apiFetch<TechStack[]>('/admin/tech-stack'),
  create: (data: Partial<TechStack>) =>
    apiFetch<TechStack>('/admin/tech-stack', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<TechStack>) =>
    apiFetch<TechStack>(`/admin/tech-stack/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/admin/tech-stack/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== Awards ====================

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const awardsApi = {
  getAll: () => apiFetch<Award[]>('/admin/awards'),
  create: (data: Partial<Award>) =>
    apiFetch<Award>('/admin/awards', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Award>) =>
    apiFetch<Award>(`/admin/awards/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/admin/awards/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== Upload ====================

/**
 * Destinations the upload endpoint understands. Previously the API accepted
 * only `profile` and `project`, which left every other media column in the
 * schema — resume, gallery, logos, icons, blog covers — with no way to be
 * populated from the admin panel at all.
 */
export type UploadTarget =
  | 'profile_avatar'
  | 'profile_resume'
  | 'project_cover'
  | 'project_gallery'
  | 'blog_cover'
  | 'award_icon'
  | 'skill_icon'
  | 'techstack_icon'
  | 'experience_logo'
  | 'education_logo'
  | 'testimonial_avatar'
  | 'unattached_image'
  | 'unattached_document';

export const uploadApi = {
  /**
   * @param entityId omit for the `unattached_*` targets, which return a URL
   *   without writing to the database — needed when a file is chosen before
   *   the owning record has been created.
   */
  upload: async (
    file: File,
    target: UploadTarget,
    entityId?: string,
  ): Promise<{ url: string; publicId: string }> => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
      throw new AdminApiError('No access token found. Please login.', 401);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('target', target);
    if (entityId) formData.append('entityId', entityId);

    const response = await fetch(`${API_URL}/admin/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AdminApiError(
        errorData.message || 'Upload failed',
        response.status,
        errorData,
      );
    }

    return await response.json();
  },
};

// Export the error class for custom error handling
export { AdminApiError };
