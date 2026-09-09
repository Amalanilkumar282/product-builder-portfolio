import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { notifySiteDataChange } from '../common/utils/seo-notify.util';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(dto: UpdateProfileDto) {
    const existing = await this.prisma.profile.findFirst();

    const data = {
      ...dto,
      socialLinks: dto.socialLinks ? this.parseSocialLinks(dto.socialLinks) : undefined,
    };

    const profile = existing
      ? await this.prisma.profile.update({ where: { id: existing.id }, data })
      : await this.prisma.profile.create({
          data: { ...data, socialLinks: data.socialLinks ?? {} },
        });

    // The profile feeds the root layout, homepage, contact page and every
    // JSON-LD block, so an edit has to purge more than one path.
    notifySiteDataChange('profile');
    return profile;
  }

  /**
   * `socialLinks` arrives from the admin as a JSON string. A malformed value
   * used to throw a raw SyntaxError out of the controller as an opaque 500;
   * a bad payload is the caller's mistake, so report it as one.
   */
  private parseSocialLinks(raw: string): Prisma.InputJsonObject {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new BadRequestException('socialLinks must be a valid JSON object');
    }

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new BadRequestException('socialLinks must be a JSON object');
    }

    return parsed as Prisma.InputJsonObject;
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
