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

/**
 * 战棋流派详细数据接口
 */
export interface IBattlegroundsCompDetail {
  comp_id: number;
  comp_guide_admin_link: string | null;
  comp_guide_recently_updated: boolean;
  comp_guide_recently_created: boolean;
  comp_tier_recently_updated: boolean;
  comp_original_name: string;
  comp_name: string;
  comp_tier: number;
  comp_previous_tier: number | null;
  comp_difficulty: number;
  comp_core_cards: number[];
  comp_addon_cards: number[];
  comp_how_to_play: string;
  comp_summary: string;
  comp_when_to_commit: string;
  comp_common_enablers: string;
  comp_recently_updated: boolean;
  comp_last_updated: string;
  comp_tier_last_updated: string;
  comp_hidden: boolean;
  comp_representative_card: number | null;
}
