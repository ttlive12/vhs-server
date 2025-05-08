import { Injectable, Logger } from '@nestjs/common';
import { decode } from 'deckstrings';
import { pick } from 'lodash';
import { Model } from 'mongoose';

import { ArchetypesService } from './archetypes.service';
import { parseDecks } from '../htmlParse/decks';
import { CardsService, TranslationService } from '@/modules/crawler/base';
import { InjectCrawlerModel } from '@/modules/database/decorators';
import { Deck } from '@/modules/database/schema/deck';
import { DECK_SEQUENCE, HttpService, MinGames, Mode, Rank, mode2Format, modifyParams } from '@/modules/shared';
import { IDeckCard } from '@/modules/shared/interfaces/cards';
import { IDeck } from '@/modules/shared/interfaces/decks';
/**
 * 卡组服务
 */
@Injectable()
export class DecksService {
  private readonly logger = new Logger('卡组信息');
  // eslint-disable-next-line @typescript-eslint/max-params
  constructor(
    private readonly httpService: HttpService,
    private readonly cardsService: CardsService,
    private readonly translationService: TranslationService,
    private readonly archetypesService: ArchetypesService,
    @InjectCrawlerModel(Deck.name) private decksModel: Model<Deck>,
  ) {}

  async crawlDecks(archetype: string, mode: Mode, rank: Rank, minGames?: MinGames): Promise<IDeck[]> {
    const url = modifyParams(`/decks`, {
      format: mode2Format[mode],
      rank,
      min_games: minGames,
      'player_deck_archetype[]': archetype,
    });
    const html = await this.httpService.fetchGet<string>(url, {
      fetchOptions: {
        name: '卡组信息',
      },
    });
    const decks = parseDecks(html);
    const decksInfo = await Promise.all(
      decks.map(async (deck) => {
        const deckcode = deck.deckcode;
        const cards = await this.parseDeckcode(deckcode);
        return {
          ...deck,
          cards,
          zhName: this.translationService.translate(deck.name),
        };
      }),
    );
    return decksInfo;
  }

  async parseDeckcode(deckcode: string): Promise<IDeckCard[]> {
    const deck = decode(deckcode);
    const { cards } = deck;
    const cardsInfo = await Promise.all(
      cards.map(async (card) => {
        const [dbfId, count] = card;
        const cardInfo = await this.cardsService.getCardByDbfId(dbfId);
        return {
          ...pick(cardInfo, ['id', 'dbfId', 'name', 'cost', 'rarity']),
          count,
        };
      }),
    );
    return cardsInfo;
  }

  async crawlAllDecks(mode: Mode): Promise<void> {
    await this.clearDecks(mode);
    const archetypes = await this.archetypesService.getArchetypes(mode);
    this.logger.log(`模式：${mode} 获取 ${archetypes.length} 个卡组类型`);

    const tasks = archetypes.map(async (archetype) => {
      let decks;
      const name = String(archetype.name);
      const rank = archetype.rank;

      for (const minGames of DECK_SEQUENCE[rank]) {
        decks = await this.crawlDecks(name, mode, rank, minGames);
        if (decks.length >= 3) {
          break;
        }
      }

      // 返回结果和相关信息，用于后续统一更新数据库
      return { decks, rank };
    });

    // 等待所有任务完成
    const results = await Promise.all(tasks);

    // 统一更新数据库
    const operations = [];
    for (const { decks, rank } of results) {
      if (decks && decks.length > 0) {
        const deckOperations = decks.map((deck) => ({
          updateOne: {
            filter: { deckId: deck.deckId, rank, mode },
            update: { $set: { ...deck, rank, mode } },
            upsert: true,
          },
        }));
        operations.push(...deckOperations);
      }
    }

    if (operations.length > 0) {
      const result = await this.decksModel.bulkWrite(operations);
      this.logger.log(`批量更新数据库成功，共写入 ${result.upsertedCount} 个卡组`);
    }

    this.logger.log(`所有卡组爬取完成`);
  }

  // 清空当前模式数据
  async clearDecks(mode: Mode): Promise<void> {
    const result = await this.decksModel.deleteMany({ mode });
    this.logger.log(`模式：${mode} 清空 ${result.deletedCount} 条数据`);
  }
}
