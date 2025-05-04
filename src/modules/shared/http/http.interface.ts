import type { IAxiosRetryConfig } from 'axios-retry';

/**
 * HTTP 接口
 */
export interface HttpConfig {
  baseURL: string;
  timeout?: number;
  maxRedirects?: number;
  headers?: Record<string, string>;
  retryConfig?: IAxiosRetryConfig;
}
