import { Module } from '@nestjs/common';
import { ConfigModule } from '@/common/config/config.module';
import { LoggerModule } from '@/common/logger/logger.module';

@Module({
  imports: [ConfigModule, LoggerModule],
})
export class AppModule {}
