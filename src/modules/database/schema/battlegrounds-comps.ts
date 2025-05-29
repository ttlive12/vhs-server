import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type BattlegroundsCompDocument = HydratedDocument<BattlegroundsComp>;
export type BattlegroundsCompDetailDocument = HydratedDocument<BattlegroundsCompDetail>;

/**
 * 战棋流派模型
 */
@Schema({ timestamps: true, collection: 'battlegrounds_comps' })
export class BattlegroundsComp extends Document {
  /**
   * 流派ID
   */
  @Prop({ required: true, unique: true, index: true })
  comp_id: number;

  /**
   * 流派指南最近是否更新
   */
  @Prop({ required: true })
  comp_guide_recently_updated: boolean;

  /**
   * 流派等级最近是否更新
   */
  @Prop({ required: true })
  comp_tier_recently_updated: boolean;

  /**
   * 流派原始名称
   */
  @Prop({ required: true })
  comp_original_name: string;

  /**
   * 流派显示名称
   */
  @Prop({ required: true, index: true })
  comp_name: string;

  /**
   * 流派等级 (1-5, 1为最强)
   */
  @Prop({ required: true, index: true })
  comp_tier: number;

  /**
   * 流派之前等级
   */
  @Prop({ default: null })
  comp_previous_tier: number;

  /**
   * 流派难度 (1-3, 1为最简单)
   */
  @Prop({ required: true, index: true })
  comp_difficulty: number;

  /**
   * 核心卡牌ID数组
   */
  @Prop({ type: [Number], required: true })
  comp_core_cards: number[];

  /**
   * 流派描述
   */
  @Prop({ required: true })
  comp_summary: string;

  /**
   * 最后更新时间
   */
  @Prop({ required: true })
  comp_last_updated: string;

  /**
   * 等级最后更新时间
   */
  @Prop({ required: true })
  comp_tier_last_updated: string;

  /**
   * 是否隐藏
   */
  @Prop({ required: true, default: true })
  comp_hidden: boolean;

  /**
   * 代表性卡牌ID
   */
  @Prop({ default: null })
  comp_representative_card: number;
}

/**
 * 战棋流派详细模型
 */
@Schema({ timestamps: true, collection: 'battlegrounds_comps_detail' })
export class BattlegroundsCompDetail extends Document {
  /**
   * 流派ID
   */
  @Prop({ required: true, unique: true, index: true })
  comp_id: number;

  /**
   * 流派指南管理员链接
   */
  @Prop({ default: null })
  comp_guide_admin_link: string;

  /**
   * 流派指南最近是否更新
   */
  @Prop({ required: true })
  comp_guide_recently_updated: boolean;

  /**
   * 流派指南最近是否创建
   */
  @Prop({ required: true })
  comp_guide_recently_created: boolean;

  /**
   * 流派等级最近是否更新
   */
  @Prop({ required: true })
  comp_tier_recently_updated: boolean;

  /**
   * 流派原始名称
   */
  @Prop({ required: true })
  comp_original_name: string;

  /**
   * 流派显示名称
   */
  @Prop({ required: true, index: true })
  comp_name: string;

  /**
   * 流派等级 (1-5, 1为最强)
   */
  @Prop({ required: true, index: true })
  comp_tier: number;

  /**
   * 流派之前等级
   */
  @Prop({ default: null })
  comp_previous_tier: number;

  /**
   * 流派难度 (1-3, 1为最简单)
   */
  @Prop({ required: true, index: true })
  comp_difficulty: number;

  /**
   * 核心卡牌ID数组
   */
  @Prop({ type: [Number], required: true })
  comp_core_cards: number[];

  /**
   * 辅助卡牌ID数组
   */
  @Prop({ type: [Number], required: true })
  comp_addon_cards: number[];

  /**
   * 游戏玩法说明
   */
  @Prop({ required: true })
  comp_how_to_play: string;

  /**
   * 流派描述
   */
  @Prop({ required: true })
  comp_summary: string;

  /**
   * 何时投入该流派
   */
  @Prop({ required: true })
  comp_when_to_commit: string;

  /**
   * 常见启用卡牌
   */
  @Prop({ required: true })
  comp_common_enablers: string;

  /**
   * 最近是否更新
   */
  @Prop({ required: true })
  comp_recently_updated: boolean;

  /**
   * 最后更新时间
   */
  @Prop({ required: true })
  comp_last_updated: string;

  /**
   * 等级最后更新时间
   */
  @Prop({ required: true })
  comp_tier_last_updated: string;

  /**
   * 是否隐藏
   */
  @Prop({ required: true, default: true })
  comp_hidden: boolean;

  /**
   * 代表性卡牌ID
   */
  @Prop({ default: null })
  comp_representative_card: number;
}

export const BattlegroundsCompSchema = SchemaFactory.createForClass(BattlegroundsComp);
export const BattlegroundsCompDetailSchema = SchemaFactory.createForClass(BattlegroundsCompDetail);
