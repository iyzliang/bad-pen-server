import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum CaptchaType {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  EMAIL_VERIFY = 'EMAIL_VERIFY',
}

export class CaptchaQueryDto {
  @ApiProperty({
    description: '验证码类型',
    enum: CaptchaType,
    example: CaptchaType.LOGIN,
  })
  @IsEnum(CaptchaType, { message: '验证码类型错误' })
  @IsNotEmpty({ message: '验证码类型不能为空' })
  type: CaptchaType;
}
