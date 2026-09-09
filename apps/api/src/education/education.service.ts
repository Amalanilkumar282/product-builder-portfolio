import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { notifySiteDataChange } from '../common/utils/seo-notify.util';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Injectable()
export class EducationService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateEducationDto) {
    return this.notify(this.prisma.education.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    }));
  }

  findAll() {
    return this.prisma.education.findMany({ orderBy: { order: 'asc' } });
  }

  async findOne(id: string) {
    const edu = await this.prisma.education.findUnique({ where: { id } });
    if (!edu) throw new NotFoundException('Education record not found');
    return edu;
  }

  async update(id: string, dto: UpdateEducationDto) {
    await this.findOne(id);
    return this.notify(this.prisma.education.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate
          ? new Date(dto.endDate)
          : dto.endDate === null
            ? null
            : undefined,
      },
    }));
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.notify(this.prisma.education.delete({ where: { id } }));
  }

  findPublished() {
    return this.prisma.education.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * Fires an on-demand ISR purge after a mutation. Wrapping the Prisma call
   * rather than restructuring each method keeps the notification impossible
   * to forget: every write path already returns through here.
   */
  private async notify<T>(work: Promise<T> | T): Promise<T> {
    const result = await work;
    notifySiteDataChange('education');
    return result;
  }
}
