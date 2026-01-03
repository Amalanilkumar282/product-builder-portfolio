import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    const existing = await this.prisma.service.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      throw new BadRequestException('Service with this slug already exists');
    }

    return this.prisma.service.create({ data });
  }

  findAll() {
    return this.prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.service.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: any) {
    if (data.slug) {
      const existing = await this.prisma.service.findUnique({
        where: { slug: data.slug },
      });

      if (existing && existing.id !== id) {
        throw new BadRequestException('Service with this slug already exists');
      }
    }

    return this.prisma.service.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.service.delete({
      where: { id },
    });
  }

  findPublished() {
    return this.prisma.service.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findPublishedBySlug(slug: string) {
    return this.prisma.service.findFirst({
      where: {
        slug,
        isPublished: true,
      },
    });
  }
}
