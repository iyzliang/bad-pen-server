import { Controller, Get, Post, Query, Body, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '@/common/jwt';
import { AuthService, CaptchaService, EmailService } from '../services';
import {
  CaptchaDto,
  CaptchaQueryDto,
  EmailVerifyBodyDto,
  RegisterBodyDto,
  LoginDto,
} from '../dtos';

@Controller('admin/auth')
@ApiTags('认证管理模块')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly captchaService: CaptchaService,
    private readonly emailService: EmailService,
  ) {}

  @Public()
  @Get('captcha')
  @ApiOperation({ summary: '获取验证码' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取验证码成功',
    type: CaptchaDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '获取验证码失败',
  })
  async getCaptcha(
    @Query() captchaQueryDto: CaptchaQueryDto,
  ): Promise<CaptchaDto> {
    return await this.captchaService.generateCaptcha(captchaQueryDto.type);
  }

  @Public()
  @Post('email/verify')
  @ApiOperation({ summary: '发送邮箱验证码' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '发送邮箱验证码成功',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '发送邮箱验证码失败, 请稍后重试',
  })
  async sendEmailVerify(
    @Body() sendEmailVerifyDto: EmailVerifyBodyDto,
  ): Promise<void> {
    await this.emailService.sendEmailVerify(sendEmailVerifyDto);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: '注册' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '注册成功',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '注册失败, 请稍后重试',
  })
  async register(@Body() registerBodyDto: RegisterBodyDto): Promise<LoginDto> {
    return await this.authService.register(registerBodyDto);
  }
}
