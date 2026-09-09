import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { notifySiteDataChange } from '../common/utils/seo-notify.util';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Injectable()
export class TestimonialService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTestimonialDto) {
    return this.notify(this.prisma.testimonial.create({ data: dto }));
  }

  findAll() {
    return this.prisma.testimonial.findMany({ orderBy: { order: 'asc' } });
  }

  async findOne(id: string) {
    const t = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!t) throw new NotFoundException('Testimonial not found');
    return t;
  }

  async update(id: string, dto: UpdateTestimonialDto) {
    await this.findOne(id);
    return this.notify(this.prisma.testimonial.update({ where: { id }, data: dto }));
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.notify(this.prisma.testimonial.delete({ where: { id } }));
  }

  findPublished() {
    return this.prisma.testimonial.findMany({
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
    notifySiteDataChange('testimonial');
    return result;
  }
}
