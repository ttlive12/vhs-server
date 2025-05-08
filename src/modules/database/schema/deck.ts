import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { IDeckCard, Mode, Rank } from '@/modules/shared';

/**
 * 卡组模型
 */
@Schema({ timestamps: true, collection: 'decks' })
export class Deck extends Document {
  /**
   * 卡组ID
   */
  @Prop({ required: true, index: true })
  deckId: string;

  /**
   * 卡组英文名称
   */
  @Prop({ required: true, index: true })
  name: string;

  /**
   * 卡组中文名称
   */
  @Prop({ index: true })
  zhName: string;

  /**
   * 卡组职业
   */
  @Prop({ required: true, index: true })
  class: string;

  /**
   * 卡组代码
   */
  @Prop()
  deckcode: string;

  /**
   * 卡组卡牌列表
   */
  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  cards: IDeckCard[];

  /**
   * 卡组尘数
   */
  @Prop()
  dust: number;

  /**
   * 对局数
   */
  @Prop()
  games: number;

  /**
   * 胜率
   */
  @Prop()
  winrate: number;

  /**
   * 卡组排名等级
   */
  @Prop({ required: true, index: true, enum: Rank })
  rank: Rank;

  /**
   * 游戏模式 (standard/wild)
   */
  @Prop({ required: true, index: true, enum: Mode })
  mode: Mode;
}

export const DeckSchema = SchemaFactory.createForClass(Deck);
