import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

import { Class, Rarity } from '@/modules/shared/constants/cards';

export type CardDocument = HydratedDocument<Card>;

/**
 * 卡牌模型
 */
@Schema({ timestamps: true, collection: 'cards' })
export class Card extends Document {
  /**
   * 卡牌ID
   */
  @Prop({ required: true, unique: true, index: true })
  declare id: string;

  /**
   * 卡牌数据库ID
   */
  @Prop({ required: true, index: true })
  dbfId: number;

  /**
   * 卡牌名称
   */
  @Prop({ required: true })
  name: string;

  /**
   * 卡牌职业
   */
  @Prop({ enum: Class })
  cardClass: string;

  /**
   * 卡牌法力值消耗
   */
  @Prop()
  cost: number;

  /**
   * 卡牌稀有度
   */
  @Prop({ enum: Rarity })
  rarity: string;

  /**
   * 卡牌类型
   */
  @Prop()
  type: string;

  /**
   * 卡牌描述
   */
  @Prop()
  text: string;
}

export const CardSchema = SchemaFactory.createForClass(Card);
