import { Rank, MinGames } from './enums';

// 卡组类型数据降级序列
export const ARCHETYPE_SEQUENCE: Record<Rank, MinGames[]> = {
  [Rank.TOP_LEGEND]: [MinGames.MIN_NULL, MinGames.MIN_1000, MinGames.MIN_500, MinGames.MIN_250, MinGames.MIN_100],
  [Rank.DIAMOND_4TO1]: [MinGames.MIN_NULL, MinGames.MIN_1000, MinGames.MIN_500, MinGames.MIN_250, MinGames.MIN_100],
  [Rank.DIAMOND_TO_LEGEND]: [MinGames.MIN_NULL, MinGames.MIN_1000, MinGames.MIN_500, MinGames.MIN_250, MinGames.MIN_100],
  [Rank.TOP_5K]: [MinGames.MIN_NULL, MinGames.MIN_1000, MinGames.MIN_500, MinGames.MIN_250, MinGames.MIN_100],
};

// 卡组数据降级序列
export const DECK_SEQUENCE: Record<Rank, MinGames[]> = {
  [Rank.TOP_LEGEND]: [MinGames.MIN_200, MinGames.MIN_100, MinGames.MIN_50],
  [Rank.DIAMOND_4TO1]: [MinGames.MIN_1600, MinGames.MIN_800, MinGames.MIN_100],
  [Rank.DIAMOND_TO_LEGEND]: [MinGames.MIN_3200, MinGames.MIN_1600, MinGames.MIN_800, MinGames.MIN_100],
  [Rank.TOP_5K]: [MinGames.MIN_400, MinGames.MIN_200, MinGames.MIN_100, MinGames.MIN_50],
};
