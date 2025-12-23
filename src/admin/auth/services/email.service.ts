import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { RedisService } from '@/common/redis/redis.service';
import { generateRandomString } from '@/utils';
import { EMAIL_VERIFY_PREFIX, EMAIL_VERIFY_TTL } from '@/common/constants';
import { EmailVerifyBodyDto, CaptchaType } from '../dtos';
import { CaptchaService } from './captcha.service';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<boolean>('SMTP_SECURE'),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendEmailVerify(emailVerifyBodyDto: EmailVerifyBodyDto): Promise<void> {
    try {
      const { email, code, captchaId } = emailVerifyBodyDto;
      const type = CaptchaType.EMAIL_VERIFY;
      const captchaEmailRedisKey = CaptchaService.createCaptchaRedisKey(
        type,
        captchaId,
      );
      const storedCaptcha = await this.redisService.get(captchaEmailRedisKey);

      if (!storedCaptcha) {
        throw new BadRequestException('验证码已过期');
      }
      if (!CaptchaService.isValidCaptcha(code, storedCaptcha)) {
        throw new BadRequestException('验证码错误');
      }
      await this.redisService.del(captchaEmailRedisKey);

      const verifyCode = generateRandomString(6);
      const verifyCodeRedisKey = `${EMAIL_VERIFY_PREFIX}:${email}`;
      await this.redisService.set(
        verifyCodeRedisKey,
        verifyCode,
        EMAIL_VERIFY_TTL,
      );
      // 发送验证码邮件
      await this.sendVerificationEmail(email, verifyCode, EMAIL_VERIFY_TTL);
    } catch (error) {
      throw new BadRequestException('发送邮箱验证码失败, 请稍后重试');
    }
  }

  private async sendVerificationEmail(
    to: string,
    code: string,
    ttl: number,
  ): Promise<void> {
    const appName = this.configService.get<string>('APP_NAME') || '系统';
    const ttlMinutes = Math.floor(ttl / 60);
    const ttlSeconds = ttl % 60;
    const ttlText =
      ttlMinutes > 0 ? `${ttlMinutes}分${ttlSeconds}秒` : `${ttlSeconds}秒`;

    const mailOptions = {
      from: `"${appName}" <${this.configService.get<string>('SMTP_USER')}>`,
      to: to,
      subject: `${appName} - 邮箱验证码`,
      text: `您的验证码是: ${code}，有效期 ${ttlText}。`,
      html: `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>邮箱验证码</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa; line-height: 1.6;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f7fa; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                邮箱验证码
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                您好，
              </p>
              <p style="margin: 0 0 30px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                您正在${appName}进行邮箱验证，请使用以下验证码完成验证：
              </p>
              
              <!-- Verification Code Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 20px 0 30px 0;">
                    <div style="background: linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%); border: 2px dashed #667eea; border-radius: 12px; padding: 30px; display: inline-block; min-width: 280px;">
                      <div style="text-align: center;">
                        <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
                          验证码
                        </p>
                        <div style="font-size: 36px; font-weight: 700; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 10px 0;">
                          ${code}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- Image -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 20px 0 30px 0;">
                    <img src="http://img.iyzliang.cn/logo-new.png" alt="${appName} Logo" style="max-width: 200px; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);" />
                  </td>
                </tr>
              </table>
              
              <!-- Warning Info -->
              <div style="background-color: #fff5f5; border-left: 4px solid #fc8181; padding: 16px 20px; border-radius: 6px; margin: 30px 0;">
                <p style="margin: 0; color: #c53030; font-size: 14px; line-height: 1.6;">
                  <strong>安全提示：</strong><br>
                  • 此验证码有效期 <strong style="color: #e53e3e;">${ttlText}</strong><br>
                  • 请勿将验证码泄露给他人<br>
                  • 如非本人操作，请立即修改密码
                </p>
              </div>
              
              <p style="margin: 30px 0 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                如果您没有进行此操作，请忽略此邮件。
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; color: #718096; font-size: 13px;">
                此邮件由系统自动发送，请勿回复。
              </p>
              <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                © ${new Date().getFullYear()} ${appName}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    };
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }
}
