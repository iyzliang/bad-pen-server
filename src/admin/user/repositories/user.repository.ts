import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entities';

/**
 * 用户仓库
 * 封装用户相关的数据库操作方法
 *
 * 使用方式：
 * 1. 在模块的 providers 中注册：UserRepository
 * 2. 在服务中注入：constructor(private readonly userRepository: UserRepository)
 */
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  /**
   * 获取 TypeORM Repository 实例（用于标准 CRUD 操作）
   */
  getRepository(): Repository<UserEntity> {
    return this.repository;
  }

  /**
   * 根据邮箱查找用户
   */
  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({
      where: { email },
    });
  }

  /**
   * 根据邮箱查找用户（包含密码字段）
   */
  async findByEmailWithPassword(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'password',
        'username',
        'avatar',
        'bio',
        'lastPasswordUpdatedAt',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  /**
   * 根据 ID 查找用户
   */
  async findById(id: string): Promise<UserEntity | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  /**
   * 创建用户
   */
  async create(userData: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.repository.create(userData);
    return this.repository.save(user);
  }

  /**
   * 更新用户
   */
  async update(id: string, userData: Partial<UserEntity>): Promise<void> {
    await this.repository.update(id, userData);
  }

  /**
   * 删除用户
   */
  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  /**
   * 检查邮箱是否存在
   */
  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { email },
    });
    return count > 0;
  }
}
