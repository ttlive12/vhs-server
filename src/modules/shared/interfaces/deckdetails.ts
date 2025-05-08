import type { Class, Mode, Rank } from '../constants/enums';

export interface IDeckDetails {
  // 卡组ID
  deckId: string;
  // 卡组排名等级
  rank: Rank;
  // 卡组模式
  mode: Mode;
  // 卡组对战数据
  opponents: IOpponent[];
}
/**
 * 对手数据
 */
export interface IOpponent {
  /**
   * 对手职业
   */
  class: Lowercase<Class>;

  /**
   * 对局次数
   */
  games: number;

  /**
   * 胜率
   */
  winrate: number;
}
