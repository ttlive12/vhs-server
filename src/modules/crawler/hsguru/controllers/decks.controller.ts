// 爬取卡组
import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';

import { PostDecksDto } from '../dto/decks.dto';
import { DecksService } from '../providers/decks.service';
import { ResponseData, success } from '@/modules/shared';

@ApiTags('卡组')
@Controller('decks')
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Post('postAllDecks')
  @ApiOperation({ summary: '爬取所有卡组' })
  @ApiBody({ type: PostDecksDto })
  async postAllDecks(@Body() dto: PostDecksDto): Promise<ResponseData> {
    const { mode } = dto;
    await this.decksService.crawlAllDecks(mode);
    return success('爬取卡组成功');
  }
}
