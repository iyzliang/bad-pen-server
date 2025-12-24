# UserRepository 在 AuthService 中的使用流程

## 概述

本文档展示如何在 `AuthService` 中使用 `UserRepository` 进行用户相关的数据库操作。

## 1. 模块配置

### 1.1 在 AuthModule 中注册 UserRepository

```typescript
// src/admin/auth/index.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers';
import { AuthService, CaptchaService, EmailService } from './services';
import { UserEntity } from '../user/entities';
import { UserRepository } from '../user/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])], // 必须导入，用于注入 Repository
  controllers: [AuthController],
  providers: [
    AuthService,
    CaptchaService,
    EmailService,
    UserRepository, // 注册 UserRepository
  ],
  exports: [UserRepository], // 如果需要导出给其他模块使用
})
export class AuthModule {}
```

**关键点：**
- `TypeOrmModule.forFeature([UserEntity])` 必须导入，这样 `@InjectRepository(UserEntity)` 才能正常工作
- `UserRepository` 需要在 `providers` 中注册
- 如果需要跨模块使用，需要在 `exports` 中导出

## 2. 在 AuthService 中注入 UserRepository

```typescript
// src/admin/auth/services/auth.service.ts
import { Injectable } from '@nestjs/common';
import { UserRepository } from '@/admin/user/repositories';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository, // 注入 UserRepository
  ) {}
}
```

## 3. 使用 UserRepository 的方法

### 3.1 检查邮箱是否存在

```typescript
async register(registerBodyDto: RegisterBodyDto): Promise<void> {
  const { email } = registerBodyDto;
  
  // 使用 existsByEmail 方法检查邮箱是否已注册
  const emailExists = await this.userRepository.existsByEmail(email);
  if (emailExists) {
    throw new ConflictException('该邮箱已被注册');
  }
}
```

### 3.2 创建用户

```typescript
async register(registerBodyDto: RegisterBodyDto): Promise<void> {
  const { email, password } = registerBodyDto;
  
  // 加密密码（需要安装 bcrypt）
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // 使用 create 方法创建用户
  await this.userRepository.create({
    email,
    password: hashedPassword,
    bio: '', // 必填字段
    // username 和 avatar 为可选字段，可以不传
  });
}
```

### 3.3 根据邮箱查找用户（登录场景）

```typescript
async login(email: string, password: string) {
  // 使用 findByEmailWithPassword 获取包含密码的用户信息
  const user = await this.userRepository.findByEmailWithPassword(email);
  
  if (!user) {
    throw new UnauthorizedException('用户不存在');
  }
  
  // 验证密码
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedException('密码错误');
  }
  
  return user;
}
```

### 3.4 根据邮箱查找用户（不包含密码）

```typescript
async getUserProfile(email: string) {
  // 使用 findByEmail 方法，不包含密码字段
  const user = await this.userRepository.findByEmail(email);
  
  if (!user) {
    throw new NotFoundException('用户不存在');
  }
  
  return user;
}
```

### 3.5 根据 ID 查找用户

```typescript
async getUserById(id: string) {
  // 使用 findById 方法
  const user = await this.userRepository.findById(id);
  
  if (!user) {
    throw new NotFoundException('用户不存在');
  }
  
  return user;
}
```

### 3.6 更新用户信息

```typescript
async updateUser(id: string, updateData: Partial<UserEntity>) {
  // 使用 update 方法更新用户信息
  await this.userRepository.update(id, {
    username: updateData.username,
    avatar: updateData.avatar,
    bio: updateData.bio,
  });
}
```

### 3.7 使用原生 Repository 方法

如果需要使用 TypeORM 的原生方法（如复杂查询、关联查询等）：

```typescript
async findUsersWithConditions() {
  // 获取原生 Repository 实例
  const repo = this.userRepository.getRepository();
  
  // 使用原生方法
  return repo.find({
    where: { 
      email: Like('%@example.com') 
    },
    order: { createdAt: 'DESC' },
    take: 10,
  });
}
```

## 4. 完整注册流程示例

```typescript
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly redisService: RedisService,
  ) {}

  async register(registerBodyDto: RegisterBodyDto): Promise<void> {
    const { email, password, emailVerifyCode } = registerBodyDto;

    // 1. 验证邮箱验证码（从 Redis 获取）
    await this.verifyEmailCode(email, emailVerifyCode);

    // 2. 检查邮箱是否已注册
    const emailExists = await this.userRepository.existsByEmail(email);
    if (emailExists) {
      throw new ConflictException('该邮箱已被注册');
    }

    // 3. 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. 创建用户
    await this.userRepository.create({
      email,
      password: hashedPassword,
      bio: '',
    });

    // 5. 删除已使用的邮箱验证码
    const verifyCodeRedisKey = `${EMAIL_VERIFY_PREFIX}:${email}`;
    await this.redisService.del(verifyCodeRedisKey);
  }

  private async verifyEmailCode(email: string, code: string): Promise<void> {
    const verifyCodeRedisKey = `${EMAIL_VERIFY_PREFIX}:${email}`;
    const storedCode = await this.redisService.get(verifyCodeRedisKey);

    if (!storedCode) {
      throw new BadRequestException('邮箱验证码已过期，请重新获取');
    }

    if (storedCode !== code) {
      throw new BadRequestException('邮箱验证码错误');
    }
  }
}
```

## 5. 依赖安装

如果需要使用密码加密功能，需要安装 bcrypt：

```bash
pnpm add bcrypt @types/bcrypt
```

然后在代码中导入：

```typescript
import * as bcrypt from 'bcrypt';
```

## 6. 使用流程图

```
Controller (auth.controller.ts)
    ↓
   接收注册请求
    ↓
AuthService (auth.service.ts)
    ↓
   1. 验证邮箱验证码 (RedisService)
    ↓
   2. 检查邮箱是否存在 (UserRepository.existsByEmail)
    ↓
   3. 加密密码 (bcrypt)
    ↓
   4. 创建用户 (UserRepository.create)
    ↓
   5. 删除验证码 (RedisService.del)
    ↓
   返回成功
```

## 7. 注意事项

1. **模块导入**：确保 `AuthModule` 中导入了 `TypeOrmModule.forFeature([UserEntity])`
2. **依赖注入**：`UserRepository` 必须在模块的 `providers` 中注册
3. **类型安全**：所有方法都有完整的 TypeScript 类型支持
4. **错误处理**：根据业务需求添加适当的异常处理
5. **密码安全**：密码必须加密存储，使用 bcrypt 等加密库
6. **事务处理**：如果需要事务，可以通过 `getRepository()` 获取 Repository 后使用事务

## 8. 优势

1. **封装性**：常用查询方法已封装，代码更简洁
2. **可维护性**：数据库操作集中在 Repository，易于维护
3. **可测试性**：易于进行单元测试和模拟
4. **类型安全**：完整的 TypeScript 类型支持
5. **灵活性**：可以同时使用封装方法和原生 Repository 方法

