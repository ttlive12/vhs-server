// 解析https://www.hsguru.com/meta?format=(1/2) 的卡组类型排行数据
import * as cheerio from 'cheerio';

import { parseInt } from 'lodash';
import type { IArchetypes } from '@/modules/shared/interfaces/archetypes';

export type crawlArchetypes = Pick<IArchetypes, 'name' | 'class' | 'winrate' | 'popularityPercent' | 'popularityNum' | 'climbingSpeed'>;

export const parseArchetypeStats = (html: string): crawlArchetypes[] => {
  const $ = cheerio.load(html);
  const decks: crawlArchetypes[] = [];

  const rows = $('tbody tr').toArray();
  for (const element of rows) {
    const $row = $(element);
    const $nameCell = $row.find('td:first-child');
    const name = $nameCell.find('a.basic-black-text').text().trim();
    const classType =
      $nameCell
        .attr('class')
        ?.split(' ')
        .find((c) => !['decklist-info', 'basic-black-text'].includes(c)) ?? '';

    const winrateText = $row.find('td:nth-child(2) .basic-black-text').text().trim();
    const winrate = Number.parseFloat(winrateText);

    const popularityText = $row.find('td:nth-child(3)').text().trim();
    const popularityMatch = /^(\d+(?:\.\d+)?)%\s*\((\d+)\)$/.exec(popularityText);
    const popularityPercent = popularityMatch ? Number.parseFloat(popularityMatch[1]) : 0;
    const popularityNum = popularityMatch ? parseInt(popularityMatch[2]) : 0;

    const climbingSpeedText = $row.find('td:last-child').text().trim();
    const climbingSpeedMatch = /^([-+]?\d+(?:\.\d+)?)⭐\/h$/.exec(climbingSpeedText);
    const climbingSpeed = climbingSpeedMatch ? Number.parseFloat(climbingSpeedMatch[1]) : 0;

    const deckData = {
      name,
      class: classType,
      winrate,
      popularityPercent,
      popularityNum,
      climbingSpeed,
    };

    decks.push(deckData);
  }

  return decks;
};
