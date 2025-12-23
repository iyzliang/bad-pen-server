import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async getCaptcha() {
    return {
      captcha: '123456',
    };
  }
}
