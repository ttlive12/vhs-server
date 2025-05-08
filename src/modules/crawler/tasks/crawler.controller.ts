import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostCrawlerDto } from './crawler.dto';
import { CrawlerTaskService } from './crawler.task';
import { ResponseData, success } from '@/modules/shared';
/**
 * 爬虫任务控制器
 * 提供手动触发爬虫任务的API接口
 */
@ApiTags('爬虫任务')
@Controller('crawler')
export class CrawlerTaskController {
  constructor(private readonly crawlerTaskService: CrawlerTaskService) {}

  /**
   * 手动触发爬虫任务
   * @param mode 游戏模式
   */
  @Post('crawl')
  @ApiOperation({ summary: '手动触发爬虫任务' })
  async crawl(@Body() body: PostCrawlerDto): Promise<ResponseData> {
    await this.crawlerTaskService.crawlDataByMode(body.mode);
    return success(`${body.mode}模式数据爬取成功`);
  }
}
