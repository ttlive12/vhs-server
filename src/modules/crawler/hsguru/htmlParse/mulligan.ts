import * as cheerio from 'cheerio';

import { parseInt } from 'lodash';
import type { ICardStat } from '@/modules/shared';

export type IMulligan = Pick<ICardStat, 'dbfId' | 'mulliganImpact' | 'drawnImpact' | 'keptImpact'>;

// 解析https://www.hsguru.com/card-stats?archetype=${archetypeName} 的卡牌指南数据
export const parseMulligan = (html: string): IMulligan[] => {
  const $ = cheerio.load(html);
  const cards: IMulligan[] = [];

  $('tbody tr').each((_, element) => {
    const $row = $(element);
    const dbfId = $row
      .find('.decklist-card')
      .attr('class')
      ?.match(/card-(\d+)/)?.[1];

    if (!dbfId) return;

    const mulliganImpact = Number.parseFloat($row.find('td:nth-child(2) .basic-black-text').text());
    const drawnImpact = Number.parseFloat($row.find('td:nth-child(3) .basic-black-text').text());
    const keptImpact = Number.parseFloat($row.find('td:nth-child(4) .basic-black-text').text());

    cards.push({
      dbfId: parseInt(dbfId),
      mulliganImpact,
      drawnImpact,
      keptImpact,
    });
  });

  return cards;
};
