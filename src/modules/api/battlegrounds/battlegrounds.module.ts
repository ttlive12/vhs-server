import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BattlegroundController } from './battlegrounds.controller';
import { BattlegroundService } from './battlegrounds.service';
import {
  BattlegroundsComp,
  BattlegroundsCompSchema,
  BattlegroundsCompDetail,
  BattlegroundsCompDetailSchema,
  Card,
  CardSchema,
} from '@/modules/database/schema';

/**
 * 竞技场模块
 * 提供竞技场数据的API接口
 */
@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: BattlegroundsComp.name, schema: BattlegroundsCompSchema },
        { name: BattlegroundsCompDetail.name, schema: BattlegroundsCompDetailSchema },
      ],
      'api',
    ),
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }], 'crawler'),
  ],
  controllers: [BattlegroundController],
  providers: [BattlegroundService],
  exports: [BattlegroundService],
})
export class BattlegroundModule {}
