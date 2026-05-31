import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: string) {
    if (!query || query.trim().length < 2) {
      return { projects: [], services: [], blogPosts: [] };
    }

    const term = query.trim();
    const searchFilter = {
      OR: [
        { title: { contains: term, mode: 'insensitive' as const } },
        { slug: { contains: term, mode: 'insensitive' as const } },
      ],
    };

    const [projects, services, blogPosts] = await Promise.all([
      this.prisma.project.findMany({
        where: { isPublished: true, ...searchFilter },
        select: { id: true, title: true, slug: true, summary: true, coverImageUrl: true },
        take: 5,
      }),
      this.prisma.service.findMany({
        where: { isPublished: true, ...searchFilter },
        select: { id: true, title: true, slug: true, description: true },
        take: 5,
      }),
      this.prisma.blogPost.findMany({
        where: { isPublished: true, ...searchFilter },
        select: { id: true, title: true, slug: true, summary: true, coverImageUrl: true },
        take: 5,
      }),
    ]);

    return { projects, services, blogPosts };
  }
}
