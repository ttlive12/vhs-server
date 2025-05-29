import { Injectable, Logger } from '@nestjs/common';
import { omit } from 'lodash';
import { Model } from 'mongoose';

import { InjectCrawlerModel } from '@/modules/database';
import { Card } from '@/modules/database/schema/card';
import { ResponseData, success, HttpService, ICard } from '@/modules/shared';
/**
 * 卡牌服务
 */
@Injectable()
export class CardsService {
  private readonly logger = new Logger('卡牌');

  constructor(
    private readonly httpService: HttpService,
    @InjectCrawlerModel(Card.name) private readonly cardModel: Model<Card>,
  ) {}

  async getCards(): Promise<ResponseData> {
    this.logger.log('开始获取卡牌数据');
    const data = await this.httpService.fetchGet<Card[]>(`https://api.hearthstonejson.com/v1/latest/zhCN/cards.json`, {
      fetchOptions: {
        name: '卡牌',
      },
    });

    // 使用bulkWrite实现upsert功能
    if (data.length > 0) {
      const bulkOps = data.map((card) => ({
        updateOne: {
          filter: { dbfId: card.dbfId },
          update: { $set: card },
          upsert: true,
        },
      }));

      const result = await this.cardModel.bulkWrite(bulkOps);
      this.logger.log(`插入数据库卡牌数据: ${result.upsertedCount} 条`);
    }

    return success('获取卡牌成功');
  }

  async getCardByDbfId(dbfId: number): Promise<ICard> {
    const card = await this.cardModel.findOne({ dbfId }, {}, { lean: true });
    if (!card) {
      throw new Error('卡牌不存在');
    }
    return card;
  }

  async getCardsByDbfId(dbfIds: number[]): Promise<ICard[]> {
    const cards = await this.cardModel.find({ dbfId: { $in: dbfIds } }, {}, { lean: true });
    return cards;
  }

  // 获取所有酒馆战旗卡牌
  async getBattlegroundsCards(): Promise<Array<Partial<ICard>>> {
    const spells = await this.cardModel.find({ isBattlegroundsPoolSpell: true }, {}, { lean: true });
    const minions = await this.cardModel.find({ isBattlegroundsPoolMinion: true }, {}, { lean: true });

    return [...spells, ...minions].map((card) => ({
      ...omit(card, [
        '_id',
        '__v',
        'cardClass',
        'text',
        'rarity',
        'createdAt',
        'updatedAt',
        'isBattlegroundsPoolSpell',
        'isBattlegroundsPoolMinion',
      ]),
    }));
  }
}
