import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

import { RANK } from '@/modules/shared/constants/cards';

export type ArchetypesDocument = HydratedDocument<Archetypes>;

/**
 * 卡组类型数据模型
 */
@Schema({ timestamps: true, collection: 'archetypes' })
export class Archetypes extends Document {
  /**
   * 卡组英文名称
   */
  @Prop({ required: true, index: true })
  name: string;

  /**
   * 卡组中文名称
   */
  @Prop()
  zhName: string;

  /**
   * 卡组职业
   */
  @Prop({ required: true })
  class: string;

  /**
   * 胜率
   */
  @Prop()
  winrate: number;

  /**
   * 流行度百分比
   */
  @Prop()
  popularityPercent: number;

  /**
   * 流行度数量
   */
  @Prop()
  popularityNum: number;

  /**
   * 爬升速度
   */
  @Prop()
  ClimbingSpeed: number;

  /**
   * 卡组排名等级
   */
  @Prop({ required: true, index: true, enum: RANK })
  rank: string;
}

export const ArchetypesSchema = SchemaFactory.createForClass(Archetypes);
