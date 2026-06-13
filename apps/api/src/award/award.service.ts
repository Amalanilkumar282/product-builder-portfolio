import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAwardDto } from './dto/create-award.dto';
import { UpdateAwardDto } from './dto/update-award.dto';

@Injectable()
export class AwardService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateAwardDto) {
    return this.prisma.award.create({ data: dto });
  }

  findAll() {
    return this.prisma.award.findMany({ orderBy: { order: 'asc' } });
  }

  async findOne(id: string) {
    const award = await this.prisma.award.findUnique({ where: { id } });
    if (!award) throw new NotFoundException('Award not found');
    return award;
  }

  async update(id: string, dto: UpdateAwardDto) {
    await this.findOne(id);
    return this.prisma.award.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.award.delete({ where: { id } });
  }

  findPublished() {
    return this.prisma.award.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
    });
  }
}
