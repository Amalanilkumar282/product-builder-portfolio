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

  async findById(id: string) {
    return this.prisma.admin.findUnique({
      where: { id },
    });
  }

  async updateRefreshToken(adminId: string, refreshToken: string | null) {
    return this.prisma.admin.update({
      where: { id: adminId },
      data: { refreshToken },
    });
  }
}
