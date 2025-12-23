# Redis 模块

Redis 模块基于 `@nestjs-modules/ioredis` 封装，提供了简洁的 Redis 客户端配置和必要的增删改查方法。

## 安装依赖

```bash
pnpm add @nestjs-modules/ioredis ioredis
```

## 配置

在 `.env` 文件中配置 Redis 连接信息：

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=password
```

## 使用方式

在任意模块的服务中直接注入 `RedisService`：

```typescript
import { Injectable } from '@nestjs/common';
import { RedisService } from '@/common/redis/redis.service';

@Injectable()
export class UserService {
  constructor(private readonly redisService: RedisService) {}

  async getUserCache(userId: string) {
    const cached = await this.redisService.get(`user:${userId}`);
    return cached ? JSON.parse(cached) : null;
  }

  async setUserCache(userId: string, userData: any, ttl = 3600) {
    await this.redisService.set(
      `user:${userId}`,
      JSON.stringify(userData),
      ttl,
    );
  }

  async deleteUserCache(userId: string) {
    await this.redisService.del(`user:${userId}`);
  }
}
```

## RedisService 提供的方法

### 基础增删改查

- **增：`set(key, value, expireSeconds?)`** - 设置键值对

  ```typescript
  await redisService.set('key', 'value');
  await redisService.set('key', 'value', 3600); // 1小时后过期
  ```

- **查：`get(key)`** - 获取值

  ```typescript
  const value = await redisService.get('key');
  ```

- **删：`del(key)`** - 删除键

  ```typescript
  await redisService.del('key');
  ```

- **改：`update(key, value, expireSeconds?)`** - 更新键值对（与 set 相同）
  ```typescript
  await redisService.update('key', 'newValue');
  ```

### 辅助方法

- **`exists(key)`** - 检查键是否存在

  ```typescript
  const exists = await redisService.exists('key'); // 返回 boolean
  ```

- **`expire(key, seconds)`** - 设置过期时间

  ```typescript
  await redisService.expire('key', 3600); // 1小时后过期
  ```

- **`ttl(key)`** - 获取剩余过期时间（秒）

  ```typescript
  const ttl = await redisService.ttl('key');
  // 返回：剩余秒数，-1 表示永不过期，-2 表示键不存在
  ```

- **`getClient()`** - 获取 Redis 客户端实例（用于高级用法）
  ```typescript
  const client = redisService.getClient();
  // 可以使用 ioredis 的所有原生方法
  await client.hset('hash', 'field', 'value');
  ```

## 模块特性

1. **全局模块**：使用 `@Global()` 装饰器，注册后可在任意模块中使用，无需重复导入
2. **延迟连接**：配置 `lazyConnect: true`，避免启动时连接失败导致应用无法启动
3. **自动重连**：内置重试策略和错误处理
4. **简化配置**：基于 `@nestjs-modules/ioredis`，配置更简洁

## 注意事项

1. Redis 连接失败不会阻止应用启动，但会记录错误日志
2. 确保 Redis 服务正常运行，否则某些操作可能会失败
3. 如需使用高级功能（如哈希、列表、集合等），可通过 `getClient()` 获取原始客户端实例
