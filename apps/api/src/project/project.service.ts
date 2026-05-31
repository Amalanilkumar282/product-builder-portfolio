import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------- ADMIN METHODS ----------

  async create(dto: CreateProjectDto) {
    const { tagIds, ...rest } = dto;

    const existing = await this.prisma.project.findUnique({ where: { slug: rest.slug } });
    if (existing) throw new BadRequestException('Project with this slug already exists');

    return this.prisma.project.create({
      data: {
        ...rest,
        tags: tagIds?.length ? { connect: tagIds.map((id) => ({ id })) } : undefined,
      },
      include: { tags: true },
    });
  }

  findAll() {
    return this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: { tags: true },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { tags: true },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: string, dto: UpdateProjectDto) {
    const { tagIds, ...rest } = dto;
    await this.findOne(id);

    if (rest.slug) {
      const existing = await this.prisma.project.findUnique({ where: { slug: rest.slug } });
      if (existing && existing.id !== id) {
        throw new BadRequestException('Project with this slug already exists');
      }
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        ...rest,
        tags: tagIds !== undefined ? { set: tagIds.map((tagId) => ({ id: tagId })) } : undefined,
      },
      include: { tags: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.project.delete({ where: { id } });
  }

  // ---------- PUBLIC METHODS ----------

  findPublished() {
    return this.prisma.project.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      include: { tags: true },
    });
  }

  async findPublishedBySlug(slug: string) {
    const project = await this.prisma.project.findFirst({
      where: { slug, isPublished: true },
      include: { tags: true },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }
}
