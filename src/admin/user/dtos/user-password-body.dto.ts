import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserPasswordBodyDto {
  @ApiProperty({ description: '旧密码', example: 'password' })
  @IsString({ message: '旧密码格式不正确' })
  @IsNotEmpty({ message: '旧密码不能为空' })
  oldPassword: string;

  @ApiProperty({ description: '新密码', example: 'password' })
  @IsString({ message: '新密码格式不正确' })
  @IsNotEmpty({ message: '新密码不能为空' })
  newPassword: string;
}
