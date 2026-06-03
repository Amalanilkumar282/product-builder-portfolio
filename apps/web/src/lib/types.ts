export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export type ExperienceType = 'WORK' | 'INTERNSHIP' | 'FREELANCE' | 'LEADERSHIP';

export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  headline?: string;
  email: string;
  alternateEmail?: string;
  location?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  socialLinks?: string; // JSON string: { github, linkedin, twitter, website }
  isPublished: boolean;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  [key: string]: string | undefined;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  iconUrl?: string;
  order: number;
  isPublished: boolean;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate?: string;
  isPresent: boolean;
  logoUrl?: string;
  experienceType: ExperienceType;
  order: number;
  isPublished: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  logoUrl?: string;
  order: number;
  isPublished: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatarUrl?: string;
  order: number;
  isPublished: boolean;
}

export interface TechStack {
  id: string;
  name: string;
  category: string;
  iconUrl?: string;
  url?: string;
  order: number;
  isPublished: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImageUrl?: string;
  readTime?: number;
  isPublished: boolean;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}

export interface PageSection {
  id: string;
  type: string;
  label: string;
  isEnabled: boolean;
  order: number;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  description?: string;
  year: number;
  iconUrl?: string;
  url?: string;
  order: number;
  isPublished: boolean;
}
