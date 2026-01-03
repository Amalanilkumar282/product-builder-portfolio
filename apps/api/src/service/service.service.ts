import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.service.create({ data });
  }

  findAll() {
    return this.prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.service.findUnique({
      where: { id },
    });
  }

  update(id: string, data: any) {
    return this.prisma.service.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.service.delete({
      where: { id },
    });
  }
}
