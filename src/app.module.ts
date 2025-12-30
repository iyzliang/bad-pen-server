import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@/common/config/config.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { RedisModule } from '@/common/redis/redis.module';
import { DatabaseModule } from '@/common/database/database.module';
import { AdminModule } from '@/admin/admin.module';
import { FrontModule } from '@/front/front.module';
import { ArticleModule } from '@/admin/article';
import { TagModule } from '@/admin/tag';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    LoggerModule,
    RedisModule,
    DatabaseModule,
    FrontModule,
    AdminModule,
    ArticleModule,
    TagModule,
  ],
})
export class AppModule {}
