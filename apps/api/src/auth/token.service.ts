import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(payload: any) {
    return this.jwtService.sign(payload, {
      expiresIn: Number(process.env.JWT_ACCESS_EXPIRES_IN),
    });
  }

  async generateRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      expiresIn: Number(process.env.JWT_REFRESH_EXPIRES_IN),
    });
  }

  async hashRefreshToken(token: string) {
    return bcrypt.hash(token, 10);
  }

  async verifyRefreshToken(token: string, hash: string) {
    return bcrypt.compare(token, hash);
  }
}
