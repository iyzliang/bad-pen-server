import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createDatabaseConfig } from './database.config';

/**
 * 数据库模块
 * 注册为全局模块，方便其他模块直接使用
 */
@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return createDatabaseConfig(configService);
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
