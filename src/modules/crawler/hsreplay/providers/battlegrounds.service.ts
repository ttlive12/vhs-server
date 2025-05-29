import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';

import { parseBattlegroundsComps, parseBattlegroundsCompDetail } from '../htmlParse';
import { InjectCrawlerModel } from '@/modules/database';
import { BattlegroundsComp, BattlegroundsCompDetail } from '@/modules/database/schema';
import { HttpService } from '@/modules/shared';
import { IBattlegroundsComp, IBattlegroundsCompDetail } from '@/modules/shared/interfaces';
/**
 * 战棋流派服务
 * 提供从HSReplay爬取战棋流派数据的功能
 */
@Injectable()
export class BattlegroundsCompsService {
  private readonly logger = new Logger(BattlegroundsCompsService.name);

  private readonly battlegroundsCompsUrl = '/battlegrounds/comps/?hl=zh-hans';

  constructor(
    private readonly httpService: HttpService,
    @InjectCrawlerModel(BattlegroundsComp.name)
    private readonly battlegroundsCompModel: Model<BattlegroundsComp>,
    @InjectCrawlerModel(BattlegroundsCompDetail.name)
    private readonly battlegroundsCompDetailModel: Model<BattlegroundsCompDetail>,
  ) {}

  /**
   * 爬取战棋流派数据
   * @returns 战棋流派数据数组
   */
  async crawlBattlegroundsComps(): Promise<IBattlegroundsComp[]> {
    this.logger.log('开始爬取战棋流派数据');

    // 获取HTML页面
    const htmlContent = await this.httpService.fetchGet<string>(this.battlegroundsCompsUrl);

    // 解析HTML获取流派数据
    const compsData = parseBattlegroundsComps(htmlContent);

    this.logger.log(`成功爬取 ${compsData.length} 个战棋流派数据`);
    return compsData;
  }

  /**
   * 爬取具体战棋流派详细数据
   * @param compId 流派ID
   * @returns 战棋流派详细数据
   */
  async crawlBattlegroundsCompDetail(compId: number): Promise<IBattlegroundsCompDetail> {
    this.logger.log(`开始爬取流派ID ${compId} 的详细数据`);

    const detailUrl = `/battlegrounds/comps/${compId}/?hl=zh-hans`;

    // 获取HTML页面
    const htmlContent = await this.httpService.fetchGet<string>(detailUrl);

    // 解析HTML获取流派详细数据
    const compDetailData = parseBattlegroundsCompDetail(htmlContent);

    this.logger.log(`成功爬取流派ID ${compId} 的详细数据`);
    return compDetailData;
  }

  /**
   * 保存战棋流派数据到数据库
   * @param compsData 战棋流派数据数组
   */
  async saveBattlegroundsComps(compsData: IBattlegroundsComp[]): Promise<void> {
    this.logger.log('开始保存战棋流派数据');

    // 使用upsert方式更新数据，避免重复
    const bulkOps = compsData.map((comp) => ({
      updateOne: {
        filter: { comp_id: comp.comp_id },
        update: { $set: comp },
        upsert: true,
      },
    }));

    if (bulkOps.length > 0) {
      const result = await this.battlegroundsCompModel.bulkWrite(bulkOps);
      this.logger.log(`成功保存战棋流派数据: 插入 ${result.upsertedCount} 个，更新 ${result.modifiedCount} 个`);
    }
  }

  /**
   * 保存战棋流派详细数据到数据库
   * @param compDetailData 战棋流派详细数据
   */
  async saveBattlegroundsCompDetail(compDetailData: IBattlegroundsCompDetail): Promise<void> {
    this.logger.log(`开始保存流派ID ${compDetailData.comp_id} 的详细数据`);

    // 使用upsert方式更新数据，避免重复
    await this.battlegroundsCompDetailModel.updateOne({ comp_id: compDetailData.comp_id }, { $set: compDetailData }, { upsert: true });

    this.logger.log(`成功保存流派ID ${compDetailData.comp_id} 的详细数据`);
  }

  /**
   * 爬取并保存所有战棋流派数据
   */
  async crawlAllBattlegroundsComps(): Promise<IBattlegroundsComp[]> {
    this.logger.log('开始爬取所有战棋流派数据');

    // 爬取流派数据
    const compsData = await this.crawlBattlegroundsComps();

    // 保存到数据库
    await this.saveBattlegroundsComps(compsData);

    this.logger.log('所有战棋流派数据爬取完成');

    return compsData;
  }

  /**
   * 爬取并保存具体战棋流派详细数据
   * @param compId 流派ID
   */
  async crawlAndSaveBattlegroundsCompDetail(compId: number): Promise<void> {
    this.logger.log(`开始爬取并保存流派ID ${compId} 的详细数据`);

    // 爬取流派详细数据
    const compDetailData = await this.crawlBattlegroundsCompDetail(compId);

    // 保存到数据库
    await this.saveBattlegroundsCompDetail(compDetailData);

    this.logger.log(`流派ID ${compId} 的详细数据爬取完成`);
  }

  /**
   * 爬取并保存所有战棋流派详细数据
   */
  async crawlAndSaveAllBattlegroundsCompDetails(): Promise<void> {
    this.logger.log('开始爬取并保存所有战棋流派详细数据');

    // 删除所有战棋数据
    await this.battlegroundsCompModel.deleteMany({});
    await this.battlegroundsCompDetailModel.deleteMany({});

    // 爬取所有流派数据
    const compsData = await this.crawlAllBattlegroundsComps();

    // 保存所有流派详细数据
    await Promise.all(
      compsData.map(async (comp) => {
        await this.crawlAndSaveBattlegroundsCompDetail(comp.comp_id);
      }),
    );

    this.logger.log('所有战棋流派详细数据爬取完成');
  }
}
