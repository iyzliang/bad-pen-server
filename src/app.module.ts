import { Module } from '@nestjs/common';
import { ConfigModule } from '@/common/config/config.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { RedisModule } from '@/common/redis/redis.module';
import { DatabaseModule } from '@/common/database/database.module';

@Module({
  imports: [ConfigModule, LoggerModule, RedisModule, DatabaseModule],
})
export class AppModule {}
