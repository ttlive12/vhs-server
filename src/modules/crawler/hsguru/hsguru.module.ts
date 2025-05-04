import { Module } from '@nestjs/common';

import { HsguruCrawlerService } from './hsguru-crawler.service';
import { HttpModule } from '@/modules/shared/http/http.module';

@Module({
  imports: [
    HttpModule.forRoot({
      baseUrl: 'https://www.hsguru.com',
    }),
  ],
  providers: [HsguruCrawlerService],
  exports: [HsguruCrawlerService],
})
export class HsguruModule {}
