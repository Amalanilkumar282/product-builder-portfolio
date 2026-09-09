import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { notifySiteDataChange } from '../common/utils/seo-notify.util';
import { CreateTalkDto } from './dto/create-talk.dto';
import { UpdateTalkDto } from './dto/update-talk.dto';

@Injectable()
export class TalkService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTalkDto) {
    return this.notify(this.prisma.talk.create({
      data: {
        ...dto,
        eventDate: dto.eventDate ? new Date(dto.eventDate) : undefined,
      },
    }));
  }

  findAll() {
    return this.prisma.talk.findMany({ orderBy: { order: 'asc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.talk.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Talk not found');
    return item;
  }

  async update(id: string, dto: UpdateTalkDto) {
    await this.findOne(id);
    return this.notify(this.prisma.talk.update({
      where: { id },
      data: {
        ...dto,
        eventDate:
          dto.eventDate !== undefined
            ? dto.eventDate
              ? new Date(dto.eventDate)
              : null
            : undefined,
      },
    }));
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.notify(this.prisma.talk.delete({ where: { id } }));
  }

  findPublished() {
    return this.prisma.talk.findMany({
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
    notifySiteDataChange('talk');
    return result;
  }
}
