import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { DecksService } from './decks.service';
import { GetDecksDto } from './dto';
import { ResponseData, IDeck, Rank, successWithData } from '@/modules/shared';

@ApiTags('卡组')
@Controller('decks')
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Get('getDecks')
  @ApiOperation({ summary: '获取卡组数据' })
  @ApiResponse({ status: 200, description: '获取卡组数据成功' })
  async getDecks(@Query() query: GetDecksDto): Promise<ResponseData<Record<Rank, IDeck[]>>> {
    const decks = await this.decksService.getDecks(query.mode, query.archetype);
    return successWithData(decks);
  }
}
