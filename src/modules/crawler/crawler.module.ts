import { Module } from '@nestjs/common';

import { HsguruModule } from './hsguru/hsguru.module';

/**
 * 爬虫模块
 */
@Module({
  imports: [HsguruModule],
  exports: [],
})
export class CrawlerModule {}
