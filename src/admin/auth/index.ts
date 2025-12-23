import { Module } from '@nestjs/common';
import { AuthController } from './controllers';
import { AuthService, CaptchaService, EmailService } from './services';

@Module({
  controllers: [AuthController],
  providers: [AuthService, CaptchaService, EmailService],
})
export class AuthModule {}
