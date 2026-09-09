import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { notifySiteDataChange } from '../common/utils/seo-notify.util';
import { CreateTechStackDto } from './dto/create-tech-stack.dto';
import { UpdateTechStackDto } from './dto/update-tech-stack.dto';

@Injectable()
export class TechStackService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTechStackDto) {
    return this.notify(this.prisma.techStack.create({ data: dto }));
  }

  findAll() {
    return this.prisma.techStack.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.techStack.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Tech stack item not found');
    return item;
  }

  async update(id: string, dto: UpdateTechStackDto) {
    await this.findOne(id);
    return this.notify(this.prisma.techStack.update({ where: { id }, data: dto }));
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.notify(this.prisma.techStack.delete({ where: { id } }));
  }

  findPublished() {
    return this.prisma.techStack.findMany({
      where: { isPublished: true },
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });
  }

  /**
   * Fires an on-demand ISR purge after a mutation. Wrapping the Prisma call
   * rather than restructuring each method keeps the notification impossible
   * to forget: every write path already returns through here.
   */
  private async notify<T>(work: Promise<T> | T): Promise<T> {
    const result = await work;
    notifySiteDataChange('tech-stack');
    return result;
  }
}
