import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  findPublished() {
    return this.prisma.project.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findPublishedBySlug(slug: string) {
    return this.prisma.project.findFirst({
      where: {
        slug,
        isPublished: true,
      },
    });
  }
}
