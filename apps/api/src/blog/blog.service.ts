import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBlogPostDto) {
    const { tagIds, publishedAt, ...rest } = dto;

    const existing = await this.prisma.blogPost.findUnique({
      where: { slug: rest.slug },
    });
    if (existing)
      throw new BadRequestException('Blog post with this slug already exists');

    return this.prisma.blogPost.create({
      data: {
        ...rest,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        tags: tagIds?.length
          ? { connect: tagIds.map((id) => ({ id })) }
          : undefined,
      },
      include: { tags: true },
    });
  }

  findAll() {
    return this.prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: { tags: true },
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
      include: { tags: true },
    });
    if (!post) throw new NotFoundException('Blog post not found');
    return post;
  }

  async update(id: string, dto: UpdateBlogPostDto) {
    await this.findOne(id);

    const { tagIds, publishedAt, ...rest } = dto;

    if (rest.slug) {
      const existing = await this.prisma.blogPost.findUnique({
        where: { slug: rest.slug },
      });
      if (existing && existing.id !== id) {
        throw new BadRequestException(
          'Blog post with this slug already exists',
        );
      }
    }

    return this.prisma.blogPost.update({
      where: { id },
      data: {
        ...rest,
        publishedAt:
          publishedAt !== undefined
            ? publishedAt
              ? new Date(publishedAt)
              : null
            : undefined,
        tags:
          tagIds !== undefined
            ? { set: tagIds.map((tagId) => ({ id: tagId })) }
            : undefined,
      },
      include: { tags: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.blogPost.delete({ where: { id } });
  }

  findPublished() {
    return this.prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      include: { tags: true },
    });
  }

  async findPublishedBySlug(slug: string) {
    const post = await this.prisma.blogPost.findFirst({
      where: { slug, isPublished: true },
      include: { tags: true },
    });
    if (!post) throw new NotFoundException('Blog post not found');
    return post;
  }
}
