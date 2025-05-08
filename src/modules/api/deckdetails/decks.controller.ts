import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetDeckDetailsDto } from './decks.dto';
import { DeckDetailsService } from './decks.service';
import { ResponseData, IOpponent, Rank, successWithData } from '@/modules/shared';

@ApiTags('卡组对战数据')
@Controller('deckdetails')
export class DeckDetailsController {
  constructor(private readonly deckDetailsService: DeckDetailsService) {}

  @Get('getDecks')
  @ApiOperation({ summary: '获取卡组数据' })
  @ApiResponse({ status: 200, description: '获取卡组数据成功' })
  async getDecks(@Query() query: GetDeckDetailsDto): Promise<ResponseData<Record<Rank, IOpponent[]>>> {
    const decks = await this.deckDetailsService.getDecks(query.mode, query.deckId);
    return successWithData(decks);
  }
}
