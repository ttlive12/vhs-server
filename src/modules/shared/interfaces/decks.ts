import type { IDeckCard } from './cards';

// 卡组数据
export interface IDeck {
  // 卡组ID
  deckId: string;

  // 卡组名称
  name: string;

  // 卡组中文名称
  zhName: string;

  // 卡组职业
  class: string;

  // 卡组代码
  deckcode: string;

  // 卡组胜率
  winrate: number;

  // 卡组对局次数
  games: number;

  // 卡组尘
  dust: number;

  // 卡组卡牌
  cards: IDeckCard[];
}
