import { HttpStatus } from '@nestjs/common';

/**
 * 请求异常消息映射
 * 当用户没有提供自定义消息时，NestJS 会使用这些默认消息
 */
export const REQUEST_EXCEPTION_MESSAGE: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: '请求错误', // 400
  [HttpStatus.UNAUTHORIZED]: '登录已过期，请重新登录',
  [HttpStatus.FORBIDDEN]: '禁止访问', // 403
  [HttpStatus.NOT_FOUND]: '资源不存在', // 404
  [HttpStatus.METHOD_NOT_ALLOWED]: '方法不允许', // 405
  [HttpStatus.REQUEST_TIMEOUT]: '请求超时', // 408
  [HttpStatus.PAYLOAD_TOO_LARGE]: '请求体太大', // 413
  [HttpStatus.INTERNAL_SERVER_ERROR]: '服务器内部错误', // 500
};

/**
 * NestJS 默认的异常消息映射
 * 当用户没有提供自定义消息时，NestJS 会使用这些默认消息
 */
export const NESTJS_DEFAULT_MESSAGES: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'Bad Request',
  [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
  [HttpStatus.FORBIDDEN]: 'Forbidden',
  [HttpStatus.NOT_FOUND]: 'Not Found',
  [HttpStatus.METHOD_NOT_ALLOWED]: 'Method Not Allowed',
  [HttpStatus.REQUEST_TIMEOUT]: 'Request Timeout',
  [HttpStatus.PAYLOAD_TOO_LARGE]: 'Payload Too Large',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
};
