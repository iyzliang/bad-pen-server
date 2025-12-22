import { Module } from '@nestjs/common';
import { ConfigModule } from '@/common/config/config.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { AppController } from './app.controller';

@Module({
  imports: [ConfigModule, LoggerModule],
  controllers: [AppController],
})
export class AppModule {}
