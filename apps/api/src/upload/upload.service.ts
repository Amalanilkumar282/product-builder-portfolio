import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import {
  notifySiteDataChange,
  type RevalidateTag,
} from '../common/utils/seo-notify.util';
import {
  DOCUMENT_MIME_TYPES,
  IMAGE_MIME_TYPES,
  MAX_DOCUMENT_BYTES,
  MAX_IMAGE_BYTES,
  UPLOAD_TARGETS,
  type UploadTarget,
  type UploadTargetName,
} from './upload-targets';

/**
 * Injects a Cloudinary transformation segment into a delivery URL.
 *
 * The uploader previously stored the bare `secure_url`, so Next's image
 * optimizer fetched full-size originals (up to 10 MB) on every cold cache
 * miss. `f_auto,q_auto` lets Cloudinary negotiate format and quality at the
 * edge, and the width cap stops a 6000px phone photo being delivered at full
 * resolution when the largest slot on the site is ~1600px.
 */
export function withImageDelivery(secureUrl: string): string {
  const marker = '/upload/';
  const at = secureUrl.indexOf(marker);
  // Not a recognisable Cloudinary delivery URL — leave it exactly as-is rather
  // than corrupting a URL we do not understand.
  if (at === -1) return secureUrl;

  const head = secureUrl.slice(0, at + marker.length);
  const tail = secureUrl.slice(at + marker.length);

  // Idempotent: never stack a second transformation onto a URL that already
  // carries ours (re-saving an existing record must not rewrite the URL).
  if (tail.startsWith('f_auto')) return secureUrl;

  return `${head}f_auto,q_auto,c_limit,w_1600/${tail}`;
}

/** Which revalidation tag a target's model maps to, for on-demand ISR. */
const MODEL_REVALIDATION: Record<string, RevalidateTag> = {
  profile: 'profile',
  project: 'project',
  blogPost: 'blog',
  award: 'award',
  skill: 'skill',
  techStack: 'tech-stack',
  experience: 'experience',
  education: 'education',
  testimonial: 'testimonial',
};

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    if (!cloudinary.config().cloud_name) {
      cloudinary.config({
        cloud_name: this.config.get<string>('app.cloudinary.cloudName'),
        api_key: this.config.get<string>('app.cloudinary.apiKey'),
        api_secret: this.config.get<string>('app.cloudinary.apiSecret'),
        secure: true,
      });
    }
  }

  private uploadToCloudinary(
    file: Express.Multer.File,
    folder: string,
    kind: 'image' | 'document',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `portfolio/${folder}`,
          // PDFs go up as `raw`. Cloudinary blocks PDF *delivery* for the
          // `image` resource type on accounts with the default security
          // settings, which would leave an uploaded resume returning 401 —
          // `raw` is delivered unconditionally and is what a download wants.
          resource_type: kind === 'document' ? 'raw' : 'image',
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error ?? new Error('Cloudinary upload failed'));
          }
          resolve(result);
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async upload(
    file: Express.Multer.File,
    target: UploadTargetName,
    entityId?: string,
  ): Promise<{ url: string; publicId: string }> {
    if (!file) throw new BadRequestException('No file provided');

    const config: UploadTarget | undefined = UPLOAD_TARGETS[target];
    if (!config) throw new BadRequestException(`Unknown upload target "${target}"`);

    const allowed: readonly string[] =
      config.kind === 'document' ? DOCUMENT_MIME_TYPES : IMAGE_MIME_TYPES;
    if (!allowed.includes(file.mimetype)) {
      throw new BadRequestException(
        `Unsupported file type "${file.mimetype}" for ${target}. Allowed: ${allowed.join(', ')}`,
      );
    }

    const maxBytes = config.kind === 'document' ? MAX_DOCUMENT_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxBytes) {
      throw new BadRequestException(
        `File exceeds the maximum size of ${Math.round(maxBytes / 1024 / 1024)} MB`,
      );
    }

    // Writing to a column requires knowing which row. Catching this here gives
    // the admin a clear 400 instead of a Prisma "record not found" 500.
    if (config.model && !entityId) {
      throw new BadRequestException(`An entityId is required for the "${target}" target`);
    }

    const result = await this.uploadToCloudinary(file, config.folder, config.kind);
    const url =
      config.kind === 'image' ? withImageDelivery(result.secure_url) : result.secure_url;

    await this.prisma.media.create({
      data: {
        url,
        publicId: result.public_id,
        filename: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      },
    });

    if (config.model && config.field && entityId) {
      await this.writeToEntity(config.model, config.field, entityId, url, config.appendToArray);

      const tag = MODEL_REVALIDATION[config.model];
      if (tag) notifySiteDataChange(tag);
    }

    return { url, publicId: result.public_id };
  }

  /**
   * Writes the delivered URL onto the owning row. `appendToArray` handles the
   * JSON `string[]` columns (Project.gallery) by reading, appending and writing
   * back, since Postgres JSON columns have no array-append through Prisma.
   */
  private async writeToEntity(
    model: string,
    field: string,
    entityId: string,
    url: string,
    appendToArray?: boolean,
  ): Promise<void> {
    const delegate = (this.prisma as unknown as Record<string, any>)[model];
    if (!delegate) throw new BadRequestException(`Unknown model "${model}"`);

    if (appendToArray) {
      const existing = await delegate.findUnique({ where: { id: entityId } });
      if (!existing) throw new BadRequestException(`No ${model} found with id ${entityId}`);

      const current = existing[field];
      const list = Array.isArray(current)
        ? (current as string[])
        : typeof current === 'string'
          ? this.parseJsonArray(current)
          : [];

      await delegate.update({
        where: { id: entityId },
        data: { [field]: [...list, url] },
      });
      return;
    }

    await delegate.update({ where: { id: entityId }, data: { [field]: url } });
  }

  private parseJsonArray(value: string): string[] {
    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as string[]) : [];
    } catch {
      return [];
    }
  }

  async findAllMedia() {
    return this.prisma.media.findMany({ orderBy: { uploadedAt: 'desc' } });
  }

  async removeMedia(id: string): Promise<{ message: string }> {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) throw new BadRequestException(`Media with id ${id} not found.`);

    // Cloudinary needs to be told which bucket the asset lives in; a PDF
    // uploaded as `raw` is not found under the default `image` resource type
    // and would leak as an orphaned asset.
    const resourceType = media.mimeType === 'application/pdf' ? 'raw' : 'image';

    try {
      await cloudinary.uploader.destroy(media.publicId, { resource_type: resourceType });
    } catch (error) {
      // The DB row is the thing the admin sees; failing to delete the remote
      // asset should not strand an undeletable row in the media library.
      this.logger.warn(
        `Cloudinary destroy failed for ${media.publicId}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }

    await this.prisma.media.delete({ where: { id } });
    return { message: 'Deleted' };
  }
}
