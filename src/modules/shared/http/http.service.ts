import { HttpService as NestHttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
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

        return Boolean(axiosRetry.isNetworkOrIdempotentRequestError(error) || (error.response && error.response.status >= 300));
      },
      retryDelay: (retryCount) => {
        const delay = Math.min(retryCount * 1000, 5000);
        return delay;
      },
      onRetry: (retryCount, _, requestConfig) => {
        this.logger.log(`正在进行第 ${retryCount} 次重试: ${requestConfig.url}`);
      },
    });

    const queueNumber = this.configService.get<number>('http.queueConfig.concurrency') ?? 4;
    this.queueService.initQueues(queueNumber);
  }

  /**
   * 获取请求配置，并添加x-session头
   */
  private getRequestConfig(queueIndex: number, config?: AxiosRequestConfig): AxiosRequestConfig {
    const headers = Object.assign({}, config?.headers ?? {});
    headers['x-session'] = `${queueIndex}`;

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
