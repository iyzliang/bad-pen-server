import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto {
  @ApiProperty({ description: '访问令牌', example: 'access-token' })
  @IsString({ message: '访问令牌格式不正确' })
  @IsNotEmpty({ message: '访问令牌不能为空' })
  accessToken: string;

  @ApiProperty({ description: '过期时间 秒', example: 3600 })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: '过期时间格式不正确' },
  )
  @IsNotEmpty({ message: '过期时间不能为空' })
  expiresIn: number;

  constructor(data: AccessTokenDto) {
    Object.assign(this, data);
  }
}

export class RefreshTokenDto {
  @ApiProperty({ description: '刷新令牌', example: 'refresh-token' })
  @IsString({ message: '刷新令牌格式不正确' })
  @IsNotEmpty({ message: '刷新令牌不能为空' })
  refreshToken: string;

  constructor(data: RefreshTokenDto) {
    Object.assign(this, data);
  }
}

export class TokenDto {
  @ApiProperty({ description: '访问令牌', example: 'access-token' })
  @IsString({ message: '访问令牌格式不正确' })
  @IsNotEmpty({ message: '访问令牌不能为空' })
  accessToken: string;

  @ApiProperty({ description: '过期时间 秒', example: 3600 })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: '过期时间格式不正确' },
  )
  @IsNotEmpty({ message: '过期时间不能为空' })
  expiresIn: number;

  @ApiProperty({ description: '刷新令牌', example: 'refresh-token' })
  @IsString({ message: '刷新令牌格式不正确' })
  @IsNotEmpty({ message: '刷新令牌不能为空' })
  refreshToken: string;

  constructor(data: TokenDto) {
    Object.assign(this, data);
  }
}
