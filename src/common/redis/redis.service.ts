import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

/**
 * Redis 服务
 * 封装必要的增删改查方法
 */
@Injectable()
export class RedisService {
  constructor(
    @InjectRedis()
    private readonly redisClient: Redis,
  ) {}

  /**
   * 获取 Redis 客户端实例（用于高级用法）
   */
  getClient(): Redis {
    return this.redisClient;
  }

  /**
   * 增：设置键值对
   * @param key 键
   * @param value 值
   * @param expireSeconds 过期时间（秒），可选
   */
  async set(key: string, value: string, expireSeconds?: number): Promise<'OK'> {
    if (expireSeconds) {
      return this.redisClient.set(key, value, 'EX', expireSeconds);
    }
    return this.redisClient.set(key, value);
  }

  /**
   * 查：获取值
   * @param key 键
   */
  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  /**
   * 删：删除键
   * @param key 键
   */
  async del(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  /**
   * 改：更新键值对（与 set 相同，Redis 的 set 会自动覆盖）
   * @param key 键
   * @param value 新值
   * @param expireSeconds 过期时间（秒），可选
   */
  async update(
    key: string,
    value: string,
    expireSeconds?: number,
  ): Promise<'OK'> {
    return this.set(key, value, expireSeconds);
  }

  /**
   * 检查键是否存在
   * @param key 键
   */
  async exists(key: string): Promise<boolean> {
    const result = await this.redisClient.exists(key);
    return result === 1;
  }

  /**
   * 设置过期时间
   * @param key 键
   * @param seconds 过期时间（秒）
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    const result = await this.redisClient.expire(key, seconds);
    return result === 1;
  }

  /**
   * 获取剩余过期时间
   * @param key 键
   * @returns 剩余秒数，-1 表示永不过期，-2 表示键不存在
   */
  async ttl(key: string): Promise<number> {
    return this.redisClient.ttl(key);
  }
}
