import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CardsService } from '../providers/cards.service';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  @ApiOperation({ summary: '获取卡牌' })
  @ApiResponse({
    status: 200,
    description: '获取卡牌成功',
  })
  async getCards(): Promise<void> {
    await this.cardsService.getCards();
  }
}
