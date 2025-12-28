import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAdminByEmail(email: string) {
    return this.prisma.admin.findUnique({
      where: { email },
    });
  }
}
