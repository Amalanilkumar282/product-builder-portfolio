import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTechStackDto } from './dto/create-tech-stack.dto';
import { UpdateTechStackDto } from './dto/update-tech-stack.dto';

@Injectable()
export class TechStackService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTechStackDto) {
    return this.prisma.techStack.create({ data: dto });
  }

  findAll() {
    return this.prisma.techStack.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] });
  }

  async findOne(id: string) {
    const item = await this.prisma.techStack.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Tech stack item not found');
    return item;
  }

  async update(id: string, dto: UpdateTechStackDto) {
    await this.findOne(id);
    return this.prisma.techStack.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.techStack.delete({ where: { id } });
  }

  findPublished() {
    return this.prisma.techStack.findMany({
      where: { isPublished: true },
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });
  }
}
