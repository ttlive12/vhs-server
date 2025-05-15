import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type ArenaClassDocument = HydratedDocument<ArenaClass>;

/**
 * 竞技场职业模型
 */
@Schema({ timestamps: true, collection: 'arena_classes' })
export class ArenaClass extends Document {
  /**
   * 职业名称
   */
  @Prop({ required: true })
  class: string;

  /**
   * 职业胜率
   */
  @Prop({ required: true })
  winRate: number;
}

export const ArenaClassSchema = SchemaFactory.createForClass(ArenaClass);

export type ArenaCardDocument = HydratedDocument<ArenaCard>;

/**
 * 竞技场卡牌模型
 */
@Schema({ timestamps: true, collection: 'arena_cards' })
export class ArenaCard extends Document {
  /**
   * 职业名称
   */
  @Prop({ required: true, index: true })
  class: string;

  /**
   * 卡牌数据库ID
   */
  @Prop({ required: true, index: true })
  dbfId: number;

  /**
   * 包含次数
   */
  @Prop({ required: true })
  includedCount: number;

  /**
   * 包含流行度
   */
  @Prop({ required: true })
  includedPopularity: number;

  /**
   * 包含胜率
   */
  @Prop({ required: true })
  includedWinrate: number;

  /**
   * 使用时胜率
   */
  @Prop()
  winrateWhenPlayed: number;
}

export const ArenaCardSchema = SchemaFactory.createForClass(ArenaCard);
