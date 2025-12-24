import {
  BadRequestException,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { RedisService } from '@/common/redis/redis.service';
import { UserRepository } from '@/admin/user/repositories';
import { EMAIL_VERIFY_PREFIX } from '@/common/constants';
import { hashPassword } from '@/utils';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@/interface';
import { RegisterBodyDto, LoginDto, TokenDto } from '../dtos';

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
  async register(registerBodyDto: RegisterBodyDto): Promise<void> {
    const { email, password, emailVerifyCode } = registerBodyDto;

    // 1. 验证邮箱验证码
    await this.verifyEmailCode(email, emailVerifyCode);

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
   * 生成Access Token和Refresh Token
   */
  // async generateTokens(userId: string): Promise<TokenDto> {
  //   const payload: JwtPayload = { sub: userId };
  //   const accessToken = this.jwtService.sign(payload, JWT_CONFIG.access);
  // }
}
