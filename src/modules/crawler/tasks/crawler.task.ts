import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { CardsService } from '../base/providers/cards.service';
import { TranslationService } from '../base/providers/translation.service';
import { ArchetypesService } from '../hsguru/providers/archetypes.service';
import { DeckDetailService } from '../hsguru/providers/deckdetail.service';
import { DecksService } from '../hsguru/providers/decks.service';
import { MulliganService } from '../hsguru/providers/mulligan.service';
import { ArenaService } from '../hsreplay/providers';
import { InjectApiModel } from '@/modules/database';
import { DatabaseService } from '@/modules/database/database.service';
import { Config } from '@/modules/database/schema';
import { Mode } from '@/modules/shared';

/**
 * 爬虫定时任务服务
 * 提供卡组数据爬取功能，支持标准/狂野/竞技场模式
 */
@Injectable()
export class CrawlerTaskService {
  private readonly logger = new Logger('爬虫任务服务');

  // eslint-disable-next-line @typescript-eslint/max-params
  constructor(
    private readonly cardsService: CardsService,
    private readonly translationService: TranslationService,
    private readonly archetypesService: ArchetypesService,
    private readonly decksService: DecksService,
    private readonly mulliganService: MulliganService,
    private readonly deckDetailService: DeckDetailService,
    private readonly databaseService: DatabaseService,
    private readonly arenaService: ArenaService,
    @InjectApiModel(Config.name)
    private readonly configModel: Model<Config>,
  ) {}

  /**
   * 更新最后更新时间
   */
  private async updateLastUpdateTime(): Promise<void> {
    const now = new Date();
    await this.configModel.findOneAndUpdate({ type: 'lastUpdate' }, { lastUpdateTime: now }, { upsert: true, new: true });
    this.logger.log(`最后更新时间已更新: ${now.toISOString()}`);
  }

  /**
   * 标准模式数据爬取 - 每天早上5点
   */
  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  async handleStandardCrawlTask(): Promise<void> {
    this.logger.log('开始执行标准模式爬虫任务');
    await this.crawlDataByMode(Mode.STANDARD);
    this.logger.log('标准模式爬虫任务执行完成');
  }

  /**
   * 狂野模式数据爬取 - 每两天中午12点
   */
  @Cron('0 12 */2 * *')
  async handleWildCrawlTask(): Promise<void> {
    this.logger.log('开始执行狂野模式爬虫任务');
    await this.crawlDataByMode(Mode.WILD);
    this.logger.log('狂野模式爬虫任务执行完成');
  }

  /**
   * 竞技场模式数据爬取 - 每天晚上6点
   */
  @Cron(CronExpression.EVERY_DAY_AT_6PM)
  async handleArenaCrawlTask(): Promise<void> {
    this.logger.log('开始执行竞技场模式爬虫任务');
    await this.crawlArenaData();
    this.logger.log('竞技场模式爬虫任务执行完成');
  }

  /**
   * 爬取指定模式的数据
   * @param mode 游戏模式（标准/狂野/全部）
   */
  async crawlDataByMode(mode: Mode | 'all'): Promise<void> {
    this.logger.log(`开始爬取${mode}模式数据`);

    if (mode === 'all') {
      await this.crawlAllData();
    } else {
      // 根据模式爬取数据的具体实现
      await this.processCrawlingForMode(mode);
    }

    // 更新最后更新时间
    await this.updateLastUpdateTime();

    this.logger.log(`${mode}模式数据爬取完成`);
  }

  /**
   * 爬取竞技场数据
   */
  async crawlArenaData(): Promise<void> {
    const start = new Date();
    this.logger.log(`开始爬取竞技场模式数据, 当前时间: ${start.toISOString()}`);

    // 基础数据爬取：卡牌数据，翻译数据
    await this.cardsService.getCards();

    // 爬取竞技场数据
    await this.arenaService.crawlAllArenaData();

    // 同步数据到api数据库
    await this.databaseService.syncCrawlerToApi();

    // 更新最后更新时间
    await this.updateLastUpdateTime();

    this.logger.log(`竞技场模式数据爬取完成, 当前时间: ${new Date().toISOString()}, 耗时: ${(Date.now() - start.getTime()) / 1000}秒`);
  }

  /**
   * 爬取所有模式的数据
   */
  private async crawlAllData(): Promise<void> {
    this.logger.log('开始爬取所有模式数据');

    // 串行爬取不同模式的数据
    await this.processCrawlingForMode(Mode.STANDARD);
    await this.processCrawlingForMode(Mode.WILD);
    await this.crawlArenaData();

    this.logger.log('所有模式数据爬取完成');
  }

  /**
   * 处理指定模式的爬取逻辑
   * @param mode 游戏模式
   */
  private async processCrawlingForMode(mode: Mode): Promise<void> {
    const start = new Date();
    this.logger.log(`开始爬取${mode}模式数据, 当前时间: ${start.toISOString()}`);

    // 基础数据爬取：卡牌数据，翻译数据
    await this.cardsService.getCards();
    await this.translationService.refreshTranslationCache();

    // 卡组类型爬取
    await this.archetypesService.crawlAllArchetypes(mode);

    // 卡组爬取
    await this.decksService.crawlAllDecks(mode);

    // 留牌指南爬取
    await this.mulliganService.crawlAllMulligan(mode);

    // 卡组对战数据爬取
    await this.deckDetailService.crawlAllDeckDetails(mode);

    // 同步数据到api数据库
    await this.databaseService.syncCrawlerToApi();

    this.logger.log(`${mode}模式数据爬取完成, 当前时间: ${new Date().toISOString()}, 耗时: ${(Date.now() - start.getTime()) / 1000}秒`);
  }
}
