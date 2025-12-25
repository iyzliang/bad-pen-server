import {
  BadRequestException,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { RedisService } from '@/common/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '@/admin/user/repositories';
import { EMAIL_VERIFY_PREFIX } from '@/common/constants';
import { JwtService } from '@/common/jwt/jwt.service';
import { hashPassword } from '@/utils';
import { CaptchaService } from './captcha.service';
import { RegisterBodyDto, LoginDto, CaptchaType } from '../dtos';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 用户注册
   * @param registerBodyDto 注册信息
   */
  async register(registerBodyDto: RegisterBodyDto): Promise<LoginDto> {
    const { email, password, emailVerifyCode, code, captchaId } =
      registerBodyDto;

    // 1. 验证邮箱验证码
    await this.verifyEmailCode(email, emailVerifyCode);
    await this.verifyRegisterCaptcha(captchaId, code);

    // 2. 检查邮箱是否已注册
    const emailExists = await this.userRepository.existsByEmail(email);
    if (emailExists) {
      throw new ConflictException('该邮箱已被注册');
    }

    // 3. 加密密码
    const hashedPassword = hashPassword(password);

    // 4. 创建用户
    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
    });
    const tokens = await this.jwtService.generateTokens({ sub: user.id });
    return new LoginDto({
      ...user,
      ...tokens,
    });
  }

  /**
   * 验证邮箱验证码
   * @param email 邮箱
   * @param code 验证码
   */
  private async verifyEmailCode(email: string, code: string): Promise<void> {
    const verifyCodeRedisKey = `${EMAIL_VERIFY_PREFIX}:${email}`;
    const storedCode = await this.redisService.get(verifyCodeRedisKey);

    if (!storedCode) {
      throw new BadRequestException('邮箱验证码已过期，请重新获取');
    }

    if (storedCode.toLowerCase() !== code.toLowerCase()) {
      throw new BadRequestException('邮箱验证码错误');
    }

    await this.redisService.del(verifyCodeRedisKey);
  }

  /**
   * 验证注册验证码
   * @param captchaId 验证码ID
   * @param inputCode 输入的验证码
   */
  private async verifyRegisterCaptcha(
    captchaId: string,
    inputCode: string,
  ): Promise<void> {
    const captchaRedisKey = CaptchaService.createCaptchaRedisKey(
      CaptchaType.REGISTER,
      captchaId,
    );
    const storedCode = await this.redisService.get(captchaRedisKey);
    if (!storedCode) {
      throw new BadRequestException('注册验证码已过期，请重新获取');
    }
    if (!CaptchaService.isValidCaptcha(inputCode, storedCode)) {
      throw new BadRequestException('注册验证码错误');
    }
    await this.redisService.del(captchaRedisKey);
  }
}
