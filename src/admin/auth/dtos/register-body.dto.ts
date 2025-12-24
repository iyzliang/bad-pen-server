import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from '@/common/decorators';

export class RegisterBodyDto {
  @ApiProperty({ description: '邮箱', example: 'test@example.com' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @ApiProperty({
    description: '密码',
    example: 'Abc123!@#',
    minLength: 6,
    maxLength: 16,
  })
  @IsStrongPassword({
    message:
      '密码长度为6-16位，不能为纯数字，只能包含数字、英文大小写字母和特殊字符',
  })
  password: string;

  @ApiProperty({ description: '邮箱验证码', example: '123456' })
  @IsString({ message: '邮箱验证码格式不正确' })
  @IsNotEmpty({ message: '邮箱验证码不能为空' })
  emailVerifyCode: string;

  @ApiProperty({ description: '验证码ID', example: '123456' })
  @IsString({ message: '验证码ID格式不正确' })
  @IsNotEmpty({ message: '验证码ID不能为空' })
  captchaId: string;

  @ApiProperty({ description: '验证码', example: '123456' })
  @IsString({ message: '验证码格式不正确' })
  @IsNotEmpty({ message: '验证码不能为空' })
  code: string;
}
