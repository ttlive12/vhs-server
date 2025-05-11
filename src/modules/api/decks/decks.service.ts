import { Injectable } from '@nestjs/common';
import groupBy from 'lodash/groupBy';
import { Model } from 'mongoose';

import { PaginatedDecksDto } from './dto/paginated-decks.dto';
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

  /**
   * 分页查询卡组
   * 支持按职业、等级和中文名称筛选
   */
  async queryDecks(queryDto: PaginatedDecksDto): Promise<{ decks: IDeck[]; total: number }> {
    const { page, pageSize, mode, class: deckClass, rank, zhName } = queryDto;
    const skip = (page - 1) * pageSize;

    // 构建查询条件
    const queryCondition: Record<string, unknown> = {};

    if (mode) {
      queryCondition['mode'] = mode;
    }

    if (deckClass) {
      queryCondition['class'] = deckClass;
    }

    if (rank) {
      queryCondition['rank'] = rank;
    }

    if (zhName) {
      queryCondition['zhName'] = { $regex: zhName, $options: 'i' };
    }

    // 执行分页查询
    const [decks, total] = await Promise.all([
      this.decksModel.find(
        queryCondition,
        {},
        {
          sort: { winrate: -1 },
          skip,
          limit: pageSize,
          lean: true,
        },
      ),
      this.decksModel.countDocuments(queryCondition),
    ]);

    return {
      decks,
      total,
    };
  }
}
