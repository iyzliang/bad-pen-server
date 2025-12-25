import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { formatDateTime } from '@/utils';
import { UserEntity } from '../entities';

export class UserInfoDto {
  @ApiProperty({ description: '用户ID', example: 'uuid' })
  @IsString({ message: '用户ID格式不正确' })
  @IsNotEmpty({ message: '用户ID不能为空' })
  userId: string;

  @ApiProperty({ description: '邮箱', example: 'test@example.com' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @ApiProperty({ description: '用户名', example: 'username' })
  @IsString({ message: '用户名格式不正确' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty({ description: '头像', example: 'avatar' })
  @IsString({ message: '头像格式不正确' })
  @IsNotEmpty({ message: '头像不能为空' })
  avatar: string;

  @ApiProperty({ description: '个人简介', example: '个人简介' })
  @IsString({ message: '个人简介格式不正确' })
  @IsNotEmpty({ message: '个人简介不能为空' })
  bio: string;

  @ApiProperty({
    description: '上次密码更新时间',
    example: '2021-01-01 12:00:00',
  })
  @IsString({ message: '上次密码更新时间格式不正确' })
  @IsNotEmpty({ message: '上次密码更新时间不能为空' })
  lastPasswordUpdatedAt: string;

  constructor(data: UserEntity) {
    this.userId = data.id;
    this.email = data.email;
    this.username = data.username ?? '';
    this.avatar = data.avatar ?? '';
    this.bio = data.bio ?? '';
    this.lastPasswordUpdatedAt = data.lastPasswordUpdatedAt
      ? formatDateTime(data.lastPasswordUpdatedAt)
      : '';
  }
}
