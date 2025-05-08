import type { Rank } from '../constants/enums';

export interface IArchetypes {
  /**
   * 卡组英文名称
   */
  name: string;

  /**
   * 卡组中文名称
   */
  zhName: string;

  /**
   * 卡组职业
   */
  class: string;

  /**
   * 胜率
   */
  winrate: number;

  /**
   * 流行度百分比
   */
  popularityPercent: number;

  /**
   * 流行度数量
   */
  popularityNum: number;

  /**
   * 爬升速度
   */
  climbingSpeed: number;

  /**
   * 卡组排名等级
   */
  rank: Rank;
}
