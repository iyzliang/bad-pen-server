/**
 * 异常响应接口
 */
export interface IResponse<T = null> {
  code: number;
  message: string;
  time: string;
  data: T;
}
