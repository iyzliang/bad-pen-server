import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailVerifyBodyDto {
  @ApiProperty({ description: '邮箱' })
  @IsEmail({}, { message: '邮箱格式错误' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @ApiProperty({ description: '验证码' })
  @IsString({ message: '验证码格式错误' })
  @IsNotEmpty({ message: '验证码不能为空' })
  code: string;

  @ApiProperty({ description: '验证码ID' })
  @IsString({ message: '验证码ID格式错误' })
  @IsNotEmpty({ message: '验证码ID不能为空' })
  captchaId: string;
}
