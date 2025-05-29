import { CacheTTL, CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Post, Get, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CardsService } from '../providers/cards.service';
import { ResponseData, successWithData } from '@/modules/shared';
import { ICard } from '@/modules/shared/interfaces';
@ApiTags('卡牌')
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post('getCards')
  @ApiOperation({ summary: '爬取卡牌数据' })
  @ApiResponse({
    status: 200,
    description: '爬取卡牌数据成功',
  })
  async getCards(): Promise<ResponseData> {
    return await this.cardsService.getCards();
  }

  @Get('getBattlegroundsCards')
  @ApiOperation({ summary: '获取所有酒馆战旗卡牌' })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(1800)
  @ApiResponse({
    status: 200,
    description: '获取所有酒馆战旗卡牌成功',
  })
  async getBattlegroundsCards(): Promise<ResponseData<Array<Partial<ICard>>>> {
    const cards = await this.cardsService.getBattlegroundsCards();
    return successWithData(cards);
  }
}
