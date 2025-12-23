import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('captcha')
  async getCaptcha() {
    return this.authService.getCaptcha();
  }
}
