import { Injectable } from '@nestjs/common';
import groupBy from 'lodash/groupBy';
import { Model } from 'mongoose';

import { CardStats } from '@/modules/database';
import { InjectApiModel } from '@/modules/database/decorators';
import { IMulligan, Mode, Rank, ICardStat } from '@/modules/shared';
/**
 * 留牌指南服务
 * 提供留牌指南数据查询功能
 */
@Injectable()
export class MulliganService {
  constructor(@InjectApiModel(CardStats.name) private cardStatsModel: Model<CardStats>) {}

  async getDecks(mode: Mode, archetype: string): Promise<Record<Rank, ICardStat[]>> {
    const cardStatsModal = await this.cardStatsModel.find({ mode, name: archetype }, {}, { lean: true });
    const groupedDecks = groupBy<IMulligan>(cardStatsModal, 'rank') as Record<Rank, IMulligan[]>;
    return this.convertToCardStats(groupedDecks);
  }

  /**
   * 将按Rank分组的IMulligan数组转换为按Rank分组的ICardStat数组
   * @param mulligans 按Rank分组的IMulligan数组
   * @returns 按Rank分组的ICardStat数组
   */
  private convertToCardStats(mulligans: Record<Rank, IMulligan[]>): Record<Rank, ICardStat[]> {
    const result: Record<Rank, ICardStat[]> = {} as Record<Rank, ICardStat[]>;

    Object.entries(mulligans).forEach(([rank, mulliganArray]) => {
      // 由于每个Rank下只有一个IMulligan，我们直接取第一个元素的cards
      result[rank as Rank] = mulliganArray[0]?.cards;
    });

    return result;
  }
}
