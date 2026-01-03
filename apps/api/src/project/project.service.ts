import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------- ADMIN METHODS ----------

  async create(data: any) {
    const existing = await this.prisma.project.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      throw new BadRequestException('Project with this slug already exists');
    }

    return this.prisma.project.create({ data });
  }

  findAll() {
    return this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: any) {
    if (data.slug) {
      const existing = await this.prisma.project.findUnique({
        where: { slug: data.slug },
      });

      if (existing && existing.id !== id) {
        throw new BadRequestException('Project with this slug already exists');
      }
    }

    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.project.delete({
      where: { id },
    });
  }

  // ---------- PUBLIC METHODS ----------

  findPublished() {
    return this.prisma.project.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findPublishedBySlug(slug: string) {
    return this.prisma.project.findFirst({
      where: { slug, isPublished: true },
    });
  }
}
