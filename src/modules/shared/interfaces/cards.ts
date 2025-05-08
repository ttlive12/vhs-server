import type { Mode, Rank } from '..';

export interface ICard {
  /**
   * 卡牌ID
   */
  id: string;

  /**
   * 卡牌数据库ID
   */
  dbfId: number;

  /**
   * 卡牌名称
   */
  name: string;

  /**
   * 卡牌职业
   */
  cardClass: string;

  /**
   * 卡牌法力值消耗
   */
  cost: number;

  /**
   * 卡牌稀有度
   */
  rarity: string;

  /**
   * 卡牌类型
   */
  type: string;

  /**
   * 卡牌描述
   */
  text: string;
}

export interface IDeckCard extends Pick<ICard, 'id' | 'dbfId' | 'name' | 'cost' | 'rarity'> {
  /**
   * 卡牌数量
   */
  count: number;
}

/**
 * 卡牌统计数据
 */
export interface ICardStat extends Pick<ICard, 'id' | 'dbfId' | 'name' | 'cost' | 'rarity'> {
  /**
   * 携带影响
   */
  mulliganImpact: number;

  /**
   * 抽取影响
   */
  drawnImpact: number;

  /**
   * 保留影响
   */
  keptImpact: number;
}

/**
 * 留牌指南
 */
export interface IMulligan {
  name: string;
  rank: Rank;
  mode: Mode;
  cards: ICardStat[];
}
