import { ApiProperty } from '@nestjs/swagger';

export class CaptchaDto {
  @ApiProperty({ description: '验证码ID' })
  captchaId: string;

  @ApiProperty({ description: '验证码图片Base64编码' })
  captchaUrl: string;
}
