import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PageSectionType } from '@prisma/client';
import { UpdatePageSectionDto } from './dto/update-page-section.dto';

const DEFAULT_SECTIONS: { type: PageSectionType; label: string; order: number }[] = [
  { type: PageSectionType.HERO, label: 'Hero', order: 0 },
  { type: PageSectionType.SERVICES, label: 'Services', order: 1 },
  { type: PageSectionType.PROJECTS, label: 'Projects', order: 2 },
  { type: PageSectionType.SKILLS, label: 'Skills', order: 3 },
  { type: PageSectionType.EXPERIENCE, label: 'Experience', order: 4 },
  { type: PageSectionType.EDUCATION, label: 'Education', order: 5 },
  { type: PageSectionType.TESTIMONIALS, label: 'Testimonials', order: 6 },
  { type: PageSectionType.TECH_STACK, label: 'Tech Stack', order: 7 },
  { type: PageSectionType.BLOG, label: 'Blog', order: 8 },
  { type: PageSectionType.ABOUT, label: 'About', order: 9 },
  { type: PageSectionType.CONTACT, label: 'Contact', order: 10 },
];

@Injectable()
export class PageSectionService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    // Seed default sections if they don't exist
    for (const section of DEFAULT_SECTIONS) {
      await this.prisma.pageSection.upsert({
        where: { type: section.type },
        update: {},
        create: section,
      });
    }
  }

  findAll() {
    return this.prisma.pageSection.findMany({ orderBy: { order: 'asc' } });
  }

  findEnabled() {
    return this.prisma.pageSection.findMany({
      where: { isEnabled: true },
      orderBy: { order: 'asc' },
    });
  }

  async update(type: PageSectionType, dto: UpdatePageSectionDto) {
    const section = await this.prisma.pageSection.findUnique({ where: { type } });
    if (!section) throw new NotFoundException('Page section not found');
    return this.prisma.pageSection.update({ where: { type }, data: dto });
  }
}
