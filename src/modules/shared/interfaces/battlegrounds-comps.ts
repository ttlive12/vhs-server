/**
 * 战棋流派数据接口
 */
export interface IBattlegroundsComp {
  comp_id: number;
  comp_guide_recently_updated: boolean;
  comp_tier_recently_updated: boolean;
  comp_original_name: string;
  comp_name: string;
  comp_tier: number;
  comp_previous_tier: number | null;
  comp_difficulty: number;
  comp_core_cards: number[];
  comp_summary: string;
  comp_last_updated: string;
  comp_tier_last_updated: string;
  comp_hidden: boolean;
  comp_representative_card: number | null;
}
