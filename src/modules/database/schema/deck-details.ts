import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import type { IOpponent } from '@/modules/shared';
import { Mode, Rank } from '@/modules/shared/constants/enums';

export type DeckDetailsDocument = HydratedDocument<DeckDetails>;

/**
 * 卡组详情模型
 */
@Schema({ timestamps: true, collection: 'deck_details' })
export class DeckDetails extends Document {
  /**
   * 卡组ID
   */
  @Prop({ required: true, index: true })
  deckId: string;

  /**
   * 卡组排名等级
   */
  @Prop({ required: true, index: true })
  rank: Rank;

  /**
   * 模式
   */
  @Prop({ required: true, index: true })
  mode: Mode;

  /**
   * 对手数据
   */
  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  opponents: IOpponent[];
}

export const DeckDetailsSchema = SchemaFactory.createForClass(DeckDetails);
