import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export const createDatabaseConfig = (
  configService: ConfigService,
): DataSourceOptions => {
  const host = configService.get<string>('DB_HOST') ?? 'localhost';
  const port = configService.get<number>('DB_PORT') ?? 5432;
  const username = configService.get<string>('DB_USERNAME') ?? 'postgres';
  const password = configService.get<string>('DB_PASSWORD') ?? '';
  const database = configService.get<string>('DB_DATABASE') ?? 'postgres';
  const sync = configService.get<string>('DB_SYNC') === 'true';
  const migrationsRun =
    configService.get<string>('DB_MIGRATIONS_RUN') === 'true';
  const poolSize = configService.get<number>('DB_POOL_SIZE') ?? 10;
  const poolMin = configService.get<number>('DB_POOL_MIN') ?? 2;

  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    synchronize: sync, // 生产环境应设为 false，使用迁移
    migrationsRun, // 是否自动运行迁移
    // 实体文件路径（支持 TypeScript 和 JavaScript）
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    // 迁移文件路径
    migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
    // 日志配置：debug 模式下输出 SQL 查询
    logging: configService.get<string>('LOG_LEVEL') === 'debug',
    // 连接池配置
    extra: {
      max: poolSize, // 最大连接数
      min: poolMin, // 最小连接数
      idleTimeoutMillis: 30000, // 空闲连接超时时间（毫秒）
      connectionTimeoutMillis: 10000, // 连接超时时间（毫秒）
    },
  };
};
