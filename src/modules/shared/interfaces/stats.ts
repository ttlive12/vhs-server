/**
 * 对手数据
 */
export interface Opponent {
  /**
   * 对手名称
   */
  name: string;

  /**
   * 对手职业
   */
  class: string;

  /**
   * 对局次数
   */
  games: number;

  /**
   * 胜率
   */
  winrate: number;
}
