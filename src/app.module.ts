import { Module } from '@nestjs/common';
import { ConfigModule } from '@/common/config/config.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { RedisModule } from '@/common/redis/redis.module';
import { DatabaseModule } from '@/common/database/database.module';
import { AdminModule } from '@/admin/admin.module';
import { FrontModule } from '@/front/front.module';
@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    RedisModule,
    DatabaseModule,
    FrontModule,
    AdminModule,
  ],
})
export class AppModule {}
