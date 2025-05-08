// 解析https://www.hsguru.com/decks?format=(1/2) 的卡组排行榜数据

import * as cheerio from 'cheerio';
import { parseInt } from 'lodash';

import type { IDeck } from '@/modules/shared/interfaces/decks';

export type CrawlDecks = Pick<IDeck, 'deckId' | 'name' | 'deckcode' | 'dust' | 'games' | 'winrate' | 'class'>;

export const parseDecks = (html: string): CrawlDecks[] => {
  const $ = cheerio.load(html);
  const decks: CrawlDecks[] = [];
  const deckElements = $('div[id^="deck_stats-"]').toArray();

  for (const element of deckElements) {
    const $element = $(element);

    // 获取卡组ID
    const deckId = $element.attr('id')?.split('-')[1];
    if (!deckId) continue;

    // 获取卡组尘数
    const dustText = $element.find('.dust-bar-inner').text().trim();
    const dust = parseInt(dustText);

    const gamesText = $element.find('.column.tag').text().trim();

    // 获取卡组胜率
    const winrateMatch = /^(\d+\.?\d*)/.exec(gamesText);
    const winrate = winrateMatch ? Number.parseFloat(winrateMatch[1]) : 0;

    // 获取卡组对局次数
    const gamesMatch = /Games:\s*(\d+)/.exec(gamesText);
    const games = gamesMatch ? parseInt(gamesMatch[1]) : 0;

    // 获取卡组代码
    const titleSpan = $(element).find('.deck-title span[style="font-size: 0; line-size: 0; display: block"]');
    const deckcode = titleSpan.text().trim() || '';

    // 获取卡组名称
    const name = $(element).find('.deck-title a.basic-black-text').text().trim();

    // 获取卡组职业
    const classElement = $(element).find('.decklist-info.dust-bar');
    const classes = classElement.attr('class')?.split(' ') ?? [];
    const className = classes.find((c) => !['basic-black-text', 'decklist-info', 'dust-bar'].includes(c));

    const deckData = {
      deckId,
      name,
      deckcode,
      dust,
      games,
      winrate,
      class: className ?? '',
    };

    if (deckData.deckId && deckData.name) {
      decks.push(deckData);
    }
  }

  return decks;
};
