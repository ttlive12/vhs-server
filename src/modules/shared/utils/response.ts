/**
 * 标准响应数据接口
 */
export interface ResponseData<T = undefined> {
  code: number;
  message: string;
  data?: T;
  timestamp?: string;
  [key: string]: unknown;
}

/**
 * 响应成功消息（无数据）
 * @param message 成功消息
 * @param options 可选参数
 * @returns 标准响应对象
 */
export function success(message = '成功', options?: ResponseData): ResponseData {
  return {
    code: 0,
    message,
    ...options,
  };
}

/**
 * 响应失败消息
 * @param message 失败消息
 * @param options 可选参数
 * @returns 标准响应对象
 */
export function error(message = '失败', options?: ResponseData): ResponseData {
  return {
    code: 1,
    message,
    ...options,
  };
}

/**
 * 响应带数据的成功结果
 * @param data 响应数据
 * @param message 可选成功消息
 * @returns 带数据的标准响应对象
 */
export function successWithData<T>(data: T, options?: ResponseData): ResponseData<T> {
  return {
    code: 0,
    message: '成功',
    data,
    ...options,
  };
}
