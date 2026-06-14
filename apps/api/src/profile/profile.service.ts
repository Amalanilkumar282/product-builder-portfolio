import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(dto: UpdateProfileDto) {
    const existing = await this.prisma.profile.findFirst();

    const data = {
      ...dto,
      socialLinks: dto.socialLinks ? JSON.parse(dto.socialLinks) : undefined,
    };

    if (existing) {
      return this.prisma.profile.update({ where: { id: existing.id }, data });
    }

    return this.prisma.profile.create({
      data: { ...data, socialLinks: data.socialLinks ?? {} },
    });
  }

  async findPublished() {
    const profile = await this.prisma.profile.findFirst({
      where: { isPublished: true },
    });
    if (!profile) throw new NotFoundException('Profile not published yet');
    return profile;
  }

  async findForAdmin() {
    const profile = await this.prisma.profile.findFirst();
    if (!profile) throw new NotFoundException('Profile not created yet');
    return profile;
  }
}
