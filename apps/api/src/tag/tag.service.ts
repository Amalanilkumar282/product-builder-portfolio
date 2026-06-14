import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTagDto) {
    const existing = await this.prisma.tag.findUnique({
      where: { slug: dto.slug },
    });
    if (existing)
      throw new BadRequestException('Tag with this slug already exists');
    return this.prisma.tag.create({ data: dto });
  }

  findAll() {
    return this.prisma.tag.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) throw new NotFoundException('Tag not found');
    return tag;
  }

  async update(id: string, dto: UpdateTagDto) {
    await this.findOne(id);
    if (dto.slug) {
      const existing = await this.prisma.tag.findUnique({
        where: { slug: dto.slug },
      });
      if (existing && existing.id !== id) {
        throw new BadRequestException('Tag with this slug already exists');
      }
    }
    return this.prisma.tag.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.tag.delete({ where: { id } });
  }
}
