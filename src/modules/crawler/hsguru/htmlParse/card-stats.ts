import * as cheerio from 'cheerio';

import type { CardStatsDocument } from '@/modules/database/schema';

// 解析https://www.hsguru.com/card-stats?archetype=${archetypeName} 的卡牌指南数据
export const parseCardStats = (html: string): CardStatsDocument[] => {
  cheerio.load(html);

  return [];
};
