import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { DecksService } from './decks.service';
import { GetDecksDto, PaginatedDecksDto } from './dto';
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

  @Get('queryDecks')
  @ApiOperation({ summary: '分页查询卡组' })
  @ApiResponse({ status: 200, description: '查询卡组成功' })
  async queryDecks(@Query() query: PaginatedDecksDto): Promise<ResponseData<{ decks: IDeck[]; total: number }>> {
    const result = await this.decksService.queryDecks(query);
    return successWithData(result);
  }
}
