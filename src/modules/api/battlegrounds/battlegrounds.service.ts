import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

import { InjectApiModel } from '@/modules/database/decorators';
import { BattlegroundsComp, BattlegroundsCompDetail } from '@/modules/database/schema';

/**
 * 竞技场服务
 * 提供竞技场数据的API服务
 */
@Injectable()
export class BattlegroundService {
  constructor(
    @InjectApiModel(BattlegroundsComp.name)
    private readonly battlegroundClassModel: Model<BattlegroundsComp>,
    @InjectApiModel(BattlegroundsCompDetail.name)
    private readonly battlegroundCompDetailModel: Model<BattlegroundsCompDetail>,
  ) {}

  /**
   * 获取酒馆战旗流派
   */
  async getBattlegroundClassRank(): Promise<BattlegroundsComp[]> {
    const classRankData = await this.battlegroundClassModel.find({}).lean();

    if (classRankData.length === 0) {
      throw new NotFoundException('未找到酒馆战旗流派数据');
    }

    return classRankData.filter((item: BattlegroundsComp) => !item.comp_hidden);
  }

  /**
   * 获取酒馆战旗流派详情
   * @param compId 流派ID
   * @returns 流派详情数据
   */
  async getBattlegroundCompDetail(compId: number): Promise<BattlegroundsCompDetail> {
    // 查询卡牌数据
    const cardsData = await this.battlegroundCompDetailModel.findOne({ comp_id: compId }).lean();

    if (!cardsData) {
      throw new NotFoundException(`未找到流派 ${compId} 的详情数据`);
    }

    return cardsData;
  }
}
