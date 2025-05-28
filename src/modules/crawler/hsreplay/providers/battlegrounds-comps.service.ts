import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';

import { parseBattlegroundsComps } from '../htmlParse';
import { InjectCrawlerModel } from '@/modules/database';
import { BattlegroundsComp } from '@/modules/database/schema';
import { HttpService } from '@/modules/shared';
import { IBattlegroundsComp } from '@/modules/shared/interfaces';

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
   * 爬取并保存所有战棋流派数据
   */
  async crawlAllBattlegroundsComps(): Promise<void> {
    this.logger.log('开始爬取所有战棋流派数据');

    // 爬取流派数据
    const compsData = await this.crawlBattlegroundsComps();

    // 保存到数据库
    await this.saveBattlegroundsComps(compsData);

    this.logger.log('所有战棋流派数据爬取完成');
  }
}
