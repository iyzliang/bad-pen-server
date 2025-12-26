import {
  Controller,
  Get,
  Put,
  HttpStatus,
  UseGuards,
  Body,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard } from '@/common/jwt';
import { UserService } from '../services';
import { UserEntity } from '../entities';
import { UserInfoDto, UserUpdateBodyDto, UserPasswordBodyDto } from '../dtos';

@Controller('admin/user')
@ApiTags('用户管理模块')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('info')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '获取用户信息' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取用户信息成功',
    type: UserInfoDto,
  })
  getUserInfo(@CurrentUser() user: UserEntity): UserInfoDto {
    return this.userService.getUserInfo(user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('info')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '更新用户信息' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新用户信息成功',
    type: UserInfoDto,
  })
  async updateUserInfo(
    @CurrentUser() user: UserEntity,
    @Body() userUpdateBody: UserUpdateBodyDto,
  ): Promise<UserInfoDto> {
    return await this.userService.updateUserInfo(user, userUpdateBody);
  }

  @UseGuards(JwtAuthGuard)
  @Put('password')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '更新用户密码' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新用户密码成功',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '更新用户密码失败, 请稍后重试',
  })
  async updateUserPassword(
    @CurrentUser() user: UserEntity,
    @Body() userPasswordBody: UserPasswordBodyDto,
  ): Promise<void> {
    return await this.userService.updateUserPassword(user, userPasswordBody);
  }
}
