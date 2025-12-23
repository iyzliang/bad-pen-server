import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule as IORedisModule } from '@nestjs-modules/ioredis';
import { RedisService } from './redis.service';

/**
 * Redis 模块
 * 注册为全局模块，方便其他模块直接使用
 */
@Global()
@Module({
  imports: [
    IORedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('REDIS_HOST') ?? 'localhost';
        const port = configService.get<number>('REDIS_PORT') ?? 6379;
        const password = configService.get<string>('REDIS_PASSWORD');

        return {
          type: 'single',
          url: password
            ? `redis://:${password}@${host}:${port}`
            : `redis://${host}:${port}`,
          options: {
            retryStrategy: (times: number) => {
              // 重试策略：最多重试 3 次
              if (times > 3) {
                return null; // 停止重试
              }
              // 延迟重试：第1次100ms，第2次200ms，第3次300ms
              return Math.min(times * 100, 3000);
            },
            reconnectOnError: (err: Error) => {
              // 某些错误会自动重连
              const targetError = 'READONLY';
              if (err.message.includes(targetError)) {
                return true; // 自动重连
              }
              return false;
            },
            maxRetriesPerRequest: 3,
            lazyConnect: true, // 延迟连接，避免启动时立即连接失败导致应用无法启动
          },
        };
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
