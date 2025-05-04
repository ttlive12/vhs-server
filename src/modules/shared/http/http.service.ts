import { Inject, Injectable, Logger } from '@nestjs/common';
import axios, { type AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';

import { HttpConfig } from './http.interface';

@Injectable()
export class HttpService {
  private readonly httpClient: AxiosInstance;

  private readonly logger = new Logger(HttpService.name);

  constructor(@Inject('HTTP_CONFIG') private readonly httpConfig?: HttpConfig) {
    this.httpClient = axios.create({
      ...this.httpConfig,
    });

    axiosRetry(this.httpClient, {
      retries: this.httpConfig?.retryConfig?.retries ?? 1,
      retryDelay: (retryCount) => {
        return Math.min(retryCount * 50, 2000);
      },
      onRetry: (retryCount, error) => {
        this.logger.log(`重试次数 ${retryCount} 次: ${error instanceof Error ? error.message : String(error)}`);
      },
      ...this.httpConfig?.retryConfig,
    });

    this.httpClient.interceptors.request.use((config) => {
      this.logger.log(`请求 ${config.method} ${config.url}`);
      return config;
    });

    this.httpClient.interceptors.response.use((response) => {
      this.logger.log(`响应 ${response.status} ${response.statusText}`);
      return response;
    });
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.httpClient.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: Record<string, unknown>): Promise<T> {
    const response = await this.httpClient.post<T>(url, data);
    return response.data;
  }
}
