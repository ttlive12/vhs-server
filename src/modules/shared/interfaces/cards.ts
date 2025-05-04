export interface Card {
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

/**
 * 卡牌统计数据
 */
export interface CardStat extends Card {
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
