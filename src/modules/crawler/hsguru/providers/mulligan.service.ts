// 爬取卡组数据
import { Injectable, Logger } from '@nestjs/common';
import pick from 'lodash/pick';
import { Model } from 'mongoose';
import { parseMulligan } from '../htmlParse';
import { ArchetypesService } from './archetypes.service';
import { CardsService } from '@/modules/crawler/base';
import { InjectCrawlerModel } from '@/modules/database/decorators';
import { CardStats } from '@/modules/database/schema';
import { HttpService, Rank, modifyParams, Mode, IMulligan } from '@/modules/shared';
@Injectable()
export class MulliganService {
  private readonly logger = new Logger('留牌指南');
  constructor(
    private readonly httpService: HttpService,
    private readonly cardsService: CardsService,
    private readonly archetypeService: ArchetypesService,
    @InjectCrawlerModel(CardStats.name) private readonly cardStatModel: Model<CardStats>,
  ) {}

  async crawlMulligan(archetype: string, rank: Rank, mode: Mode): Promise<IMulligan> {
    const url = modifyParams(`/card-stats`, {
      archetype,
      rank,
    });

    const html = await this.httpService.fetchGet<string>(url, {
      fetchOptions: {
        name: '留牌指南',
      },
    });
    const cards = parseMulligan(html);

    const cardStats = await Promise.all(
      cards.map(async (card) => ({
        ...pick(await this.cardsService.getCardByDbfId(card.dbfId), ['id', 'dbfId', 'name', 'cost', 'rarity']),
        mulliganImpact: card.mulliganImpact,
        drawnImpact: card.drawnImpact,
        keptImpact: card.keptImpact,
      })),
    );

    // 返回处理结果，不直接更新数据库
    return { name: archetype, rank, mode, cards: cardStats };
  }

  async crawlAllMulligan(mode: Mode): Promise<void> {
    await this.clearMulligan(mode);
    const archetypes = await this.archetypeService.getArchetypes(mode);

    // 创建所有爬取任务，HTTP模块内部会通过队列管理并发
    const tasks = archetypes.map(async (archetype) => {
      const result = await this.crawlMulligan(archetype.name, archetype.rank, mode);
      return result;
    });

    // 等待所有任务完成
    const results = await Promise.all(tasks);

    // 统一更新数据库
    const operations = results.map((data) => ({
      updateOne: {
        filter: { name: data.name, rank: data.rank, mode },
        update: { $set: data },
        upsert: true,
      },
    }));

    if (operations.length > 0) {
      const result = await this.cardStatModel.bulkWrite(operations);
      this.logger.log(`批量更新数据库成功，共写入 ${result.upsertedCount} 个卡组留牌指南`);
    }

    this.logger.log(`所有卡组留牌指南爬取完成`);
  }

  // 清空当前模式数据
  async clearMulligan(mode: Mode): Promise<void> {
    const result = await this.cardStatModel.deleteMany({ mode });
    this.logger.log(`模式：${mode} 清空 ${result.deletedCount} 条数据`);
  }
}
