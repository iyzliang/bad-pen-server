import { Injectable, BadRequestException } from '@nestjs/common';
import { RedisService } from '@/common/redis/redis.service';
import * as svgCaptcha from 'svg-captcha';
import { v4 as uuidv4 } from 'uuid';
import { CAPTCHA_TTL } from '@/common/constants';
import { CaptchaDto, CaptchaType } from '../dtos';

@Injectable()
export class CaptchaService {
  constructor(private readonly redisService: RedisService) {}

  async generateCaptcha(captchaType: CaptchaType): Promise<CaptchaDto> {
    try {
      // 生成验证码
      const captcha = svgCaptcha.create({
        size: 4,
        noise: 3,
        color: true,
      });
      if (!captcha || !captcha.data || !captcha.text) {
        throw new BadRequestException('获取验证码失败');
      }
      const captchaId = uuidv4();
      const captchaRedisKey = CaptchaService.createCaptchaRedisKey(
        captchaType,
        captchaId,
      );
      await this.redisService.set(captchaRedisKey, captcha.text, CAPTCHA_TTL);

      // 将 SVG 文本转为 Base64
      const svgBase64 = Buffer.from(captcha.data).toString('base64');

      // 返回可直接用于 <img> 的 Data URL
      const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;

      return {
        captchaId,
        captchaUrl: dataUrl,
      };
    } catch (error) {
      throw new BadRequestException('获取验证码失败');
    }
  }

  static createCaptchaRedisKey(captchaType: CaptchaType, captchaId: string) {
    return `captcha:${captchaType}:${captchaId}`;
  }

  static isValidCaptcha(inputCaptcha: string, storedCaptcha: string) {
    return inputCaptcha.toLowerCase() === storedCaptcha.toLowerCase();
  }
}
