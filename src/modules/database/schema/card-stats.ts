import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { Mode, Rank } from '@/modules/shared/constants/enums';
import { ICardStat } from '@/modules/shared/interfaces/cards';

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
  name: string;

  /**
   * 卡组排名等级
   */
  @Prop({ required: true, index: true })
  rank: Rank;

  /**
   * 卡牌统计数据
   */
  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  cards: ICardStat[];

  /**
   * 卡组模式
   */
  @Prop({ required: true, index: true, enum: Mode })
  mode: Mode;
}

export const CardStatsSchema = SchemaFactory.createForClass(CardStats);
