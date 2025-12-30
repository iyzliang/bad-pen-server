import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { comparePassword, hashPassword } from '@/utils';
import { UserRepository } from '../repositories';
import { UserEntity } from '../entities';
import { UserInfoDto, UserUpdateBodyDto, UserPasswordBodyDto } from '../dtos';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  getUserInfo(userEntity: UserEntity): UserInfoDto {
    return new UserInfoDto(userEntity);
  }

  async updateUserInfo(
    userEntity: UserEntity,
    userUpdateBody: UserUpdateBodyDto,
  ): Promise<UserInfoDto> {
    await this.userRepository.update(userEntity.id, userUpdateBody);
    const user = await this.userRepository.findById(userEntity.id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return new UserInfoDto(user);
  }

  async updateUserPassword(
    userEntity: UserEntity,
    userPasswordBody: UserPasswordBodyDto,
  ): Promise<void> {
    const { oldPassword, newPassword } = userPasswordBody;
    const user = await this.userRepository.findById(userEntity.id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    const isOldPasswordValid = comparePassword(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new BadRequestException('旧密码不正确');
    }
    const hashedNewPassword = hashPassword(newPassword);
    await this.userRepository.update(userEntity.id, {
      password: hashedNewPassword,
      lastPasswordUpdatedAt: new Date(),
    });
  }
}
