import type { CardDocument } from '@/modules/database/schema/card';

/**
 * 卡牌统计数据
 */
export interface CardStat extends CardDocument {
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
