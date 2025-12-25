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
  LoginBodyDto,
  RefreshTokenBodyDto,
  AccessTokenDto,
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
    type: LoginDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '注册失败, 请稍后重试',
  })
  async register(@Body() registerBodyDto: RegisterBodyDto): Promise<LoginDto> {
    return await this.authService.register(registerBodyDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: '登录' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '登录成功',
    type: LoginDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '登录失败, 请稍后重试',
  })
  async login(@Body() loginBodyDto: LoginBodyDto): Promise<LoginDto> {
    return await this.authService.login(loginBodyDto);
  }

  @Public()
  @Post('refresh-token')
  @ApiOperation({ summary: '刷新令牌' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '刷新令牌成功',
    type: AccessTokenDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '刷新令牌失败, 请稍后重试',
  })
  async refreshToken(
    @Body() refreshTokenBodyDto: RefreshTokenBodyDto,
  ): Promise<AccessTokenDto> {
    return await this.authService.refreshToken(refreshTokenBodyDto);
  }
}
