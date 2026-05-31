import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    cloudinary.config({
      cloud_name: this.config.get<string>('app.cloudinary.cloudName'),
      api_key: this.config.get<string>('app.cloudinary.apiKey'),
      api_secret: this.config.get<string>('app.cloudinary.apiSecret'),
      secure: true,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio',
          resource_type: 'auto',
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error('Upload failed'));
          resolve(result);
        },
      );

      const readable = new Readable();
      readable.push(file.buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  async upload(file: Express.Multer.File) {
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

    const media = await this.prisma.media.create({
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        filename: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      },
    });

    return media;
  }

  findAll() {
    return this.prisma.media.findMany({ orderBy: { uploadedAt: 'desc' } });
  }

  async remove(id: string) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (media) {
      await cloudinary.uploader.destroy(media.publicId);
      await this.prisma.media.delete({ where: { id } });
    }
    return { message: 'Deleted' };
  }
}
