/**
 * Upload target registry.
 *
 * The old upload endpoint understood exactly two destinations (a Profile's
 * avatar and a Project's cover) which left every other media-bearing column in
 * the schema — resume, gallery, logos, icons, blog covers — with no way to be
 * populated from the admin panel. Rather than add a branch per column, each
 * destination is declared once here and the service is driven entirely by this
 * table.
 */

/** Cloudinary treats PDFs and images very differently, so the kind is explicit. */
export type ResourceKind = 'image' | 'document';

export interface UploadTarget {
  /** Prisma model that owns the column. `null` = upload only, caller stores the URL. */
  model:
    | 'profile'
    | 'project'
    | 'blogPost'
    | 'award'
    | 'skill'
    | 'techStack'
    | 'experience'
    | 'education'
    | 'testimonial'
    | null;
  /** Column to write the delivered URL into. Ignored when `model` is null. */
  field: string | null;
  kind: ResourceKind;
  /** Cloudinary sub-folder, so the media library stays navigable. */
  folder: string;
  /**
   * When true the URL is appended to a JSON string[] column instead of
   * replacing a scalar — this is how Project.gallery is populated.
   */
  appendToArray?: boolean;
}

export const UPLOAD_TARGETS = {
  profile_avatar: {
    model: 'profile',
    field: 'avatarUrl',
    kind: 'image',
    folder: 'profile',
  },
  profile_resume: {
    model: 'profile',
    field: 'resumeUrl',
    kind: 'document',
    folder: 'resume',
  },
  project_cover: {
    model: 'project',
    field: 'coverImageUrl',
    kind: 'image',
    folder: 'projects',
  },
  project_gallery: {
    model: 'project',
    field: 'gallery',
    kind: 'image',
    folder: 'projects/gallery',
    appendToArray: true,
  },
  blog_cover: {
    model: 'blogPost',
    field: 'coverImageUrl',
    kind: 'image',
    folder: 'blog',
  },
  award_icon: { model: 'award', field: 'iconUrl', kind: 'image', folder: 'awards' },
  skill_icon: { model: 'skill', field: 'iconUrl', kind: 'image', folder: 'skills' },
  techstack_icon: {
    model: 'techStack',
    field: 'iconUrl',
    kind: 'image',
    folder: 'tech-stack',
  },
  experience_logo: {
    model: 'experience',
    field: 'logoUrl',
    kind: 'image',
    folder: 'experience',
  },
  education_logo: {
    model: 'education',
    field: 'logoUrl',
    kind: 'image',
    folder: 'education',
  },
  testimonial_avatar: {
    model: 'testimonial',
    field: 'avatarUrl',
    kind: 'image',
    folder: 'testimonials',
  },
  /**
   * Upload without touching the database. The admin form receives the URL and
   * writes it wherever it likes on the next PATCH — needed for records that do
   * not exist yet (a cover picked before the project is first saved).
   */
  unattached_image: { model: null, field: null, kind: 'image', folder: 'media' },
  unattached_document: {
    model: null,
    field: null,
    kind: 'document',
    folder: 'documents',
  },
} as const satisfies Record<string, UploadTarget>;

export type UploadTargetName = keyof typeof UPLOAD_TARGETS;

export const UPLOAD_TARGET_NAMES = Object.keys(UPLOAD_TARGETS) as UploadTargetName[];

export const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
] as const;

export const DOCUMENT_MIME_TYPES = ['application/pdf'] as const;

/** Documents are capped lower than images: a resume has no business being 10 MB. */
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_DOCUMENT_BYTES = 8 * 1024 * 1024;
