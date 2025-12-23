import { ConfigService } from '@nestjs/config';
import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import { LOG_MAX_SIZE, LOG_MAX_FILES } from '@/common/constants';
import 'winston-daily-rotate-file';

export const createLoggerConfig = (
  configService: ConfigService,
): WinstonModuleOptions => {
  const logLevel = configService.get('LOG_LEVEL') ?? 'info';
  const logDir = configService.get('LOG_DIR') ?? 'logs';
  const logOn = configService.get('LOG_ON') === 'true';

  // 控制台日志格式
  const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(({ timestamp, level, message, context, trace }) => {
      const contextStr = context ? `[${context}]` : '';
      const traceStr = trace ? `\n${trace}` : '';
      return `${timestamp} ${level} ${contextStr} ${message}${traceStr}`;
    }),
  );

  // 文件日志格式
  const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  );

  const transports: winston.transport[] = [
    // 错误日志文件
    new winston.transports.DailyRotateFile({
      dirname: logDir,
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: LOG_MAX_SIZE,
      maxFiles: LOG_MAX_FILES,
      level: 'error',
      format: fileFormat,
    }),
    // 所有日志文件
    new winston.transports.DailyRotateFile({
      dirname: logDir,
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: LOG_MAX_SIZE,
      maxFiles: LOG_MAX_FILES,
      level: 'info',
      format: fileFormat,
    }),
  ];

  if (logOn) {
    transports.push(
      // 控制台日志
      new winston.transports.Console({
        level: logLevel,
        format: consoleFormat,
      }),
    );
  }

  return {
    transports,
    // 全局日志级别
    level: logLevel,
    // 异常处理
    exceptionHandlers: [
      new winston.transports.DailyRotateFile({
        filename: `${logDir}/exceptions.log`,
        format: fileFormat,
      }),
    ],
    // 拒绝处理（处理被拒绝的 Promise）
    rejectionHandlers: [
      new winston.transports.DailyRotateFile({
        filename: `${logDir}/rejections.log`,
        format: fileFormat,
      }),
    ],
  };
};
