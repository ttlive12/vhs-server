import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CardsService } from '../providers/cards.service';
import { ResponseData } from '@/modules/shared';

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
}
