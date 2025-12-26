import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@/interface';
import {
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_REDIS_PREFIX,
} from '@/common/constants';
import { AccessTokenDto, RefreshTokenDto, TokenDto } from '@/admin/auth/dtos';
import { RedisService } from '../redis/redis.service';

/**
 * JWT 服务
 * 封装 JWT token 的生成和验证方法
 */
@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  generateAccessToken(payload: JwtPayload): AccessTokenDto {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET 未配置');
    }

    const accessToken = this.jwtService.sign(payload, {
      secret,
      expiresIn: JWT_EXPIRES_IN,
    });

    return new AccessTokenDto({
      accessToken,
      expiresIn: JWT_EXPIRES_IN,
    });
  }

  generateRefreshToken(payload: JwtPayload): RefreshTokenDto {
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      this.configService.get<string>('JWT_SECRET');

    if (!refreshSecret) {
      throw new Error('JWT_SECRET 或 JWT_REFRESH_SECRET 未配置');
    }

    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
    this.redisService.set(
      `${JWT_REFRESH_REDIS_PREFIX}:${payload.sub}`,
      refreshToken,
      JWT_REFRESH_EXPIRES_IN,
    );
    return new RefreshTokenDto({
      refreshToken,
    });
  }

  async generateTokens(payload: JwtPayload): Promise<TokenDto> {
    const accessTokenDto = this.generateAccessToken(payload);
    const refreshTokenDto = this.generateRefreshToken(payload);

    return new TokenDto({
      ...accessTokenDto,
      ...refreshTokenDto,
    });
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      this.configService.get<string>('JWT_SECRET');

    if (!refreshSecret) {
      throw new Error('JWT_SECRET 或 JWT_REFRESH_SECRET 未配置');
    }
    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: refreshSecret,
      });
      if (!payload) {
        throw new UnauthorizedException('刷新令牌无效');
      }
      const refreshTokenRedisKey = `${JWT_REFRESH_REDIS_PREFIX}:${payload.sub}`;
      const storedRefreshToken =
        await this.redisService.get(refreshTokenRedisKey);
      if (!storedRefreshToken) {
        throw new UnauthorizedException('刷新令牌已过期');
      }
      if (storedRefreshToken !== token) {
        throw new UnauthorizedException('刷新令牌无效');
      }
      return payload;
    } catch (error) {
      throw new UnauthorizedException('刷新令牌无效');
    }
  }
}
