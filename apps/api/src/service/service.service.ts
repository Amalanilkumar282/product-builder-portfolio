import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateServiceDto) {
    const { tagIds, ...rest } = dto;

    const existing = await this.prisma.service.findUnique({
      where: { slug: rest.slug },
    });
    if (existing)
      throw new BadRequestException('Service with this slug already exists');

    return this.prisma.service.create({
      data: {
        ...rest,
        tags: tagIds?.length
          ? { connect: tagIds.map((id) => ({ id })) }
          : undefined,
      },
      include: { tags: true },
    });
  }

  findAll() {
    return this.prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
      include: { tags: true },
    });
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: { tags: true },
    });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async update(id: string, dto: UpdateServiceDto) {
    const { tagIds, ...rest } = dto;
    await this.findOne(id);

    if (rest.slug) {
      const existing = await this.prisma.service.findUnique({
        where: { slug: rest.slug },
      });
      if (existing && existing.id !== id) {
        throw new BadRequestException('Service with this slug already exists');
      }
    }

    return this.prisma.service.update({
      where: { id },
      data: {
        ...rest,
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
    return this.prisma.service.delete({ where: { id } });
  }

  findPublished() {
    return this.prisma.service.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      include: { tags: true },
    });
  }

  async findPublishedBySlug(slug: string) {
    const service = await this.prisma.service.findFirst({
      where: { slug, isPublished: true },
      include: { tags: true },
    });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }
}
