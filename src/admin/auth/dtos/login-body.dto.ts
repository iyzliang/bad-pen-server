import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginBodyDto {
  @ApiProperty({ description: '邮箱', example: 'test@example.com' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @ApiProperty({ description: '密码', example: 'Abc123!@#' })
  @IsString({ message: '密码格式不正确' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @ApiProperty({ description: '验证码ID', example: '1234567890' })
  @IsString({ message: '验证码ID格式不正确' })
  @IsNotEmpty({ message: '验证码ID不能为空' })
  captchaId: string;

  @ApiProperty({ description: '验证码', example: '123456' })
  @IsString({ message: '验证码格式不正确' })
  @IsNotEmpty({ message: '验证码不能为空' })
  code: string;
}
