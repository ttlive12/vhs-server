import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * 翻译模型
 */
@Schema({ collection: 'translations' })
export class Translation extends Document {
  /**
   * 英文名称
   */
  @Prop({ required: true, unique: true, index: true })
  enName: string;

  /**
   * 中文名称
   */
  @Prop()
  zhName: string;
}

export const TranslationSchema = SchemaFactory.createForClass(Translation);
