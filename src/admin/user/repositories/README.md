# UserRepository 使用指南

## 概述

`UserRepository` 是基于 TypeORM 0.3.x 的新实现方式，替代了已废弃的 `EntityRepository` 装饰器。

## 实现方式

使用 `DataSource` 注入来获取 Repository 实例，这是 TypeORM 0.3.x 推荐的方式。

## 在模块中注册

在 `user.module.ts` 中注册 Repository：

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities';
import { UserRepository } from './repositories';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserRepository, UserService],
  exports: [UserRepository, UserService],
})
export class UserModule {}
```

## 在服务中使用

### 方式一：使用自定义 Repository（推荐）

```typescript
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { UserEntity } from '../entities';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmail(email);
  }

  async createUser(userData: Partial<UserEntity>): Promise<UserEntity> {
    return this.userRepository.create(userData);
  }
}
```

### 方式二：使用标准 TypeORM Repository

如果需要使用 TypeORM 的所有原生方法，可以通过 `getRepository()` 获取：

```typescript
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<UserEntity[]> {
    const repo = this.userRepository.getRepository();
    return repo.find();
  }

  async findWithRelations(): Promise<UserEntity[]> {
    const repo = this.userRepository.getRepository();
    return repo.find({
      relations: ['profile'], // 如果有关系的话
    });
  }
}
```

### 方式三：直接注入 TypeORM Repository（NestJS 标准方式）

如果不需要自定义方法，也可以直接使用 NestJS 的 `@InjectRepository()`：

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }
}
```

## 自定义方法

在 `UserRepository` 中可以添加自定义查询方法：

```typescript
// 在 UserRepository 中添加
async findActiveUsers(): Promise<UserEntity[]> {
  return this.repository.find({
    where: { status: 'active' },
    order: { createdAt: 'DESC' },
  });
}

async findByUsernameOrEmail(usernameOrEmail: string): Promise<UserEntity | null> {
  return this.repository.findOne({
    where: [
      { username: usernameOrEmail },
      { email: usernameOrEmail },
    ],
  });
}
```

## 优势

1. **类型安全**：完整的 TypeScript 类型支持
2. **可测试性**：易于进行单元测试和模拟
3. **封装性**：可以封装复杂的查询逻辑
4. **兼容性**：兼容 TypeORM 0.3.x 版本
5. **灵活性**：可以同时使用自定义方法和原生 Repository 方法

## 注意事项

1. 确保在模块的 `providers` 中注册 `UserRepository`
2. 如果需要在其他模块使用，需要在 `exports` 中导出
3. `DataSource` 由 `DatabaseModule` 全局提供，无需额外导入

