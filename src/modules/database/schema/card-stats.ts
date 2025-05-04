import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { Rank } from '@/modules/shared/constants/cards';
import { CardStat } from '@/modules/shared/interfaces/cards';

export type CardStatsDocument = HydratedDocument<CardStats>;
/**
 * 卡牌统计模型
 */
@Schema({ timestamps: true, collection: 'card_stats' })
export class CardStats extends Document {
  /**
   * 卡组英文名称
   */
  @Prop({ required: true, index: true })
  deckName: string;

  /**
   * 卡组排名等级
   */
  @Prop({ required: true, index: true })
  rank: Rank;

  /**
   * 卡牌统计数据
   */
  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  cards: CardStat[];
}

export const CardStatsSchema = SchemaFactory.createForClass(CardStats);
