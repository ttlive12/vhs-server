import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type ConfigDocument = HydratedDocument<Config>;

/**
 * 配置模型
 */
@Schema({ timestamps: true, collection: 'configs' })
export class Config extends Document {
  /**
   * 配置类型
   */
  @Prop({ required: true, index: true })
  type: string;

  /**
   * 最后更新时间
   */
  @Prop()
  lastUpdateTime: Date;

  /**
   * 描述信息
   */
  @Prop()
  description: string;
}

export const ConfigSchema = SchemaFactory.createForClass(Config);

/**
 * 特殊日期模型
 */
@Schema({ timestamps: true, collection: 'special_dates' })
export class SpecialDate extends Document {
  /**
   * 日期
   */
  @Prop({ required: true })
  date: Date;

  /**
   * 描述信息
   */
  @Prop({ required: true })
  description: string;
}

export const SpecialDateSchema = SchemaFactory.createForClass(SpecialDate);
