import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

import { ArenaCardRankResponseDto, ArenaClassRankResponseDto } from './arena.dto';
import { InjectApiModel, InjectCrawlerModel } from '@/modules/database/decorators';
import { ArenaCard, ArenaClass, Card } from '@/modules/database/schema';
import { Class } from '@/modules/shared';
import { IArenaCardWithInfo } from '@/modules/shared/interfaces';

/**
 * 竞技场服务
 * 提供竞技场数据的API服务
 */
@Injectable()
export class ArenaService {
  constructor(
    @InjectApiModel(ArenaClass.name)
    private readonly arenaClassModel: Model<ArenaClass>,
    @InjectApiModel(ArenaCard.name)
    private readonly arenaCardModel: Model<ArenaCard>,
    @InjectCrawlerModel(Card.name)
    private readonly cardModel: Model<Card>,
  ) {}

  /**
   * 获取竞技场职业胜率排名
   * @returns 职业胜率排名数据
   */
  async getArenaClassRank(): Promise<ArenaClassRankResponseDto[]> {
    const classRankData = await this.arenaClassModel.find({}, { class: 1, winRate: 1, _id: 0 }).sort({ winRate: -1 }).lean();

    if (classRankData.length === 0) {
      throw new NotFoundException('未找到竞技场职业胜率数据');
    }

    return classRankData;
  }

  /**
   * 获取竞技场卡牌排名
   * @param className 职业名称
   * @returns 卡牌排名数据
   */
  async getArenaCardRank(className?: Class): Promise<ArenaCardRankResponseDto[]> {
    // 查询卡牌数据
    const cardsData = await this.arenaCardModel.find(className ? { class: className } : {}).lean();

    if (cardsData.length === 0) {
      throw new NotFoundException(className ? `未找到职业 ${className} 的竞技场卡牌数据` : '未找到竞技场卡牌数据');
    }

    // 获取所有卡牌dbfId
    const dbfIds = cardsData.map((card) => card.dbfId);

    // 查询卡牌基础信息
    const cardInfos = await this.cardModel
      .find({ dbfId: { $in: dbfIds } }, { dbfId: 1, cost: 1, id: 1, name: 1, rarity: 1, _id: 0 })
      .lean();

    // 转换为Map以便快速查找
    const cardInfoMap = new Map(cardInfos.map((info) => [info.dbfId, info]));

    // 合并卡牌数据与基础信息
    const enhancedCardsData: IArenaCardWithInfo[] = cardsData.map((card) => {
      const cardInfo = cardInfoMap.get(card.dbfId);
      return {
        ...card,
        cost: cardInfo?.cost,
        id: cardInfo?.id,
        name: cardInfo?.name,
        rarity: cardInfo?.rarity,
      };
    });

    // 过滤掉包含流行度小于0.1或者无名字的卡牌
    const filteredCardsData = enhancedCardsData.filter((card) => card.includedPopularity >= 0.1 && card.name);

    // 按照包含胜率降序排序
    return filteredCardsData.sort((a, b) => b.includedWinrate - a.includedWinrate);
  }
}
