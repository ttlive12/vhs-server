import { DynamicModule, Module } from '@nestjs/common';

import { HttpConfig } from './http.interface';
import { HttpService } from './http.service';

/**
 * HTTP 模块
 */
@Module({
  imports: [HttpModule],
  providers: [HttpService],
  exports: [HttpService],
})
export class HttpModule {
  static forRoot(httpConfig: HttpConfig): DynamicModule {
    return {
      module: HttpModule,
      providers: [
        {
          provide: 'HTTP_CONFIG',
          useValue: httpConfig,
        },
      ],
    };
  }
}
