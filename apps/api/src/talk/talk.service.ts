import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTalkDto } from './dto/create-talk.dto';
import { UpdateTalkDto } from './dto/update-talk.dto';

@Injectable()
export class TalkService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTalkDto) {
    return this.prisma.talk.create({
      data: {
        ...dto,
        eventDate: dto.eventDate ? new Date(dto.eventDate) : undefined,
      },
    });
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
    return this.prisma.talk.update({
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
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.talk.delete({ where: { id } });
  }

  findPublished() {
    return this.prisma.talk.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
    });
  }
}
