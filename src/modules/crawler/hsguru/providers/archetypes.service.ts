import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';

import { parseArchetypeStats, crawlArchetypes } from '../htmlParse/meta';
import { TranslationService } from '@/modules/crawler/base/providers/translation.service';
import { InjectCrawlerModel, Archetypes } from '@/modules/database';
import { HttpService, Mode, Rank, MinGames, RANKLIST, ARCHETYPE_SEQUENCE, modifyParams, mode2Format } from '@/modules/shared';
/**
 * 卡组服务
 */
@Injectable()
export class ArchetypesService {
  private readonly logger = new Logger('卡组类型');

  constructor(
    private readonly httpService: HttpService,
    @InjectCrawlerModel(Archetypes.name) private archetypesModel: Model<Archetypes>,
    private readonly translationService: TranslationService,
  ) {}

  // 爬取卡组类型
  async crawlArchetypes(mode: Mode, rank: Rank, minGames?: MinGames): Promise<crawlArchetypes[]> {
    const url = modifyParams(`/meta`, { format: mode2Format[mode], rank, min_games: minGames });
    const html = await this.httpService.fetchGet<string>(url, {
      fetchOptions: {
        name: '卡组类型',
      },
    });
    const decks = parseArchetypeStats(html);
    return decks;
  }

  // 爬取所有卡组类型
  async crawlAllArchetypes(mode: Mode): Promise<void> {
    await this.clearArchetypes(mode);

    // 创建所有请求的任务数组
    const tasks = RANKLIST.map(async (rank) => {
      let decks;

      // 对于每个段位，尝试不同的minGames值
      for (const minGames of ARCHETYPE_SEQUENCE[rank]) {
        decks = await this.crawlArchetypes(mode, rank, minGames);
        if (decks.length >= 10) {
          this.logger.log(`段位：${rank} 场次：${minGames || 'default'}, 成功获取 ${decks.length} 个卡组`);
          break;
        }
        this.logger.log(`段位：${rank} 场次：${minGames || 'default'}, 成功获取 ${decks.length} 个卡组, 不足10个, 尝试降级获取`);
      }

      // 返回结果和相关信息，用于后续统一更新数据库
      return { rank, decks };
    });

    const results = await Promise.all(tasks);

    // 统一更新数据库
    const operations = [];
    for (const { rank, decks } of results) {
      if (decks && decks.length > 0) {
        const deckOperations = decks
          .filter((deck) => deck.winrate >= 45 || deck.popularityPercent > 0.1) // 过滤掉胜率低于45%并且人气低于0.1%的卡组
          .map((deck) => ({
            updateOne: {
              filter: { name: deck.name, rank, mode },
              update: { $set: { ...deck, rank, zhName: this.translationService.translate(deck.name), mode } },
              upsert: true,
            },
          }));
        operations.push(...deckOperations);
      }
    }

    if (operations.length > 0) {
      const result = await this.archetypesModel.bulkWrite(operations);
      this.logger.log(`批量更新数据库成功，共写入 ${result.upsertedCount} 个卡组类型`);
    }

    this.logger.log(`所有段位的卡组类型爬取完成`);
  }

  // 清空当前模式数据
  async clearArchetypes(mode: Mode): Promise<void> {
    const result = await this.archetypesModel.deleteMany({ mode });
    this.logger.log(`模式：${mode} 清空 ${result.deletedCount} 条数据`);
  }

  // 获取所有卡组类型
  async getArchetypes(mode: Mode): Promise<Archetypes[]> {
    const archetypes = await this.archetypesModel.find({ mode });
    return archetypes;
  }
}
