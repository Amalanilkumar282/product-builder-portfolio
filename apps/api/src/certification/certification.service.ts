import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';

@Injectable()
export class CertificationService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCertificationDto) {
    return this.prisma.certification.create({
      data: {
        ...dto,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : undefined,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
      },
    });
  }

  findAll() {
    return this.prisma.certification.findMany({ orderBy: { order: 'asc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.certification.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Certification not found');
    return item;
  }

  async update(id: string, dto: UpdateCertificationDto) {
    await this.findOne(id);
    return this.prisma.certification.update({
      where: { id },
      data: {
        ...dto,
        issueDate:
          dto.issueDate !== undefined
            ? dto.issueDate
              ? new Date(dto.issueDate)
              : null
            : undefined,
        expiryDate:
          dto.expiryDate !== undefined
            ? dto.expiryDate
              ? new Date(dto.expiryDate)
              : null
            : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.certification.delete({ where: { id } });
  }

  findPublished() {
    return this.prisma.certification.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
    });
  }
}
