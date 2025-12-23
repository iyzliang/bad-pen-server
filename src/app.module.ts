import { Module } from '@nestjs/common';
import { ConfigModule } from '@/common/config/config.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { RedisModule } from '@/common/redis/redis.module';
import { AppController } from './app.controller';

@Module({
  imports: [ConfigModule, LoggerModule, RedisModule],
  controllers: [AppController],
})
export class AppModule {}
