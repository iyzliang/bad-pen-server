import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { BadRequestFilter } from '@/filters/bad-request.filter';
import { LoggerService } from '@/common/logger/logger.service';
import { ResponseInterceptor } from '@/interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version, description } from '../package.json';
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
  const port = configService.get<number>('PORT') ?? 3000;
  const cors = configService.get('CORS') === 'true';
  const prefix = configService.get<string>('PREFIX') ?? '/api';
  const swaggerPrefix = configService.get<string>('SWAGGER_PREFIX') ?? 'api';

  // 使用日志服务
  app.useLogger(winstonLogger);

  if (cors) {
    app.enableCors();
  }
  app.setGlobalPrefix(prefix);
  // 注册全局异常过滤器
  app.useGlobalFilters(new BadRequestFilter(loggerService));

  // 注册全局响应拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 全局验证管道（可选）
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动移除未定义的属性
      forbidNonWhitelisted: false, // 不抛出错误，只是忽略
      transform: true, // 自动类型转换
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );

  // 启用全局序列化拦截器，用于处理响应数据的序列化
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle(`${appName}接口文档`)
    .setDescription(description)
    .setVersion(version)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(swaggerPrefix, app, document); // 通过 http://localhost:3010/api 访问 Swagger UI

  await app.listen(port);
  winstonLogger.log(`🚀 ${appName} 已启动: http://localhost:${port}${prefix}`);
}
bootstrap();
