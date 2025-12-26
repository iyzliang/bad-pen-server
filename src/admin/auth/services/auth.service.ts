import {
  BadRequestException,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { RedisService } from '@/common/redis/redis.service';
import { UserRepository } from '@/admin/user/repositories';
import { EMAIL_VERIFY_PREFIX } from '@/common/constants';
import { JwtService } from '@/common/jwt/jwt.service';
import { hashPassword, comparePassword } from '@/utils';
import { CaptchaService } from './captcha.service';
import {
  RegisterBodyDto,
  LoginDto,
  CaptchaType,
  LoginBodyDto,
  RefreshTokenBodyDto,
  AccessTokenDto,
} from '../dtos';

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
  async register(registerBodyDto: RegisterBodyDto) {
    const { email, password, emailVerifyCode, code, captchaId } =
      registerBodyDto;

    // 1. 验证邮箱验证码
    await this.verifyEmailCode(email, emailVerifyCode);
    await this.verifyCaptcha(captchaId, code);

    // 2. 检查邮箱是否已注册
    const emailExists = await this.userRepository.existsByEmail(email);
    if (emailExists) {
      throw new ConflictException('该邮箱已被注册');
    }

    // 3. 加密密码
    const hashedPassword = hashPassword(password);

    // 4. 创建用户
    await this.userRepository.create({
      email,
      password: hashedPassword,
    });
  }

  /**
   * 登录
   * @param loginBodyDto 登录信息
   */
  async login(loginBodyDto: LoginBodyDto): Promise<LoginDto> {
    const { email, password, captchaId, code } = loginBodyDto;
    await this.verifyCaptcha(captchaId, code, CaptchaType.LOGIN);
    const user = await this.userRepository.findByEmailWithPassword(email);
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    if (!comparePassword(password, user.password)) {
      throw new BadRequestException('密码错误');
    }
    const tokens = await this.jwtService.generateTokens({ sub: user.id });
    return new LoginDto({
      ...user,
      ...tokens,
    });
  }

  /**
   * 刷新令牌
   * @param refreshTokenBodyDto 刷新令牌信息
   */
  async refreshToken(
    refreshTokenBodyDto: RefreshTokenBodyDto,
  ): Promise<AccessTokenDto> {
    const { refreshToken } = refreshTokenBodyDto;
    const payload = await this.jwtService.verifyRefreshToken(refreshToken);
    const accessTokenDto = this.jwtService.generateAccessToken({
      sub: payload.sub,
    });
    return new AccessTokenDto({
      ...accessTokenDto,
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
   * 验证验证码
   * @param captchaId 验证码ID
   * @param inputCode 输入的验证码
   */
  private async verifyCaptcha(
    captchaId: string,
    inputCode: string,
    captchaType:
      | CaptchaType.REGISTER
      | CaptchaType.LOGIN = CaptchaType.REGISTER,
  ): Promise<void> {
    const captchaRedisKey = CaptchaService.createCaptchaRedisKey(
      captchaType,
      captchaId,
    );
    const captchaTypeStr =
      captchaType === CaptchaType.REGISTER ? '注册' : '登录';
    const storedCode = await this.redisService.get(captchaRedisKey);
    if (!storedCode) {
      throw new BadRequestException(
        `${captchaTypeStr}验证码已过期，请重新获取`,
      );
    }
    if (!CaptchaService.isValidCaptcha(inputCode, storedCode)) {
      throw new BadRequestException(`${captchaTypeStr}验证码错误`);
    }
    await this.redisService.del(captchaRedisKey);
  }
}
