import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsUrl,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateBodyDto {
  @ApiProperty({ description: '用户名', example: 'username' })
  @IsString({ message: '用户名格式不正确' })
  @MinLength(3, { message: '用户名长度不能小于3个字符' })
  @MaxLength(50, { message: '用户名长度不能超过50个字符' })
  @IsOptional()
  username: string;

  @ApiProperty({ description: '邮箱', example: 'test@example.com' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsOptional()
  email: string;

  @ApiProperty({ description: '头像', example: 'avatar' })
  @IsUrl({}, { message: '头像格式不正确' })
  @IsOptional()
  avatar: string;

  @ApiProperty({ description: '个人简介', example: '个人简介' })
  @IsString({ message: '个人简介格式不正确' })
  @IsOptional()
  bio: string;
}
