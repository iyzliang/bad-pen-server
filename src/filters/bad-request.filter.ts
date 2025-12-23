import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { IResponse } from '@/interface/response.interface';
import { formatDateTime } from '@/utils/date.util';
import { LoggerService } from '@/common/logger/logger.service';
import {
  REQUEST_EXCEPTION_MESSAGE,
  NESTJS_DEFAULT_MESSAGES,
} from '@/common/constants/request-exception';

@Catch()
export class BadRequestFilter<T> implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 获取状态码和消息
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let manualMessage: string | undefined; // 手动抛出的异常消息

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // 处理不同的响应格式，提取手动抛出的异常消息
      if (typeof exceptionResponse === 'string') {
        // 字符串类型：直接使用手动抛出的异常消息
        manualMessage = exceptionResponse.trim() || undefined;
        // 如果提取的消息是 NestJS 的默认消息，视为空消息（用户未提供自定义消息）
        if (manualMessage && isNestJSDefaultMessage(status, manualMessage)) {
          manualMessage = undefined;
        }
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        // 对象类型：尝试获取 message 字段（手动抛出的异常消息）
        const responseObj = exceptionResponse as any;
        manualMessage = responseObj.message;

        // 如果 message 是数组，取第一个元素
        if (Array.isArray(manualMessage)) {
          manualMessage = manualMessage[0]?.trim() || undefined;
        } else if (typeof manualMessage === 'string') {
          manualMessage = manualMessage.trim() || undefined;
        } else {
          manualMessage = undefined;
        }

        // 如果提取的消息是 NestJS 的默认消息，视为空消息（用户未提供自定义消息）
        if (manualMessage && isNestJSDefaultMessage(status, manualMessage)) {
          manualMessage = undefined;
        }
      }
    }

    // 消息优先级：手动抛出的异常消息 -> REQUEST_EXCEPTION_MESSAGE -> 系统默认英文错误
    let message: string;
    if (manualMessage && manualMessage !== '') {
      // 优先使用手动抛出的异常消息
      message = manualMessage;
    } else if (REQUEST_EXCEPTION_MESSAGE[status]) {
      // 如果手动抛出的异常消息为空，使用 REQUEST_EXCEPTION_MESSAGE
      message = REQUEST_EXCEPTION_MESSAGE[status];
    } else if (exception instanceof Error && exception.message) {
      // 如果 REQUEST_EXCEPTION_MESSAGE 也没有，使用系统默认的英文错误
      message = exception.message;
    } else {
      // 最后的兜底：使用默认消息
      message = 'Internal server error';
    }

    // 格式化时间为 YYYY-MM-DD HH:mm:ss
    const time = formatDateTime();

    // 构造响应对象
    const exceptionResponse: IResponse = {
      code: status,
      message,
      time,
      data: null,
    };
    this.loggerService.error(
      `${request.method} ${request.url} ${status} ${message}`,
      exception instanceof Error ? exception.stack : undefined,
      'BadRequestFilter',
    );

    // 发送响应
    response.status(status).json(exceptionResponse);
  }
}

/**
 * 判断给定的消息是否是 NestJS 的默认消息
 * @param status HTTP 状态码
 * @param message 要检查的消息
 * @returns 如果消息是 NestJS 默认消息则返回 true
 */
export function isNestJSDefaultMessage(
  status: number,
  message: string,
): boolean {
  const defaultMessage = NESTJS_DEFAULT_MESSAGES[status];
  if (!defaultMessage) {
    return false;
  }
  // 统一 trim 后比较，确保空白字符不影响判断
  return defaultMessage.trim() === message.trim();
}
