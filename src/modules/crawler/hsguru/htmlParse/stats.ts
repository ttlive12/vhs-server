// 解析https://www.hsguru.com/deck/${deckId} 的对战信息数据

import * as cheerio from 'cheerio';

import type { CardStatsDocument } from '@/modules/database/schema';

export const parseStats = (html: string): CardStatsDocument[] => {
  cheerio.load(html);

  return [];
};
