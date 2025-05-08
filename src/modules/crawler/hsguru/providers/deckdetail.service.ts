// 爬取卡组对战数据
import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { parseDeckDetails } from '../htmlParse/deckdetails';
import { InjectCrawlerModel } from '@/modules/database/decorators';
import { DeckDetails, Deck } from '@/modules/database/schema';
import { modifyParams, Rank, HttpService, Mode, IDeckDetails } from '@/modules/shared';

@Injectable()
export class DeckDetailService {
  private readonly logger = new Logger('卡组对战');
  constructor(
    @InjectCrawlerModel(DeckDetails.name) private readonly deckDetailsModel: Model<DeckDetails>,
    @InjectCrawlerModel(Deck.name) private readonly decksModel: Model<Deck>,
    private readonly httpService: HttpService,
  ) {}

  async crawlDeckDetails(deckId: string, mode: Mode, rank: Rank): Promise<IDeckDetails> {
    const url = modifyParams(`/deck/${deckId}`, {
      rank,
    });

    const html = await this.httpService.fetchGet<string>(url, {
      fetchOptions: {
        name: '卡组对战',
      },
    });
    const deckDetails = parseDeckDetails(html);

    return {
      deckId,
      mode,
      rank,
      opponents: deckDetails,
    };
  }

  async crawlAllDeckDetails(mode: Mode): Promise<void> {
    await this.clearDeckDetails(mode);
    const decks = await this.decksModel.find({ mode }, {}, { lean: true });

    const tasks = decks.map(async (deck) => {
      const result = await this.crawlDeckDetails(deck.deckId, mode, deck.rank);
      return result;
    });

    const results = await Promise.all(tasks);

    const operations = results.map((data) => ({
      updateOne: {
        filter: { deckId: data.deckId, mode: data.mode, rank: data.rank },
        update: { $set: data },
        upsert: true,
      },
    }));

    if (operations.length > 0) {
      const result = await this.deckDetailsModel.bulkWrite(operations);
      this.logger.log(`批量更新数据库成功，共写入 ${result.upsertedCount} 个卡组对战数据`);
    }

    this.logger.log(`所有卡组对战数据爬取完成`);
  }

  // 清空当前模式数据
  async clearDeckDetails(mode: Mode): Promise<void> {
    const result = await this.deckDetailsModel.deleteMany({ mode });
    this.logger.log(`模式：${mode} 清空 ${result.deletedCount} 条数据`);
  }
}
