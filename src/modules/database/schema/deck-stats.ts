import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import type { Opponent } from '@/modules/shared/interfaces/stats';

export type DeckStatsDocument = HydratedDocument<DeckStats>;

/**
 * 卡组详情模型
 */
@Schema({ timestamps: true, collection: 'deck_stats' })
export class DeckStats extends Document {
  /**
   * 卡组ID
   */
  @Prop({ required: true, index: true })
  deckId: string;

  /**
   * 卡组排名等级
   */
  @Prop({ required: true, index: true })
  rank: string;

  /**
   * 对手数据
   */
  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  opponents: Opponent[];
}

export const DeckStatsSchema = SchemaFactory.createForClass(DeckStats);
