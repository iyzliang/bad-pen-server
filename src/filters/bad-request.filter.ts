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

@Catch()
export class BadRequestFilter<T> implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 获取状态码和消息
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // 处理不同的响应格式
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        // 如果响应是对象，尝试获取 message 字段
        const responseObj = exceptionResponse as any;
        message =
          responseObj.message ||
          responseObj.error ||
          exception.message ||
          '请求错误';

        // 如果 message 是数组，取第一个元素
        if (Array.isArray(message)) {
          message = message[0] || '请求错误';
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message || '服务器内部错误';
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
