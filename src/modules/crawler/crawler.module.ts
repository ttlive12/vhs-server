import { Module } from '@nestjs/common';

import { BaseModule } from './base/base.module';
import { HsguruModule } from './hsguru/hsguru.module';
import { HsreplayModule } from './hsreplay/hsreplay.module';
import { CrawlerTaskModule } from './tasks/crawler-task.module';
import { DatabaseModule } from '@/modules/database/database.module';
/**
 * 爬虫模块
 * 负责各种爬虫相关功能
 */
@Module({
  imports: [HsguruModule, BaseModule, CrawlerTaskModule, HsreplayModule, DatabaseModule],
  exports: [CrawlerTaskModule],
})
export class CrawlerModule {}
