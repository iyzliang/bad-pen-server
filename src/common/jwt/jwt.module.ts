import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy, JwtRefreshStrategy } from './strategies';
import { JwtAuthGuard, JwtRefreshGuard } from './guards';
import { JWT_ALGORITHM } from '@/common/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/admin/user/entities';
import { UserRepository } from '@/admin/user/repositories';
import { JwtService } from './jwt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        return {
          secret: secret,
          signOptions: {
            algorithm: JWT_ALGORITHM,
          },
        };
      },
    }),
  ],
  providers: [
    JwtStrategy,
    JwtRefreshStrategy,
    JwtAuthGuard,
    JwtRefreshGuard,
    JwtService,
    UserRepository,
  ],
  exports: [
    NestJwtModule,
    PassportModule,
    JwtStrategy,
    JwtRefreshStrategy,
    JwtAuthGuard,
    JwtRefreshGuard,
    JwtService,
  ],
})
export class JwtModule {}
