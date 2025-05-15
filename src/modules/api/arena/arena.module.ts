import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ArenaController } from './arena.controller';
import { ArenaService } from './arena.service';
import { ArenaCard, ArenaCardSchema, ArenaClass, ArenaClassSchema, Card, CardSchema } from '@/modules/database/schema';

/**
 * 竞技场模块
 * 提供竞技场数据的API接口
 */
@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: ArenaClass.name, schema: ArenaClassSchema },
        { name: ArenaCard.name, schema: ArenaCardSchema },
      ],
      'api',
    ),
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }], 'crawler'),
  ],
  controllers: [ArenaController],
  providers: [ArenaService],
  exports: [ArenaService],
})
export class ArenaModule {}
