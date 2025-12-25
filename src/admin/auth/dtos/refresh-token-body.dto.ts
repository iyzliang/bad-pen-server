import { IsNotEmpty, IsJWT } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenBodyDto {
  @ApiProperty({ description: '刷新令牌', example: 'refresh-token' })
  @IsJWT({ message: '刷新令牌格式不正确' })
  @IsNotEmpty({ message: '刷新令牌不能为空' })
  refreshToken: string;
}
