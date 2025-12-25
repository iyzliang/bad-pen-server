import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@/interface';
import { JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } from '@/common/constants';
import { TokenDto } from '@/admin/auth/dtos';

/**
 * JWT 服务
 * 封装 JWT token 的生成和验证方法
 */
@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(payload: JwtPayload): string {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET 未配置');
    }

    return this.jwtService.sign(payload, {
      secret,
      expiresIn: JWT_EXPIRES_IN,
    });
  }

  generateRefreshToken(payload: JwtPayload): string {
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      this.configService.get<string>('JWT_SECRET');

    if (!refreshSecret) {
      throw new Error('JWT_SECRET 或 JWT_REFRESH_SECRET 未配置');
    }

    return this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
  }

  async generateTokens(payload: JwtPayload): Promise<TokenDto> {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      expiresIn: JWT_EXPIRES_IN,
    };
  }

  verifyAccessToken(token: string): JwtPayload {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET 未配置');
    }
    return this.jwtService.verify<JwtPayload>(token, {
      secret, // 显式传入 secret 进行验证
    });
  }

  verifyRefreshToken(token: string): JwtPayload {
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      this.configService.get<string>('JWT_SECRET');

    if (!refreshSecret) {
      throw new Error('JWT_SECRET 或 JWT_REFRESH_SECRET 未配置');
    }

    return this.jwtService.verify<JwtPayload>(token, {
      secret: refreshSecret, // 显式传入 secret 进行验证
    });
  }
}
