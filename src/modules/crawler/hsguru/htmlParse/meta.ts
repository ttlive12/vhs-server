// 解析https://www.hsguru.com/meta?format=(1/2) 的卡组类型排行数据
import * as cheerio from 'cheerio';

import type { Archetypes } from '@/modules/shared/interfaces/archetypes';

export const parseArchetypeStats = (html: string): Array<Partial<Archetypes>> => {
  const $ = cheerio.load(html);
  const decks: Array<Partial<Archetypes>> = [];

  const rows = $('tbody tr').toArray();
  for (const element of rows) {
    const $row = $(element);
    const $nameCell = $row.find('td:first-child');
    const name = $nameCell.find('a.basic-black-text').text().trim();
    const classType = $nameCell
      .attr('class')
      ?.split(' ')
      .find((c) => !['decklist-info', 'basic-black-text'].includes(c));

    const winrateText = $row.find('td:nth-child(2) .basic-black-text').text().trim();
    const winrate = Number.parseFloat(winrateText);

    const popularityText = $row.find('td:nth-child(3)').text().trim();
    const popularityMatch = /^(\d+(?:\.\d+)?)%\s*\((\d+)\)$/.exec(popularityText);
    const popularityPercent = popularityMatch ? Number.parseFloat(popularityMatch[1]) : 0;
    const popularityNum = popularityMatch ? Number.parseInt(popularityMatch[2]) : 0;

    const climbingSpeedText = $row.find('td:last-child').text().trim();
    const climbingSpeedMatch = /^([-+]?\d+(?:\.\d+)?)⭐\/h$/.exec(climbingSpeedText);
    const ClimbingSpeed = climbingSpeedMatch ? Number.parseFloat(climbingSpeedMatch[1]) : 0;

    const deckData = {
      name,
      class: classType,
      winrate,
      popularityPercent,
      popularityNum,
      ClimbingSpeed,
    };

    decks.push(deckData);
  }

  return decks;
};
