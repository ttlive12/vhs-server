// 解析https://www.hsguru.com/decks?format=(1/2) 的卡组排行榜数据

import * as cheerio from 'cheerio';

import type { CardStatsDocument } from '@/modules/database/schema';

export const parseDeckStats = (html: string): CardStatsDocument[] => {
  cheerio.load(html);

  return [];
};
