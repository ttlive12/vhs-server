import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';

import { InjectCrawlerModel } from '@/modules/database';
import { ArenaCard, ArenaClass } from '@/modules/database/schema';
import { Class, HttpService } from '@/modules/shared';
import { IArenaCard, IArenaClass } from '@/modules/shared/interfaces';

interface IArenaClassPerformanceResponse {
  series: {
    data: {
      BGT_ARENA: Record<
        Class,
        {
          win_rate: number;
        }
      >;
    };
  };
}

export interface IArenaCardResponse {
  dbf_id: number;
  included_count: number;
  included_popularity: number;
  included_winrate: number;
  winrate_when_played: number;
  times_played: number;
}

interface IArenaCardsResponse {
  series: {
    data: Record<Class, IArenaCardResponse[]>;
  };
}
/**
 * 竞技场服务
 * 提供从HSReplay爬取竞技场数据的功能
 */
@Injectable()
export class ArenaService {
  private readonly logger = new Logger(ArenaService.name);

  private readonly classPerformanceUrl = '/analytics/query/player_class_performance_summary_v2/';
  private readonly arenaCardsUrl = '/analytics/query/card_list_free/?GameType=ARENA&TimeRange=CURRENT_EXPANSION';

  constructor(
    private readonly httpService: HttpService,
    @InjectCrawlerModel(ArenaClass.name)
    private readonly arenaClassModel: Model<ArenaClass>,
    @InjectCrawlerModel(ArenaCard.name)
    private readonly arenaCardModel: Model<ArenaCard>,
  ) {}

  /**
   * 爬取竞技场职业胜率数据
   * @returns 职业胜率数据数组
   */
  async crawlArenaClassPerformance(): Promise<IArenaClass[]> {
    this.logger.log('开始爬取竞技场职业胜率数据');

    const response = await this.httpService.fetchGet<IArenaClassPerformanceResponse>(this.classPerformanceUrl);

    const arenaData = response.series.data.BGT_ARENA;
    const classPerformanceData: IArenaClass[] = [];

    // 将对象转换为数组形式
    for (const [className, classData] of Object.entries(arenaData)) {
      classPerformanceData.push({
        class: className,
        winRate: classData.win_rate,
      });
    }

    this.logger.log(`成功爬取 ${classPerformanceData.length} 个竞技场职业胜率数据`);
    return classPerformanceData;
  }

  /**
   * 爬取竞技场卡牌数据
   * @returns 职业卡牌数据对象
   */
  async crawlArenaCards(): Promise<Record<string, IArenaCard[]>> {
    this.logger.log('开始爬取竞技场卡牌数据');

    const response = await this.httpService.fetchGet<IArenaCardsResponse>(this.arenaCardsUrl);

    const arenaCardsData = response.series.data;

    const classCardsData: Record<string, IArenaCard[]> = {};

    // 处理每个职业的卡牌数据
    for (const [className, cardsData] of Object.entries(arenaCardsData)) {
      if (!Array.isArray(cardsData)) continue;

      classCardsData[className] = cardsData
        .map((card: IArenaCardResponse) => ({
          class: className,
          dbfId: card.dbf_id,
          includedCount: card.included_count,
          includedPopularity: card.included_popularity,
          includedWinrate: card.included_winrate,
          winrateWhenPlayed: card.winrate_when_played,
          timesPlayed: card.times_played,
        }))
        .filter((card) => card.timesPlayed >= 10);
    }

    this.logger.log(`成功爬取 ${Object.keys(classCardsData).length} 个职业的竞技场卡牌数据`);

    return classCardsData;
  }

  /**
   * 保存竞技场职业胜率数据到数据库
   * @param classPerformanceData 职业胜率数据数组
   */
  async saveArenaClassPerformance(classPerformanceData: IArenaClass[]): Promise<void> {
    this.logger.log('开始保存竞技场职业胜率数据');

    // 清除之前的数据
    await this.arenaClassModel.deleteMany({});

    // 插入新数据
    await this.arenaClassModel.insertMany(classPerformanceData);

    this.logger.log(`成功保存 ${classPerformanceData.length} 个竞技场职业胜率数据`);
  }

  /**
   * 保存竞技场卡牌数据到数据库
   * @param classCardsData 职业卡牌数据对象
   */
  async saveArenaCards(classCardsData: Record<string, IArenaCard[]>): Promise<void> {
    this.logger.log('开始保存竞技场卡牌数据');

    // 清除之前的数据
    await this.arenaCardModel.deleteMany({});

    // 准备所有卡牌数据
    const allCards: IArenaCard[] = [];
    for (const cardsData of Object.values(classCardsData)) {
      allCards.push(...cardsData);
    }

    // 插入新数据
    await this.arenaCardModel.insertMany(allCards);

    this.logger.log(`成功保存 ${allCards.length} 个竞技场卡牌数据`);
  }

  /**
   * 爬取并保存竞技场数据
   */
  async crawlAllArenaData(): Promise<void> {
    this.logger.log('开始爬取所有竞技场数据');

    // 爬取并保存职业胜率数据
    const classPerformanceData = await this.crawlArenaClassPerformance();
    await this.saveArenaClassPerformance(classPerformanceData);

    // 爬取并保存卡牌数据
    const classCardsData = await this.crawlArenaCards();
    await this.saveArenaCards(classCardsData);

    this.logger.log('所有竞技场数据爬取完成');
  }
}
