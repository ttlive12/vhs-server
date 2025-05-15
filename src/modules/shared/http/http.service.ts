import { HttpService as NestHttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import throttle from 'lodash/throttle';
import { Observable, firstValueFrom } from 'rxjs';

import { QueueService } from './queue.service';
/**
 * 自定义HTTP服务
 * 扩展NestJS的HttpService，增加请求队列功能
 */
@Injectable()
export class HttpService extends NestHttpService {
  private readonly logger = new Logger();
  private logQueueStatus: (name?: string) => void;
  private useCloudbypass = true; // 默认启用cloudbypass服务
  private consecutiveFailures = 0; // 连续失败次数计数
  private failureThreshold = 3; // 连续失败阈值，超过此值将启用cloudbypass

  constructor(
    @Inject('AXIOS_INSTANCE_TOKEN') axiosRef: AxiosInstance,
    @Inject(ConfigService) private readonly configService: ConfigService,
    private readonly queueService: QueueService,
  ) {
    super(axiosRef);

    this.logQueueStatus = throttle((name?: string) => {
      const totalPending = this.queueService.getTotalPendingTasks();
      this.logger.log(`当前任务总数：${totalPending}`, name ?? HttpService.name);
    }, 1000);

    // 配置重试机制
    axiosRetry(this.axiosRef, {
      retries: this.configService.get<number>('http.retryConfig.retries') ?? 3,
      retryCondition: (error) => {
        // 详细记录错误信息，帮助调试
        this.logger.error(`请求错误: ${error.code}, 消息: ${error.message}`);

        // 增加连续失败计数
        this.consecutiveFailures++;
        this.logger.log(`连续失败次数: ${this.consecutiveFailures}/${this.failureThreshold}`);

        // 如果连续失败次数超过阈值，启用cloudbypass
        if (this.consecutiveFailures >= this.failureThreshold && !this.useCloudbypass) {
          this.logger.log(`连续失败次数达到阈值，启用cloudbypass服务`);
          this.useCloudbypass = true;
        }

        return Boolean(axiosRetry.isNetworkOrIdempotentRequestError(error) || (error.response && error.response.status >= 300));
      },
      retryDelay: (retryCount) => {
        const delay = Math.min(retryCount * 2000, 8000);
        return delay;
      },
      onRetry: (retryCount, _, requestConfig) => {
        this.logger.log(`正在进行第 ${retryCount} 次重试: ${requestConfig.url}`);
      },
    });

    // 添加请求拦截器，转换URL
    this.axiosRef.interceptors.request.use((config) => {
      const url = axios.getUri(config);

      if (url.includes('hsguru.com') && this.useCloudbypass) {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        const pathname = urlObj.pathname;
        const search = urlObj.search;

        config.url = `https://api.cloudbypass.com${pathname}${search}`;
        config.headers['x-cb-host'] = domain;
      }

      return config;
    });

    // 响应拦截器，重置连续失败计数
    this.axiosRef.interceptors.response.use((response) => {
      // 成功响应，重置连续失败计数
      this.consecutiveFailures = 0;
      return response;
    });

    const queueNumber = this.configService.get<number>('http.queueConfig.concurrency') ?? 4;
    this.queueService.initQueues(queueNumber);
  }

  /**
   * 测试网站是否需要绕过反爬
   * @param url 测试URL
   * @param retries 测试次数
   * @returns 是否需要使用cloudbypass
   */
  async testAntiCrawl(url = 'https://www.hsguru.com/', retries = 2): Promise<boolean> {
    this.logger.log(`开始测试网站反爬状态: ${url}`);

    // 临时禁用cloudbypass进行测试
    this.useCloudbypass = false;

    for (let i = 0; i < retries; i++) {
      try {
        const response = await firstValueFrom(super.get(url, { timeout: 10_000 }));

        // 检查响应是否包含预期内容
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const hasExpectedContent = response.data && typeof response.data === 'string' && response.data.includes('Leaderboards');

        if (hasExpectedContent) {
          this.logger.log(`直接访问成功，不需要使用cloudbypass`);
          this.useCloudbypass = false;
          return false;
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.logger.warn(`测试第${i + 1}次失败: ${errorMessage}`);
      }
    }

    // 所有测试都失败，需要使用cloudbypass
    this.logger.log(`测试失败，将使用cloudbypass服务`);
    this.useCloudbypass = true;
    return true;
  }

  /**
   * 设置是否使用cloudbypass
   * @param use 是否使用
   */
  setUseCloudbypass(use: boolean): void {
    this.useCloudbypass = use;
    this.logger.log(`手动${use ? '启用' : '禁用'}cloudbypass服务`);
  }

  /**
   * 获取请求配置，并添加必要的头信息
   */
  private getRequestConfig(queueIndex: number, config?: AxiosRequestConfig): AxiosRequestConfig {
    const headers = Object.assign({}, config?.headers ?? {});

    if (this.useCloudbypass) {
      headers['x-cb-part'] = `${queueIndex}`;
      headers['x-cb-version'] = '2';
      headers['x-cb-apiKey'] = this.configService.get<string>('cb.apiKey');
      headers['x-cb-proxy'] = this.configService.get<string>('cb.proxy');
    }

    return {
      ...config,
      headers,
    };
  }

  /**
   * 重写get方法，增加请求队列功能
   */
  override get<T = unknown>(url: string, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    // 返回一个新的Observable，在订阅时通过队列执行请求
    return new Observable<AxiosResponse<T>>((subscriber) => {
      this.queueService
        .enqueue<AxiosResponse<T>>(async (queueIndex) => {
          const mergedConfig = this.getRequestConfig(queueIndex, config);

          // 调用父类的get方法
          const response = await firstValueFrom(super.get<T>(url, mergedConfig));

          subscriber.next(response);
          subscriber.complete();
          return response;
        })
        .catch((error: unknown) => {
          subscriber.error(error);
        })
        .finally(() => {
          this.logQueueStatus(config?.fetchOptions?.['name'] as string);
        });
    });
  }

  /**
   * 重写post方法，增加请求队列功能
   */
  override post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    // 返回一个新的Observable，在订阅时通过队列执行请求
    return new Observable<AxiosResponse<T>>((subscriber) => {
      this.queueService
        .enqueue<AxiosResponse<T>>(async (queueIndex) => {
          const mergedConfig = this.getRequestConfig(queueIndex, config);

          // 调用父类的post方法
          const response = await firstValueFrom(super.post<T>(url, data, mergedConfig));

          subscriber.next(response);
          subscriber.complete();
          return response;
        })
        .catch((error: unknown) => {
          subscriber.error(error);
        })
        .finally(() => {
          this.logQueueStatus(config?.fetchOptions?.['name'] as string);
        });
    });
  }

  /**
   * 便捷方法：发送GET请求并直接返回数据
   */
  async fetchGet<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await firstValueFrom(this.get<T>(url, config));
    return response.data;
  }

  /**
   * 便捷方法：发送POST请求并直接返回数据
   */
  async fetchPost<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await firstValueFrom(this.post<T>(url, data, config));
    return response.data;
  }
}
