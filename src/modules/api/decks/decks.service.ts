import { Injectable } from '@nestjs/common';
import groupBy from 'lodash/groupBy';
import { Model } from 'mongoose';

import { InjectApiModel } from '@/modules/database/decorators';
import { Deck } from '@/modules/database/schema/deck';
import { Mode, Rank } from '@/modules/shared';
import { IDeck } from '@/modules/shared/interfaces/decks';
/**
 * 卡组服务
 * 提供卡组数据查询功能
 */
@Injectable()
export class DecksService {
  constructor(@InjectApiModel(Deck.name) private decksModel: Model<Deck>) {}

  async getDecks(mode: Mode, archetype: string): Promise<Record<Rank, IDeck[]>> {
    const decks = await this.decksModel.find({ mode, name: archetype }, {}, { sort: { winrate: -1 }, lean: true });
    const groupedDecks = groupBy<IDeck>(decks, 'rank') as Record<Rank, IDeck[]>;
    return groupedDecks;
  }
}
