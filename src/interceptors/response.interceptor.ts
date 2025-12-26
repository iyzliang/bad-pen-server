import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { IResponse } from '@/interface';
import { formatDateTime } from '@/utils';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data: unknown) => {
        // 如果是已封装响应体，直接返回
        const dataObj = data as Record<string, unknown> | null | undefined;
        if (
          dataObj &&
          typeof dataObj === 'object' &&
          'code' in dataObj &&
          'data' in dataObj
        ) {
          return data as IResponse;
        }

        // 获取 HTTP 状态码，默认为 200
        const statusCode = response.statusCode || HttpStatus.OK;

        // 构造响应对象
        const responseData: IResponse<any> = {
          code: statusCode,
          message: 'ok',
          time: formatDateTime(),
          data: data ?? null,
        };

        return responseData;
      }),
    );
  }
}
