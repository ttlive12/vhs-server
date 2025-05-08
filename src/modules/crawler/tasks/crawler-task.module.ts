import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CrawlerTaskController } from './crawler.controller';
import { CrawlerTaskService } from './crawler.task';
import { BaseModule } from '../base/base.module';
import { HsguruModule } from '../hsguru/hsguru.module';
/**
 * 爬虫任务模块
 * 包含爬虫定时任务和API接口
 */
@Module({
  imports: [
    ScheduleModule.forRoot(), // 注册定时任务模块
    HsguruModule,
    BaseModule,
  ],
  controllers: [CrawlerTaskController],
  providers: [CrawlerTaskService],
  exports: [CrawlerTaskService],
})
export class CrawlerTaskModule {}
