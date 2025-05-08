import { HttpModule as NestHttpModule } from '@nestjs/axios';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';

import { HttpService } from './http.service';
import { QueueService } from './queue.service';

/**
 * HTTP 模块
 */
@Module({})
export class HttpModule {
  static register(config?: AxiosRequestConfig): DynamicModule {
    const axiosInstanceProvider: Provider = {
      provide: 'AXIOS_INSTANCE_TOKEN',
      useValue: axios.create(config),
    };

    return {
      module: HttpModule,
      imports: [NestHttpModule],
      providers: [axiosInstanceProvider, QueueService, HttpService],
      exports: [HttpService],
    };
  }

  /**
   * forRoot 方法，与 register 方法保持一致
   * 为了兼容现有代码
   */
  static forRoot(config?: AxiosRequestConfig): DynamicModule {
    return this.register(config);
  }
}
