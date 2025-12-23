import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { BadRequestFilter } from '@/filters/bad-request.filter';
import { LoggerService } from '@/common/logger/logger.service';
import { ResponseInterceptor } from '@/interceptors/response.interceptor';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // 获取配置服务和日志服务
  const configService = app.get(ConfigService);
  const winstonLogger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  const loggerService = app.get(LoggerService);
  const appName = configService.get<string>('APP_NAME') ?? 'Application';

  // 使用日志服务
  app.useLogger(winstonLogger);

  // 注册全局异常过滤器
  app.useGlobalFilters(new BadRequestFilter(loggerService));

  // 注册全局响应拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());

  const port = configService.get<number>('PORT') ?? 3000;
  const cors = configService.get('CORS') === 'true';
  const prefix = configService.get<string>('PREFIX') ?? '/api';

  app.setGlobalPrefix(prefix);

  if (cors) {
    app.enableCors();
  }

  await app.listen(port);
  winstonLogger.log(`🚀 ${appName} 已启动: http://localhost:${port}${prefix}`);
}
bootstrap();
