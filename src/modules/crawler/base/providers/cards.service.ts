import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Card } from '@/modules/database/schema/card';
import { HttpService } from '@/modules/shared/http/http.service';

/**
 * 卡牌服务
 */
@Injectable()
export class CardsService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Card.name) private readonly cardModel: Model<Card>,
  ) {}

  async getCards(): Promise<void> {
    const data = await this.httpService.get<Card[]>(`https://api.hearthstonejson.com/v1/latest/zhCN/cards.json`);

    // 写入数据库
    await this.cardModel.updateMany(data, { upsert: true });
  }
}
