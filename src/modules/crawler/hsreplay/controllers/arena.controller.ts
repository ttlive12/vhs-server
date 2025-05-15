import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ArenaService } from '../providers';
import { ResponseData, success } from '@/modules/shared';

/**
 * 竞技场爬虫控制器
 */
@ApiTags('竞技场')
@Controller('arena')
export class ArenaController {
  constructor(private readonly arenaService: ArenaService) {}

  /**
   * 爬取竞技场职业胜率数据
   */
  @Post('crawl-class-performance')
  @ApiOperation({ summary: '爬取竞技场职业胜率数据' })
  async crawlArenaClassPerformance(): Promise<ResponseData> {
    const classPerformanceData = await this.arenaService.crawlArenaClassPerformance();
    await this.arenaService.saveArenaClassPerformance(classPerformanceData);

    return success(`成功爬取 ${classPerformanceData.length} 个竞技场职业胜率数据`);
  }

  /**
   * 爬取竞技场卡牌数据
   */
  @Post('crawl-cards')
  @ApiOperation({ summary: '爬取竞技场卡牌数据' })
  async crawlArenaCards(): Promise<ResponseData> {
    const classCardsData = await this.arenaService.crawlArenaCards();
    await this.arenaService.saveArenaCards(classCardsData);

    return success(`成功爬取 ${Object.keys(classCardsData).length} 个职业的竞技场卡牌数据`);
  }

  /**
   * 爬取所有竞技场数据
   */
  @Post('crawl-all')
  @ApiOperation({ summary: '爬取所有竞技场数据' })
  async crawlAllArenaData(): Promise<ResponseData> {
    await this.arenaService.crawlAllArenaData();

    return success('所有竞技场数据爬取完成');
  }
}
