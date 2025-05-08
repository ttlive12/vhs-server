// 解析https://www.hsguru.com/meta?format=(1/2) 的卡组类型排行数据
import * as cheerio from 'cheerio';
import { parseInt } from 'lodash';
import type { IOpponent, Class } from '@/modules/shared';

export const parseDeckDetails = (html: string): IOpponent[] => {
  const $ = cheerio.load(html);
  const opponents: IOpponent[] = [];

  $('tbody tr').each((_, element) => {
    const $row = $(element);
    const $cells = $row.find('td');

    const $firstCell = $cells.eq(0);
    const className =
      $firstCell.text().trim() === 'Total'
        ? 'total'
        : ($firstCell
            .find('.tag')
            .attr('class')
            ?.split(' ')
            .find((c) => c !== 'tag' && c !== 'player-name') ?? 'unknown');

    const winrate = $cells.eq(1).find('.basic-black-text').text().trim();
    const total = parseInt($cells.eq(2).text().trim());

    opponents.push({
      class: className as Lowercase<Class>,
      winrate: Number.parseFloat(winrate),
      games: total,
    });
  });

  return opponents;
};
