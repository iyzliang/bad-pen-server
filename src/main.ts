import { VersioningType, VERSION_NEUTRAL } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // 获取配置服务和日志服务
  const configService = app.get(ConfigService);
  const loggerService = app.get(WINSTON_MODULE_NEST_PROVIDER);
  const appName = configService.get<string>('APP_NAME') ?? 'Application';

  // 使用日志服务
  app.useLogger(loggerService);

  const port = configService.get<number>('PORT') ?? 3000;
  const cors = configService.get('CORS') === 'true';
  const prefix = configService.get<string>('PREFIX') ?? '/api';
  const versionStr = configService.get<string>('VERSION') ?? '1';

  const version = versionStr.indexOf(',')
    ? versionStr.split(',')
    : [versionStr];

  app.setGlobalPrefix(prefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: typeof version === 'undefined' ? VERSION_NEUTRAL : version,
  });

  if (cors) {
    app.enableCors();
  }

  await app.listen(port);
  loggerService.log(
    `🚀 ${appName} 已启动: http://localhost:${port}${prefix}/v${version[0]}`,
  );
}
bootstrap();
