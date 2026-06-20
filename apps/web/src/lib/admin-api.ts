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
 * Base fetch wrapper with authentication and error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options: ApiOptions = {}
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
  firstName: string;
  lastName: string;
  title: string;
  bio: string;
  email: string;
  alternateEmail?: string;
  phone?: string;
  location: string;
  avatarUrl?: string;
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
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
  description: string;
  coverImageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  published: boolean;
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
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  published: boolean;
  publishedAt?: string;
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

export const uploadApi = {
  upload: async (
    file: File,
    entityType: string,
    entityId: string
  ): Promise<{ url: string }> => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
      throw new AdminApiError('No access token found. Please login.', 401);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('entityType', entityType);
    formData.append('entityId', entityId);

    const response = await fetch(`${API_URL}/admin/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AdminApiError(
        errorData.message || 'Upload failed',
        response.status,
        errorData
      );
    }

    return await response.json();
  },
};

// Export the error class for custom error handling
export { AdminApiError };
