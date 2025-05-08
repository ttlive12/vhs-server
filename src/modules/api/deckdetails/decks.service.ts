import { Injectable } from '@nestjs/common';
import groupBy from 'lodash/groupBy';
import { Model } from 'mongoose';

import { InjectApiModel } from '@/modules/database/decorators';
import { DeckDetails } from '@/modules/database/schema/deck-details';
import { Mode, Rank } from '@/modules/shared';
import { IDeckDetails, IOpponent } from '@/modules/shared/interfaces/deckdetails';
/**
 * 卡组服务
 * 提供卡组数据查询功能
 */
@Injectable()
export class DeckDetailsService {
  constructor(@InjectApiModel(DeckDetails.name) private deckDetailsModel: Model<DeckDetails>) {}

  async getDecks(mode: Mode, deckId: string): Promise<Record<Rank, IOpponent[]>> {
    const decks = await this.deckDetailsModel.find({ mode, deckId }, {}, { lean: true });
    const groupedDecks = groupBy<IDeckDetails>(decks, 'rank') as Record<Rank, IDeckDetails[]>;
    return this.convertToCardStats(groupedDecks);
  }

  /**
   * 将按Rank分组的IDeckDetails数组转换为按Rank分组的ICardStat数组
   * @param deckDetails 按Rank分组的IDeckDetails数组
   * @returns 按Rank分组的ICardStat数组
   */
  private convertToCardStats(deckDetails: Record<Rank, IDeckDetails[]>): Record<Rank, IOpponent[]> {
    const result: Record<Rank, IOpponent[]> = {} as Record<Rank, IOpponent[]>;

    Object.entries(deckDetails).forEach(([rank, deckDetailsArray]) => {
      // 由于每个Rank下只有一个IDeckDetails，我们直接取第一个元素的cards
      result[rank as Rank] = deckDetailsArray[0]?.opponents;
    });

    return result;
  }
}
