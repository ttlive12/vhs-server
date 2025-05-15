import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostCrawlerDto } from './crawler.dto';
import { CrawlerTaskService } from './crawler.task';
import { ResponseData, success, successWithData } from '@/modules/shared';
import { HttpService } from '@/modules/shared/http/http.service';
/**
 * 爬虫任务控制器
 * 提供手动触发爬虫任务的API接口
 */
@ApiTags('爬虫任务')
@Controller('crawler')
export class CrawlerTaskController {
  constructor(
    private readonly crawlerTaskService: CrawlerTaskService,
    private readonly httpService: HttpService,
  ) {}

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

  /**
   * 测试网站反爬状态
   */
  @Get('test-anti-crawl')
  @ApiOperation({ summary: '测试网站反爬状态' })
  async testAntiCrawl(): Promise<ResponseData<{ needCloudbypass: boolean; message: string }>> {
    const needCloudbypass = await this.httpService.testAntiCrawl();
    return successWithData({
      needCloudbypass,
      message: needCloudbypass ? '网站开启了反爬机制，需要使用cloudbypass' : '网站未开启反爬机制，无需使用cloudbypass',
    });
  }
}
