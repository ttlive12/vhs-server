// 解析https://www.hsguru.com/meta?format=(1/2) 的卡组类型排行数据

import * as cheerio from 'cheerio';

import type { CardStatsDocument } from '@/modules/database/schema';

export const parseArchetypeStats = (html: string): CardStatsDocument[] => {
  cheerio.load(html);

  return [];
};
