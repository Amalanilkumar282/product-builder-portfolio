import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import { comparePassword } from '../common/utils/password.util';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  async login(email: string, password: string) {
    const admin = await this.adminService.findAdminByEmail(email);

    if (!admin) throw new UnauthorizedException();

    const valid = await comparePassword(password, admin.password);
    if (!valid) throw new UnauthorizedException();

    const payload: JwtPayload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    };

    const accessToken = await this.tokenService.generateAccessToken(payload);
    const refreshToken = await this.tokenService.generateRefreshToken(payload);

    const hashedRefresh = await this.tokenService.hashRefreshToken(refreshToken);

    await this.adminService.updateRefreshToken(admin.id, hashedRefresh);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken);

    const admin = await this.adminService.findById(payload.sub);
    if (!admin || !admin.refreshToken) throw new UnauthorizedException();

    const valid = await this.tokenService.verifyRefreshToken(
      refreshToken,
      admin.refreshToken,
    );

    if (!valid) throw new UnauthorizedException();

    const newPayload: JwtPayload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    };

    const newAccessToken = await this.tokenService.generateAccessToken(newPayload);
    const newRefreshToken = await this.tokenService.generateRefreshToken(newPayload);

    const hashed = await this.tokenService.hashRefreshToken(newRefreshToken);
    await this.adminService.updateRefreshToken(admin.id, hashed);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(adminId: string) {
    await this.adminService.updateRefreshToken(adminId, null);
    return { message: 'Logged out successfully' };
  }
}
