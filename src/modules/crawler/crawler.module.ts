import { Module } from '@nestjs/common';

import { BaseModule } from './base/base.module';
import { HsguruModule } from './hsguru/hsguru.module';

/**
 * 爬虫模块
 */
@Module({
  imports: [HsguruModule, BaseModule],
  exports: [],
})
export class CrawlerModule {}
