import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@/common/jwt';
import { AuthController } from './controllers';
import { AuthService, CaptchaService, EmailService } from './services';
import { UserEntity } from '../user/entities';
import { UserRepository } from '../user/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule],
  controllers: [AuthController],
  providers: [AuthService, CaptchaService, EmailService, UserRepository],
  exports: [AuthService],
})
export class AuthModule {}
