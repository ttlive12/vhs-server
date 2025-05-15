import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CrawlerTaskController } from './crawler.controller';
import { CrawlerTaskService } from './crawler.task';
import { BaseModule } from '../base/base.module';
import { HsguruModule } from '../hsguru/hsguru.module';
import { HsreplayModule } from '../hsreplay/hsreplay.module';
import { DatabaseModule } from '@/modules/database/database.module';
import { HttpModule } from '@/modules/shared';

/**
 * 爬虫任务模块
 * 包含爬虫定时任务和API接口
 */
@Module({
  imports: [ScheduleModule.forRoot(), HsguruModule, BaseModule, HsreplayModule, DatabaseModule, ConfigModule, HttpModule.forRoot()],
  controllers: [CrawlerTaskController],
  providers: [CrawlerTaskService],
  exports: [CrawlerTaskService],
})
export class CrawlerTaskModule {}
