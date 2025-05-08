// 爬取卡组对战数据
import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostDeckDetailsDto } from '../dto';
import { DeckDetailService } from '../providers/deckdetail.service';
import { ResponseData, success } from '@/modules/shared';

@ApiTags('卡组对战数据')
@Controller('deckdetail')
export class DeckDetailController {
  constructor(private readonly deckDetailService: DeckDetailService) {}

  @ApiOperation({ summary: '爬取所有卡组对战数据' })
  @Post('crawlAllDeckDetails')
  async crawlAllDeckDetails(@Body() dto: PostDeckDetailsDto): Promise<ResponseData> {
    const { mode } = dto;
    await this.deckDetailService.crawlAllDeckDetails(mode);
    return success('爬取所有卡组对战数据成功');
  }
}
