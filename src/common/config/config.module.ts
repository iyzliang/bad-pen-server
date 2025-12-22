import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

const envFilePath =
  process.env.NODE_ENV === 'production' ? ['.env.production'] : ['.env'];

@Module({
  imports: [NestConfigModule.forRoot({ isGlobal: true, envFilePath })],
})
export class ConfigModule {}
