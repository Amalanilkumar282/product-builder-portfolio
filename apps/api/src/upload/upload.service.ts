import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

// Define types for clarity
type EntityType = 'profile' | 'project';

@Injectable()
export class UploadService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    // Ensure Cloudinary is configured only once
    if (!cloudinary.config().cloud_name) {
      cloudinary.config({
        cloud_name: this.config.get<string>('app.cloudinary.cloudName'),
        api_key: this.config.get<string>('app.cloudinary.apiKey'),
        api_secret: this.config.get<string>('app.cloudinary.apiSecret'),
        secure: true,
      });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio', // Can make this dynamic if needed
          resource_type: 'auto',
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error || !result)
            return reject(error ?? new Error('Cloudinary upload failed'));
          resolve(result);
        },
      );

      const readable = new Readable();
      readable.push(file.buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  async upload(
    file: Express.Multer.File,
    entityType: EntityType,
    entityId: string,
  ): Promise<string> { // Return the URL
    if (!file) throw new BadRequestException('No file provided');

    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Unsupported file type');
    }

    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      throw new BadRequestException('File exceeds maximum size of 10 MB');
    }

    const result = await this.uploadFile(file);
    const imageUrl = result.secure_url;

    // Save to Media table (optional, but good for a media library)
    await this.prisma.media.create({
      data: {
        url: imageUrl,
        publicId: result.public_id,
        filename: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      },
    });

    // Update the corresponding entity (Profile or Project)
    switch (entityType) {
      case 'profile':
        await this.prisma.profile.update({
          where: { id: entityId },
          data: { avatarUrl: imageUrl },
        });
        break;
      case 'project':
        await this.prisma.project.update({
          where: { id: entityId },
          data: { coverImageUrl: imageUrl },
        });
        break;
      default:
        throw new BadRequestException('Invalid entity type for upload');
    }

    return imageUrl; // Return the URL of the uploaded image
  }

  // Keep findAll and remove for Media table if needed, or adjust if Media is only for uploads
  async findAllMedia(): Promise<any[]> { // Renamed to avoid conflict if findAll was for something else
    return this.prisma.media.findMany({ orderBy: { uploadedAt: 'desc' } });
  }

  async removeMedia(id: string): Promise<{ message: string }> {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) {
      throw new BadRequestException(`Media with id ${id} not found.`);
    }
    await cloudinary.uploader.destroy(media.publicId);
    await this.prisma.media.delete({ where: { id } });
    return { message: 'Deleted' };
  }
}
