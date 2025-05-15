/**
 * 竞技场职业胜率接口
 */
export interface IArenaClass {
  /**
   * 职业名称
   */
  class: string;

  /**
   * 职业胜率
   */
  winRate: number;

  /**
   * 更新时间
   */
  updatedAt?: Date;
}

/**
 * 竞技场卡牌统计接口
 */
export interface IArenaCard {
  /**
   * 职业名称
   */
  class: string;

  /**
   * 卡牌数据库ID
   */
  dbfId: number;

  /**
   * 包含次数
   */
  includedCount: number;

  /**
   * 包含流行度
   */
  includedPopularity: number;

  /**
   * 包含胜率
   */
  includedWinrate: number;

  /**
   * 使用时胜率
   */
  winrateWhenPlayed?: number;

  /**
   * 更新时间
   */
  updatedAt?: Date;
}

/**
 * 带有卡牌信息的竞技场卡牌统计接口
 */
export interface IArenaCardWithInfo extends IArenaCard {
  /**
   * 卡牌费用
   */
  cost?: number;

  /**
   * 卡牌ID
   */
  id?: string;

  /**
   * 卡牌名称
   */
  name?: string;

  /**
   * 卡牌稀有度
   */
  rarity?: string;
}
