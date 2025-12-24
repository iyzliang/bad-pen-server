import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers';
import { AuthService, CaptchaService, EmailService } from './services';
import { UserEntity } from '../user/entities';
import { UserRepository } from '../user/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [AuthService, CaptchaService, EmailService, UserRepository],
})
export class AuthModule {}
